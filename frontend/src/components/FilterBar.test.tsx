import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FilterBar } from "./FilterBar";

describe("FilterBar", () => {
  it("renders date input and status select with options", () => {
    render(
      <FilterBar
        filters={{}}
        onChange={vi.fn()}
        onClear={vi.fn()}
      />
    );

    expect(screen.getByLabelText("Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Status")).toBeInTheDocument();

    expect(screen.getByRole("option", { name: "All statuses" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Scheduled" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Completed" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Cancelled" })).toBeInTheDocument();

    expect(screen.queryByRole("button", { name: "Clear filters" })).not.toBeInTheDocument();
  });

  it("renders clear button when date or status filters are applied", () => {
    const onClear = vi.fn();
    render(
      <FilterBar
        filters={{ status: "SCHEDULED" }}
        onChange={vi.fn()}
        onClear={onClear}
      />
    );

    const clearButton = screen.getByRole("button", { name: "Clear filters" });
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
