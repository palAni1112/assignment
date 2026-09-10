interface QuickStats {
  total: number;
  completed: number;
  scheduled: number;
  cancelled: number;
}

interface Props {
  stats: QuickStats;
  activeNav?: string;
  onNavClick?: (nav: string) => void;
}

export function Sidebar({
  stats,
  activeNav = "appointments",
  onNavClick,
}: Props) {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand__logo">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="4" width="18" height="18" rx="4" />
            <line x1="16" y1="2" x2="16" y2="6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="2" x2="8" y2="6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <line x1="3" y1="10" x2="21" y2="10" stroke="#ffffff" strokeWidth="2" />
          </svg>
        </div>
        <span className="sidebar-brand__title">TeamSchedule</span>
      </div>

      <nav className="sidebar-nav">
        <button
          type="button"
          className={`sidebar-nav__item ${activeNav === "appointments" ? "sidebar-nav__item--active" : ""}`}
          onClick={() => onNavClick?.("appointments")}
        >
          <svg className="sidebar-nav__icon" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
          <span>Appointments</span>
        </button>

        <button
          type="button"
          className={`sidebar-nav__item ${activeNav === "calendar" ? "sidebar-nav__item--active" : ""}`}
          onClick={() => onNavClick?.("calendar")}
        >
          <svg className="sidebar-nav__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
            <rect x="3" y="4" width="14" height="13" rx="2" />
            <path d="M16 2v4M4 2v4M3 8h14" />
          </svg>
          <span>Calendar</span>
        </button>

        <button
          type="button"
          className={`sidebar-nav__item ${activeNav === "team" ? "sidebar-nav__item--active" : ""}`}
          onClick={() => onNavClick?.("team")}
        >
          <svg className="sidebar-nav__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M13 7a3 3 0 11-6 0 3 3 0 016 0zM4 14a6 6 0 0112 0v2H4v-2z" />
          </svg>
          <span>Team</span>
        </button>

        <button
          type="button"
          className={`sidebar-nav__item ${activeNav === "settings" ? "sidebar-nav__item--active" : ""}`}
          onClick={() => onNavClick?.("settings")}
        >
          <svg className="sidebar-nav__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="10" cy="10" r="3" />
            <path d="M16 10a6 6 0 00-.2-1.5l1.6-1.2-1.4-2.4-1.9.7a6 6 0 00-2.6-1.5V2H8.5v2.1a6 6 0 00-2.6 1.5l-1.9-.7-1.4 2.4 1.6 1.2A6 6 0 004 10a6 6 0 00.2 1.5l-1.6 1.2 1.4 2.4 1.9-.7a6 6 0 002.6 1.5V18h3v-2.1a6 6 0 002.6-1.5l1.9.7 1.4-2.4-1.6-1.2A6 6 0 0016 10z" />
          </svg>
          <span>Settings</span>
        </button>
      </nav>

      <div className="sidebar-stats">
        <h4 className="sidebar-stats__title">Quick Stats</h4>
        <div className="sidebar-stats__list">
          <div className="sidebar-stat-item">
            <div className="sidebar-stat-icon sidebar-stat-icon--total">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </div>
            <div className="sidebar-stat-info">
              <span className="sidebar-stat-number">{stats.total}</span>
              <span className="sidebar-stat-label">Total appointments</span>
            </div>
          </div>

          <div className="sidebar-stat-item">
            <div className="sidebar-stat-icon sidebar-stat-icon--completed">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="sidebar-stat-info">
              <span className="sidebar-stat-number">{stats.completed}</span>
              <span className="sidebar-stat-label">Completed</span>
            </div>
          </div>

          <div className="sidebar-stat-item">
            <div className="sidebar-stat-icon sidebar-stat-icon--scheduled">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <circle cx="10" cy="10" r="7" />
                <path d="M10 6v4l2.5 2" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <div className="sidebar-stat-info">
              <span className="sidebar-stat-number">{stats.scheduled}</span>
              <span className="sidebar-stat-label">Scheduled</span>
            </div>
          </div>

          <div className="sidebar-stat-item">
            <div className="sidebar-stat-icon sidebar-stat-icon--cancelled">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="sidebar-stat-info">
              <span className="sidebar-stat-number">{stats.cancelled}</span>
              <span className="sidebar-stat-label">Cancelled</span>
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-profile__avatar">JD</div>
          <div className="user-profile__info">
            <span className="user-profile__name">John Doe</span>
            <span className="user-profile__role">Team Lead</span>
          </div>
        </div>
        <button type="button" className="sidebar-logout-btn" title="Logout">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M13 14l3-3m0 0l-3-3m3 3H7m6 6v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
