import type {
  AppointmentFilters,
  AppointmentStatus,
} from "../types/appointment";

interface Props {
  filters: AppointmentFilters;
  onChange: (filters: AppointmentFilters) => void;
  onClear: () => void;
}

export function FilterBar({
  filters,
  onChange,
  onClear,
}: Props) {
  const hasActiveFilters = Boolean(filters.date || filters.status);

  return (
    <div className="filter-bar">
      <div className="filter-bar__header">
        <div className="filter-bar__title">
          <svg
            className="filter-bar__icon"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            <path d="M3 4h14M6 9h8M8 14h4" />
          </svg>
          <span>Filter Appointments</span>
        </div>

        {hasActiveFilters && (
          <span className="filter-bar__badge">Active filters</span>
        )}
      </div>

      <div className="filter-bar__controls">
        <label className="filter-control">
          <span className="filter-control__label">Date</span>
          <div className="filter-control__input-wrapper">
            <input
              type="date"
              className="filter-input"
              value={filters.date ?? ""}
              onChange={(event) =>
                onChange({
                  ...filters,
                  date: event.target.value || undefined,
                })
              }
            />
          </div>
        </label>

        <label className="filter-control">
          <span className="filter-control__label">Status</span>
          <div className="filter-control__select-wrapper">
            <select
              className="filter-select"
              value={filters.status ?? ""}
              onChange={(event) =>
                onChange({
                  ...filters,
                  status:
                    (event.target.value ||
                      undefined) as
                      | AppointmentStatus
                      | undefined,
                })
              }
            >
              <option value="">All statuses</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <svg
              className="select-arrow"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </label>

        {hasActiveFilters && (
          <button
            type="button"
            className="filter-bar__clear-btn"
            onClick={onClear}
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <line x1="4" y1="4" x2="12" y2="12" />
              <line x1="12" y1="4" x2="4" y2="12" />
            </svg>
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
