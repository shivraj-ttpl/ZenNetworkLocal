const SHIMMER_WIDTHS = ['60%', '75%', '45%', '80%', '50%', '70%', '55%', '65%'];

const DEFAULT_ROWS = 25;

function getShimmerWidth(rowIndex, colIndex) {
  return SHIMMER_WIDTHS[(rowIndex * 3 + colIndex) % SHIMMER_WIDTHS.length];
}

/**
 * Renders skeleton placeholder rows for the Table component.
 * Placed directly inside <tbody> — header stays intact.
 *
 * Renders enough rows to fill any viewport. The Table's scroll container
 * clips overflow during loading, so only visible rows are shown regardless
 * of whether maxHeight is a fixed value or a CSS expression like calc().
 *
 * @param {number} columnCount   - Number of visible columns
 * @param {number} [rows]        - Explicit row count override
 * @param {string} cellClassName - Padding/text classes matching the table's size variant
 */
export default function TableSkeleton({
  columnCount,
  rows = DEFAULT_ROWS,
  cellClassName,
}) {
  return Array.from({ length: rows }, (_r, rowIdx) => (
    <tr
      key={`skeleton-${rowIdx}`}
      className="border-b border-border-light last:border-b-0"
    >
      {Array.from({ length: columnCount }, (_c, colIdx) => (
        <td
          key={`skeleton-${rowIdx}-${colIdx}`}
          className={`${cellClassName} whitespace-nowrap`}
        >
          <div
            className="h-4 rounded-md bg-neutral-200 animate-pulse"
            style={{ width: getShimmerWidth(rowIdx, colIdx) }}
          />
        </td>
      ))}
    </tr>
  ));
}
