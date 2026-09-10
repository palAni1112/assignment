import "./App.css";

import { AppointmentBoard } from "./components/AppointmentBoard";

function App() {
  return (
    <main className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">TEAM SCHEDULE</p>
          <h1>Appointment Board</h1>
          <p className="subtitle">
            View and manage your team's appointments.
          </p>
        </div>
      </header>

      <AppointmentBoard />
    </main>
  );
}

export default App;
