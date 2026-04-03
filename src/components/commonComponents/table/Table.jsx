import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useCallback, useMemo, useRef } from 'react';

import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import TableSkeleton from '@/components/commonComponents/skeletons/TableSkeleton';
import Icon from '@/components/icons/Icon';

import {
  computeStickyOffsets,
  getCellClasses,
  getCellStyle,
  SORT_ORDER,
} from './tableHelpers';

// ─── Size variants ──────────────────────────────────────────
const SIZE_CLASSES = {
  sm: {
    cell: 'px-[16px] py-[8px] text-[14px]',
    header: 'px-[16px] py-[10px] text-[12px]',
  },
  md: {
    cell: 'px-[17px] py-[10px] text-[16px]',
    header: 'px-[17px] py-[12px] text-[14px]',
  },
  lg: {
    cell: 'px-[18px] py-[12px] text-[18px]',
    header: 'px-[18px] py-[14px] text-[16px]',
  },
};

/**
 * Reusable, config-driven Table component.
 * Sorting is MANUAL — the table does NOT sort data itself.
 * It only renders sort indicators and fires onSortChange
 * so the consumer can call the API with updated sort params.
 *
 * @param {Object} props
 * @param {Array}   props.columns          - TanStack column defs (use buildColumns helper)
 * @param {Array}   props.data             - Row data array
 * @param {"sm"|"md"|"lg"} [props.size]    - Row density variant
 * @param {boolean} [props.stickyHeader]   - Keep header visible on scroll
 * @param {number}  [props.maxHeight]      - Scrollable body max-height in px
 *
 * — Sorting (manual / API-driven) —
 * @param {string}  [props.sortKey]        - Currently sorted column's sortKey
 * @param {string}  [props.sortOrder]      - "asc" | "desc"
 * @param {Function} [props.onSortChange]  - (sortKey, sortOrder) => void
 *
 * — Selection —
 * @param {boolean}  [props.selectable]         - Enable row checkboxes
 * @param {boolean}  [props.selectAll]          - Show header select-all checkbox
 * @param {string}   [props.selectId]           - Row field used as unique id (default "id")
 * @param {Object}   [props.selectedRows]       - { [rowId]: true } controlled state
 * @param {Function} [props.onSelectionChange]  - (updatedSelection) => void
 * @param {Function} [props.isRowDisabled]      - (row) => boolean
 * @param {number}   [props.maxSelection]       - Max selectable rows
 * @param {Function} [props.onMaxExceeded]      - Called when selection limit hit
 *
 * — Customisation —
 * @param {string}   [props.className]          - Extra classes on wrapper
 * @param {string}   [props.emptyMessage]       - Shown when data is empty
 * @param {Function} [props.onRowClick]         - (row) => void
 * @param {Function} [props.rowClassName]       - (row) => string — dynamic row classes
 * @param {boolean}  [props.loading]            - Show loading overlay
 */
export default function Table({
  columns,
  data = [],
  size = 'md',
  stickyHeader = true,
  maxHeight,

  // Sorting (manual)
  sortKey = null,
  sortOrder = null,
  onSortChange,

  // Selection
  selectable = false,
  selectAll = true,
  selectId = 'id',
  selectedRows = {},
  onSelectionChange,
  isRowDisabled,
  maxSelection = null,
  onMaxExceeded,

  // Customisation
  className = '',
  emptyMessage = 'No data available',
  onRowClick,
  rowClassName,
  loading = false,
}) {
  const sizeClasses = SIZE_CLASSES[size] || SIZE_CLASSES.sm;
  const scrollRef = useRef(null);

  // ─── Selection column ─────────────────────────────────────
  const selectionColumn = useMemo(() => {
    if (!selectable) return null;

    return {
      id: '_select',
      header: ({ table }) => {
        if (!selectAll) return null;

        const allRows = table.getRowModel().rows;
        const enabledRows = allRows.filter((r) => !isRowDisabled?.(r.original));
        const allChecked =
          enabledRows.length > 0 &&
          enabledRows.every((r) => selectedRows[r.original[selectId]]);
        const someChecked =
          !allChecked &&
          enabledRows.some((r) => selectedRows[r.original[selectId]]);

        return (
          <Checkbox
            checked={allChecked}
            indeterminate={someChecked}
            onChange={() => {
              const next = { ...selectedRows };
              if (allChecked) {
                enabledRows.forEach((r) => delete next[r.original[selectId]]);
              } else {
                for (const r of enabledRows) {
                  if (
                    maxSelection &&
                    Object.keys(next).length >= maxSelection
                  ) {
                    onMaxExceeded?.(maxSelection);
                    break;
                  }
                  next[r.original[selectId]] = true;
                }
              }
              onSelectionChange?.(next);
            }}
          />
        );
      },
      cell: ({ row }) => {
        const disabled = isRowDisabled?.(row.original) ?? false;
        const id = row.original[selectId];

        return (
          <Checkbox
            checked={!!selectedRows[id]}
            disabled={disabled}
            onChange={() => {
              const next = { ...selectedRows };
              if (next[id]) {
                delete next[id];
              } else {
                if (maxSelection && Object.keys(next).length >= maxSelection) {
                  onMaxExceeded?.(maxSelection);
                  return;
                }
                next[id] = true;
              }
              onSelectionChange?.(next);
            }}
          />
        );
      },
      meta: { width: 48, align: 'center', sticky: null },
      enableSorting: false,
    };
  }, [
    selectable,
    selectAll,
    selectedRows,
    selectId,
    isRowDisabled,
    maxSelection,
    onSelectionChange,
    onMaxExceeded,
  ]);

  // ─── Merge selection column with user columns ─────────────
  const allColumns = useMemo(
    () => (selectionColumn ? [selectionColumn, ...columns] : columns),
    [selectionColumn, columns],
  );

  // ─── TanStack Table instance ──────────────────────────────
  const table = useReactTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => String(row[selectId]),
    manualSorting: true, // always manual
    enableSorting: false, // we handle sort UI ourselves
  });

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  // ─── Sticky offsets ───────────────────────────────────────
  const visibleColumns = table.getVisibleFlatColumns();
  const stickyOffsets = useMemo(
    () => computeStickyOffsets(visibleColumns),
    [visibleColumns],
  );

  // ─── Sort handler ─────────────────────────────────────────
  const handleSort = useCallback(
    (column) => {
      const meta = column.columnDef?.meta;
      if (!column.columnDef.enableSorting) return;

      const key = meta?.sortKey || column.id;

      if (sortKey !== key) {
        onSortChange?.(key, SORT_ORDER.DESC);
      } else if (sortOrder === SORT_ORDER.DESC) {
        onSortChange?.(key, SORT_ORDER.ASC);
      } else {
        onSortChange?.(null, null); // clear sort
      }
    },
    [sortKey, sortOrder, onSortChange],
  );

  // ─── Sort icon ────────────────────────────────────────────
  const renderSortIcon = (column) => {
    const meta = column.columnDef?.meta;
    const key = meta?.sortKey || column.id;
    const isActive = sortKey === key;

    return (
      <span className="inline-flex flex-col ml-1.5 -space-y-0.5">
        <Icon
          name="ChevronUp"
          size={12}
          className={
            isActive && sortOrder === SORT_ORDER.ASC
              ? 'text-primary'
              : 'text-neutral-300'
          }
        />
        <Icon
          name="ChevronDown"
          size={12}
          className={
            isActive && sortOrder === SORT_ORDER.DESC
              ? 'text-primary'
              : 'text-neutral-300'
          }
        />
      </span>
    );
  };

  // ─── Render ───────────────────────────────────────────────
  return (
    <div
      className={`relative rounded-lg border border-border-light overflow-hidden ${className}`}
    >
      <div
        ref={scrollRef}
        className={loading ? 'overflow-hidden' : 'overflow-auto'}
        style={maxHeight ? { maxHeight } : undefined}
      >
        <table className="min-w-full table-fixed border-collapse">
          {/* ── Header ── */}
          <thead className={stickyHeader ? 'sticky top-0 z-30' : ''}>
            {headerGroups.map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-neutral-100 border-b border-border-light"
              >
                {headerGroup.headers.map((header) => {
                  const isSortable = header.column.columnDef.enableSorting;

                  return (
                    <th
                      key={header.id}
                      className={`
                        ${sizeClasses.header}
                        font-semibold text-neutral-600 tracking-wider whitespace-nowrap
                        select-none bg-neutral-100
                        ${isSortable ? 'cursor-pointer hover:bg-neutral-200 transition-colors' : ''}
                        ${getCellClasses(header.column, stickyOffsets, true)}
                      `}
                      style={getCellStyle(header.column, stickyOffsets)}
                      onClick={
                        isSortable ? () => handleSort(header.column) : undefined
                      }
                    >
                      <span className="inline-flex items-center">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        {isSortable && renderSortIcon(header.column)}
                      </span>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          {/* ── Body ── */}
          <tbody>
            {loading ? (
              <TableSkeleton
                columnCount={visibleColumns.length}
                cellClassName={sizeClasses.cell}
              />
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="px-4 py-12 text-center text-sm text-neutral-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const extraClasses = rowClassName?.(row.original) || '';

                return (
                  <tr
                    key={row.id}
                    className={`
                      border-b border-border-light last:border-b-0
                      hover:bg-neutral-50 transition-colors
                      ${onRowClick ? 'cursor-pointer' : ''}
                      ${extraClasses}
                    `}
                    onClick={
                      onRowClick ? () => onRowClick(row.original) : undefined
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`
                          ${sizeClasses.cell}
                          text-text-primary whitespace-nowrap
                          ${getCellClasses(cell.column, stickyOffsets, false)}
                        `}
                        style={getCellStyle(cell.column, stickyOffsets)}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
