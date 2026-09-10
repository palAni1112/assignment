import "./App.css";

import { AppointmentBoard } from "./components/AppointmentBoard";

function App() {
  return (
    <main className="app">
      <header className="app-header">
        <div className="app-header__brand">
          <div className="brand-badge">
            <svg
              className="brand-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="3" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <p className="eyebrow">TEAM SCHEDULE</p>
          </div>
          <div className="live-indicator">
            <span className="live-indicator__dot" aria-hidden="true" />
            <span>Neon DB Connected</span>
          </div>
        </div>

        <div className="app-header__main">
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
