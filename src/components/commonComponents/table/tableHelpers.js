import { createColumnHelper } from "@tanstack/react-table";

export const columnHelper = createColumnHelper();

/**
 * Build a column def from a simplified config object.
 *
 * @param {Object} config
 * @param {string}  config.id            - Unique column id
 * @param {string}  config.header        - Header label text
 * @param {string}  [config.accessorKey] - Dot-path into row data
 * @param {Function} [config.accessorFn] - Function (row) => value
 * @param {Function} [config.render]      - Simple cell renderer (row, rowIndex) => JSX
 * @param {Function} [config.cell]        - TanStack cell renderer (info) => JSX (advanced, prefer render)
 * @param {Function} [config.headerRender] - Custom header renderer (info) => JSX
 * @param {boolean} [config.sortable]    - Enable sorting (default false)
 * @param {string}  [config.sortKey]     - Backend sort field name (sent to API)
 * @param {string}  [config.sticky]      - "left" | "right"
 * @param {number}  [config.width]       - Fixed width in px
 * @param {number}  [config.minWidth]    - Min width in px
 * @param {number}  [config.maxWidth]    - Max width in px
 * @param {string}  [config.align]       - "left" | "center" | "right"
 */
export function buildColumn(config) {
  const col = {};

  if (config.accessorKey) col.accessorKey = config.accessorKey;
  if (config.accessorFn) col.accessorFn = config.accessorFn;

  col.id = config.id || config.accessorKey;
  col.header = config.headerRender || config.header;
  col.enableSorting = config.sortable ?? false;

  // render(row, rowIndex) — simple API, consumer just gets the row
  // cell(info) — TanStack's native API for advanced cases
  if (config.render) {
    col.cell = (info) => config.render(info.row.original, info.row.index);
  } else if (config.cell) {
    col.cell = config.cell;
  }

  // Pack layout + sorting metadata for the Table component
  col.meta = {
    sticky: config.sticky || null,
    sortKey: config.sortKey || config.accessorKey || null,
    width: config.width,
    minWidth: config.minWidth,
    maxWidth: config.maxWidth,
    align: config.align || "left",
  };

  return col;
}

/**
 * Build an array of column defs from simplified config objects.
 */
export function buildColumns(configs) {
  return configs.map(buildColumn);
}

/**
 * Compute sticky offsets for columns pinned left or right.
 * Returns a Map<columnId, { position, offset }>.
 */
export function computeStickyOffsets(columns) {
  const offsets = new Map();

  // Left sticky
  let leftOffset = 0;
  for (const col of columns) {
    const meta = col.columnDef?.meta || col.meta;
    if (meta?.sticky === "left") {
      offsets.set(col.id, { position: "left", offset: leftOffset });
      leftOffset += meta.width || 150;
    }
  }

  // Right sticky — traverse from the end
  let rightOffset = 0;
  for (let i = columns.length - 1; i >= 0; i--) {
    const col = columns[i];
    const meta = col.columnDef?.meta || col.meta;
    if (meta?.sticky === "right") {
      offsets.set(col.id, { position: "right", offset: rightOffset });
      rightOffset += meta.width || 150;
    }
  }

  return offsets;
}

/**
 * Returns inline style object for a cell/header based on column meta.
 */
export function getCellStyle(column, stickyOffsets) {
  const meta = column.columnDef?.meta || {};
  const style = {};

  if (meta.width) style.width = meta.width;
  if (meta.minWidth) style.minWidth = meta.minWidth;
  if (meta.maxWidth) style.maxWidth = meta.maxWidth;

  const sticky = stickyOffsets?.get(column.id);
  if (sticky) {
    style.position = "sticky";
    style[sticky.position] = sticky.offset;
    style.zIndex = sticky.position === "left" ? 20 : 20;
  }

  return style;
}

/**
 * Returns CSS classes for a cell based on column meta.
 */
export function getCellClasses(column, stickyOffsets, isHeader = false) {
  const meta = column.columnDef?.meta || {};
  const classes = [];

  // Alignment
  if (meta.align === "center") classes.push("text-center");
  else if (meta.align === "right") classes.push("text-right");
  else classes.push("text-left");

  // Sticky
  const sticky = stickyOffsets?.get(column.id);
  if (sticky) {
    classes.push(
      isHeader ? "bg-neutral-150" : "bg-neutral-50",
      "shadow-[inset_4px_0_6px_-4px_rgba(0,0,0,0.08)]"
    );
  }

  return classes.join(" ");
}

/**
 * Sort direction constants matching typical backend expectations.
 */
export const SORT_ORDER = {
  ASC: "asc",
  DESC: "desc",
};

/**
 * Toggle sort direction: none → desc → asc → none.
 * Returns { sortKey, sortOrder } or null (no sort).
 */
export function getNextSort(columnId, currentSortKey, currentSortOrder) {
  if (currentSortKey !== columnId) {
    return { sortKey: columnId, sortOrder: SORT_ORDER.DESC };
  }
  if (currentSortOrder === SORT_ORDER.DESC) {
    return { sortKey: columnId, sortOrder: SORT_ORDER.ASC };
  }
  return null; // Clear sort
}
