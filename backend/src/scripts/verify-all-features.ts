import { prisma } from "../lib/prisma.js";

const BASE_URL = "http://localhost:8001/api";

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, details?: string) {
  if (condition) {
    results.push({ name, passed: true });
    console.log(`✅ PASS: ${name}`);
  } else {
    results.push({ name, passed: false, details });
    console.error(`❌ FAIL: ${name} - ${details || "Assertion failed"}`);
  }
}

async function runAudit() {
  console.log("==================================================");
  console.log("  COMPREHENSIVE APPOINTMENT BOARD FEATURE AUDIT  ");
  console.log("==================================================\n");

  // 1. Health Check
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    assert(res.status === 200 && data.success === true, "1. Health API returns status ok");
  } catch (err) {
    assert(false, "1. Health API is responsive", String(err));
  }

  // 2. Database Conflict Integrity Check
  try {
    const all = await prisma.appointment.findMany();
    let hasConflict = false;
    for (let i = 0; i < all.length; i++) {
      for (let j = i + 1; j < all.length; j++) {
        const a1 = all[i];
        const a2 = all[j];
        const d1 = a1.date.toISOString().slice(0, 10);
        const d2 = a2.date.toISOString().slice(0, 10);
        if (d1 === d2 && a1.status === "SCHEDULED" && a2.status === "SCHEDULED") {
          const s1 = a1.startTime.toISOString().slice(11, 16);
          const e1 = a1.endTime.toISOString().slice(11, 16);
          const s2 = a2.startTime.toISOString().slice(11, 16);
          const e2 = a2.endTime.toISOString().slice(11, 16);
          if (s1 < e2 && s2 < e1) {
            hasConflict = true;
            console.error(`Found conflict in DB: ${a1.title} and ${a2.title} on ${d1}`);
          }
        }
      }
    }
    assert(!hasConflict, "2. No overlapping SCHEDULED appointments in database");
  } catch (err) {
    assert(false, "2. Database conflict check", String(err));
  }

  // 3. Query & Filtering
  try {
    const resAll = await fetch(`${BASE_URL}/appointments`);
    const dataAll = await resAll.json();
    assert(resAll.status === 200 && Array.isArray(dataAll.data), "3a. GET /appointments returns list");

    const resDate = await fetch(`${BASE_URL}/appointments?date=2026-09-10`);
    const dataDate = await resDate.json();
    const allMatchDate = dataDate.data.every((a: any) => a.date.slice(0, 10) === "2026-09-10");
    assert(resDate.status === 200 && allMatchDate, "3b. GET /appointments?date=YYYY-MM-DD filters correctly");

    const resStatus = await fetch(`${BASE_URL}/appointments?status=SCHEDULED`);
    const dataStatus = await resStatus.json();
    const allMatchStatus = dataStatus.data.every((a: any) => a.status === "SCHEDULED");
    assert(resStatus.status === 200 && allMatchStatus, "3c. GET /appointments?status=SCHEDULED filters correctly");
  } catch (err) {
    assert(false, "3. Query and filtering tests", String(err));
  }

  // 4. Time Validation & Conflict Prevention
  const TEST_DATE = "2026-12-25";
  let apptAId = "";

  try {
    // Clean up test date before test
    await prisma.appointment.deleteMany({
      where: { date: new Date(`${TEST_DATE}T00:00:00Z`) },
    });

    // 4a. Reject missing title
    const resNoTitle = await fetch(`${BASE_URL}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: TEST_DATE,
        startTime: "10:00",
        endTime: "11:00",
      }),
    });
    assert(resNoTitle.status === 400, "4a. Rejects missing title with 400 VALIDATION_ERROR");

    // 4b. Reject end <= start
    const resEndBeforeStart = await fetch(`${BASE_URL}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Bad Time",
        date: TEST_DATE,
        startTime: "11:00",
        endTime: "10:00",
      }),
    });
    assert(resEndBeforeStart.status === 400, "4b. Rejects endTime <= startTime with 400 VALIDATION_ERROR");

    // 4c. Create Appointment A: 10:00 - 11:00
    const resA = await fetch(`${BASE_URL}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test A",
        description: "Initial booking",
        date: TEST_DATE,
        startTime: "10:00",
        endTime: "11:00",
      }),
    });
    const dataA = await resA.json();
    apptAId = dataA.data?.id;
    assert(resA.status === 201 && dataA.data?.title === "Test A", "4c. Successfully creates valid appointment (201)");

    // 4d. Reject Overlapping Appointment B: 10:30 - 11:30
    const resConflict = await fetch(`${BASE_URL}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test B Conflict",
        date: TEST_DATE,
        startTime: "10:30",
        endTime: "11:30",
      }),
    });
    const dataConflict = await resConflict.json();
    assert(
      resConflict.status === 409 && dataConflict.error?.code === "TIME_SLOT_CONFLICT",
      "4d. Rejects overlapping time slot with 409 TIME_SLOT_CONFLICT"
    );

    // 4e. Allow Adjacent Appointment: 11:00 - 12:00
    const resAdjacent = await fetch(`${BASE_URL}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test Adjacent",
        date: TEST_DATE,
        startTime: "11:00",
        endTime: "12:00",
      }),
    });
    assert(resAdjacent.status === 201, "4e. Allows adjacent time slot [10-11) and [11-12) with 201");

    // 4f. Cancel Appointment A and verify slot reuse
    const resCancel = await fetch(`${BASE_URL}/appointments/${apptAId}/cancel`, {
      method: "PATCH",
    });
    assert(resCancel.status === 200, "4f. Cancels appointment with 200");

    // Reuse cancelled slot: 10:00 - 11:00
    const resReuse = await fetch(`${BASE_URL}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test Reused Slot",
        date: TEST_DATE,
        startTime: "10:00",
        endTime: "11:00",
      }),
    });
    assert(resReuse.status === 201, "4g. Allows reusing cancelled appointment slot with 201");
  } catch (err) {
    assert(false, "4. Conflict and time validation tests", String(err));
  }

  // 5. Lifecycle Transitions
  try {
    // Create new for lifecycle test: 14:00 - 15:00
    const resLife = await fetch(`${BASE_URL}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Lifecycle Test",
        date: TEST_DATE,
        startTime: "14:00",
        endTime: "15:00",
      }),
    });
    const lifeAppt = (await resLife.json()).data;

    // SCHEDULED -> COMPLETED
    const resComp = await fetch(`${BASE_URL}/appointments/${lifeAppt.id}/complete`, {
      method: "PATCH",
    });
    assert(resComp.status === 200, "5a. Transition SCHEDULED -> COMPLETED succeeds (200)");

    // COMPLETED -> CANCELLED (must be rejected with 409)
    const resBadCancel = await fetch(`${BASE_URL}/appointments/${lifeAppt.id}/cancel`, {
      method: "PATCH",
    });
    const badCancelData = await resBadCancel.json();
    assert(
      resBadCancel.status === 409 && badCancelData.error?.code === "INVALID_STATUS_TRANSITION",
      "5b. Rejects COMPLETED -> CANCELLED transition with 409 INVALID_STATUS_TRANSITION"
    );
  } catch (err) {
    assert(false, "5. Lifecycle transition tests", String(err));
  }

  // 6. Cleanup test data
  await prisma.appointment.deleteMany({
    where: { date: new Date(`${TEST_DATE}T00:00:00Z`) },
  });

  console.log("\n==================================================");
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  console.log(`SUMMARY: ${passed} / ${total} tests passed.`);
  console.log("==================================================");
}

runAudit().finally(() => prisma.$disconnect());
