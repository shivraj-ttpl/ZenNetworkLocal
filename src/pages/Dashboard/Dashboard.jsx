import { useState, useMemo, useCallback } from "react";
import { Table, buildColumns, SORT_ORDER } from "@/components/commonComponents/table";
import Pagination from "@/components/commonComponents/pagination/Pagination";
import { usersData, USERS_COLUMNS_SORT_KEYS } from "@/data/usersData";
import Icon from "@/components/icons/Icon";

// ─── Status badge ──────────────────────────────────────────
const STATUS_STYLES = {
  Active: "bg-success-50 text-success-700",
  Inactive: "bg-error-50 text-error-700",
  Pending: "bg-warning-50 text-warning-700",
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] || "bg-neutral-100 text-neutral-600"}`}>
      {status}
    </span>
  );
}

// ─── Action dropdown (simple) ──────────────────────────────
function ActionCell() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex flex-col ">
      <button
        className="p-1 cursor-pointer rounded hover:bg-neutral-100 transition-colors"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      >
        <Icon name="EllipsisVertical" size={16} className="text-neutral-500" />
      </button>
      {open && (
        <div className="absolute flex flex-col right-0 top-full mt-1 w-36 bg-surface border border-border-light rounded-lg shadow-lg z-50 py-1">
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 text-text-primary">
            Edit
          </button>
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 text-text-primary">
            View Profile
          </button>
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-error-50 text-error-500">
            Deactivate
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────
export default function Dashboard() {
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [selectedRows, setSelectedRows] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // In real usage this would call an API saga — here we sort + paginate client-side for demo
  const sortedData = useMemo(() => {
    if (!sortKey) return usersData;
    const sorted = [...usersData].sort((a, b) => {
      const aVal = a[sortKey] || "";
      const bVal = b[sortKey] || "";
      return aVal.localeCompare(bVal);
    });
    return sortOrder === SORT_ORDER.ASC ? sorted : sorted.reverse();
  }, [sortKey, sortOrder]);

  const totalRecords = sortedData.length;
  const totalPages = Math.ceil(totalRecords / limit);
  const paginatedData = useMemo(
    () => sortedData.slice((page - 1) * limit, page * limit),
    [sortedData, page, limit]
  );

  const handleSortChange = useCallback((key, order) => {
    setSortKey(key);
    setSortOrder(order);
    // In production: dispatch(fetchUsers({ sortBy: key, sortOrder: order }))
  }, []);

  const columns = useMemo(
    () =>
      buildColumns([
        {
          id: "name",
          accessorKey: "name",
          header: "Name",
          sortable: true,
          sortKey: USERS_COLUMNS_SORT_KEYS.NAME,
 
          render: (row) => (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-secondary-100 flex items-center justify-center text-xs font-semibold text-secondary-700">
                {row.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <span className="">{row.name}</span>
            </div>
          ),
        },
        {
          id: "email",
          accessorKey: "email",
          header: "Email",
          sortable: true,
          sortKey: USERS_COLUMNS_SORT_KEYS.EMAIL,
          minWidth: 220,
          render: (row) => (
            <span className="text-neutral-500">{row.email}</span>
          ),
        },
        {
          id: "role",
          accessorKey: "role",
          header: "Role",
          sortable: true,
          sortKey: USERS_COLUMNS_SORT_KEYS.ROLE,
          width: 140,
        },
        {
          id: "department",
          accessorKey: "department",
          header: "Department",
          width: 180,
        },
        {
          id: "status",
          accessorKey: "status",
          header: "Status",
          sortable: true,
          sortKey: USERS_COLUMNS_SORT_KEYS.STATUS,
          width: 120,
          align: "center",
          render: (row) => <StatusBadge status={row.status} />,
        },
        {
          id: "lastLogin",
          accessorKey: "lastLogin",
          header: "Last Login",
          sortable: true,
          sortKey: USERS_COLUMNS_SORT_KEYS.CREATED,
          width: 130,
          render: (row) => (
            <span className="text-neutral-500">
              {row.lastLogin || "Never"}
            </span>
          ),
        },
        {
          id: "actions",
          header: "Actions",
          sticky: "right",
          width: 80,
          align: "center",
          render: () => <ActionCell />,
        },
      ]),
    []
  );


  return (
    <div className="space-y-6">
     

      <Table
        columns={columns}
        data={paginatedData}
        size="sm"
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        selectable
        selectAll={false}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        isRowDisabled={(row) => row.status === "Inactive"}
        maxHeight={600}
        onRowClick={(row) => console.log("Row clicked:", row.name)}
        rowClassName={(row) =>
          row.status === "Inactive" ? "opacity-50" : ""
        }
      />

      <Pagination
        totalRecords={totalRecords}
        totalPages={totalPages}
        currentPage={page}
        currentLimit={limit}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
      />
    </div>
  );
}
