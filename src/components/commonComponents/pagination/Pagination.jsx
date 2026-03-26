import { useMemo } from "react";
import Icon from "@/components/icons/Icon";

const LIMIT_OPTIONS = [10, 20, 25, 50, 100];

/**
 * Standalone Pagination component — works with any list/table.
 *
 * @param {number}   totalRecords   - Total record count from API
 * @param {number}   totalPages     - Total pages from API
 * @param {number}   currentPage    - Active page (1-based)
 * @param {number}   currentLimit   - Rows per page
 * @param {Function} onPageChange   - (page) => void
 * @param {Function} onLimitChange  - (limit) => void
 * @param {number[]} [limitOptions] - Custom per-page options
 * @param {string}   [className]    - Extra wrapper classes
 */
export default function Pagination({
  totalRecords = 0,
  totalPages = 1,
  currentPage = 1,
  currentLimit = 10,
  onPageChange,
  onLimitChange,
  limitOptions = LIMIT_OPTIONS,
  className = "",
}) {
  // ─── Range text: "1-10 of 52" ─────────────────────────────
  const rangeStart = totalRecords === 0 ? 0 : (currentPage - 1) * currentLimit + 1;
  const rangeEnd = Math.min(currentPage * currentLimit, totalRecords);

  // ─── Page numbers to display ──────────────────────────────
  const pages = useMemo(
    () => getVisiblePages(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  if (totalRecords === 0) return null;

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 border-t border-border-light bg-surface text-sm ${className}`}
    >
      {/* Left: Rows per page + range */}
      <div className="flex items-center gap-4 text-neutral-500">
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap">Rows per page:</span>
          <select
            value={currentLimit}
            onChange={(e) => onLimitChange?.(Number(e.target.value))}
            className="bg-transparent  rounded px-1.5 py-0.5 text-sm text-text-primary cursor-pointer focus:outline-none focus:border-primary"
          >
            {limitOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <span className="whitespace-nowrap text-neutral-500">
          {rangeStart}-{rangeEnd} of {totalRecords}
        </span>
      </div>

      {/* Right: Page navigation */}
      <div className="flex items-center gap-1">
        

        {/* Previous */}
        <NavButton
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={isFirst}
          aria-label="Previous page"
        >
          <Icon name="chevron-first" size={16} />
        </NavButton>

        {/* Page numbers */}
        {pages.map((page, i) =>
          page === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="w-8 h-8 flex items-center justify-center text-neutral-400"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => page !== currentPage && onPageChange?.(page)}
              className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium transition-colors cursor-pointer
                ${
                  page === currentPage
                    ? "bg-primary text-text-inverse"
                    : "text-neutral-600 hover:bg-neutral-100"
                }
              `}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <NavButton
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={isLast}
          aria-label="Next page"
        >
          <Icon name="chevron-last" size={16} />
        </NavButton>

      
      </div>
    </div>
  );
}

// ─── Nav arrow button ────────────────────────────────────────
function NavButton({ children, disabled, onClick, ...props }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`w-8 h-8 rounded flex items-center justify-center transition-colors cursor-pointer
        ${disabled ? "text-neutral-300 cursor-not-allowed" : "text-neutral-600 hover:bg-neutral-100"}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

// ─── Visible page numbers with ellipsis ──────────────────────
// Always shows: first, last, current, and 1 sibling each side
function getVisiblePages(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set([1, total, current, current - 1, current + 1]);

  // Remove out-of-range
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  // Insert ellipsis where gaps exist
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push("...");
    }
    result.push(sorted[i]);
  }

  return result;
}
