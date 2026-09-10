-- Enable btree_gist extension for combining scalar equality with range types in GIST index
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Prevent overlapping time slots for SCHEDULED appointments on the same date
ALTER TABLE "appointments"
ADD CONSTRAINT "appointments_no_scheduled_overlap"
EXCLUDE USING gist (
  "date" WITH =,
  tsrange(
    "date" + "startTime",
    "date" + "endTime",
    '[)'
  ) WITH &&
)
WHERE ("status" = 'SCHEDULED');