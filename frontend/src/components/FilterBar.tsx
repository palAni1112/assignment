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
  return (
    <div className="filter-bar">
      <label>
        Date
        <input
          type="date"
          value={filters.date ?? ""}
          onChange={(event) =>
            onChange({
              ...filters,
              date: event.target.value || undefined,
            })
          }
        />
      </label>

      <label>
        Status
        <select
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
          <option value="SCHEDULED">
            Scheduled
          </option>
          <option value="COMPLETED">
            Completed
          </option>
          <option value="CANCELLED">
            Cancelled
          </option>
        </select>
      </label>

      {(filters.date || filters.status) && (
        <button
          type="button"
          onClick={onClear}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
