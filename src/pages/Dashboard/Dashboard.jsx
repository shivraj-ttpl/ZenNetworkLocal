import { useState, useMemo, useCallback } from "react";
import { Table, buildColumns, SORT_ORDER } from "@/components/commonComponents/table";
import Pagination from "@/components/commonComponents/pagination/Pagination";
import SelectDropdown from "@/components/commonComponents/selectDropdown/SelectDropdown";
import AsyncSelectDropdown from "@/components/commonComponents/selectDropdown/AsyncSelectDropdown";
import { usersData, USERS_COLUMNS_SORT_KEYS } from "@/data/usersData";
import Icon from "@/components/icons/Icon";
import ActionDropdown from "@/components/commonComponents/actionDropdown";

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

// ─── Static dropdown options ───────────────────────────────
const ROLE_OPTIONS = [
  { label: "Admin", value: "admin" },
  { label: "Case Worker", value: "case_worker" },
  { label: "Supervisor", value: "supervisor" },
  { label: "Provider", value: "provider" },
  { label: "Billing Specialist", value: "billing" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Pending", value: "Pending" },
];

const DEPARTMENT_OPTIONS = [
  { label: "Nursing", value: "nursing" },
  { label: "Cardiology", value: "cardiology" },
  { label: "Primary Care", value: "primary_care" },
  { label: "Behavioral Health", value: "behavioral_health" },
  { label: "Administration", value: "administration" },
  { label: "IT", value: "it" },
];

// ─── Mock async fetch (simulates API) ─────────────────────
const mockFetchProviders = async ({ search, page, limit }) => {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 600));

  const allProviders = Array.from({ length: 53 }, (_, i) => ({
    id: i + 1,
    name: `Provider ${String(i + 1).padStart(3, "0")}`,
    specialty: ["Cardiology", "Neurology", "Pediatrics", "Oncology"][i % 4],
  }));

  const filtered = search
    ? allProviders.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : allProviders;

  const start = (page - 1) * limit;
  return {
    data: filtered.slice(start, start + limit),
    totalRecords: filtered.length,
  };
};

// ─── Dashboard ─────────────────────────────────────────────
export default function Dashboard() {
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [selectedRows, setSelectedRows] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Dropdown states
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);

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
          render: () => (
            <ActionDropdown
              options={[
                { label: "Edit", value: "edit", onClickCb: () => {} },
                { label: "View Profile", value: "view_profile", onClickCb: () => {} },
                { label: "Deactivate", value: "deactivate", onClickCb: () => {} },
              ]}
            />
          ),
        },
      ]),
    []
  );


  return (
    <div className="space-y-6">

      {/* ── Dropdown Demos ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Single Select (static) */}
        <SelectDropdown
          label="Role"
          name="role"
          placeholder="Select Role"
          options={ROLE_OPTIONS}
          value={selectedRole}
          onChange={setSelectedRole}
          isSearchable
        />

        {/* Multi Select (static) */}
        <SelectDropdown
          label="Status"
          name="status"
          placeholder="Filter by Status"
          options={STATUS_OPTIONS}
          value={selectedStatuses}
          onChange={setSelectedStatuses}
          isMulti
          selectAll
        />

        {/* Multi Select with search (static) */}
        <SelectDropdown
          label="Department"
          name="department"
          placeholder="Select Departments"
          options={DEPARTMENT_OPTIONS}
          value={selectedDepartments}
          onChange={setSelectedDepartments}
          isMulti
          isSearchable
        />

        {/* Async Select with infinite scroll */}
        <AsyncSelectDropdown
          label="Provider"
          name="provider"
          placeholder="Search Providers..."
          value={selectedProvider}
          onChange={setSelectedProvider}
          // fetchOptions={mockFetchProviders}
          url="providers"
          labelKey="name"
          valueKey="id"
          limit={10}
          renderOption={(opt) => (
            <div className="flex flex-col">
              <span className="font-medium">{opt.name}</span>
              <span className="text-xs text-neutral-400">{opt.specialty}</span>
            </div>
          )}
        />
      </div>

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
        totalRecords={100}
        totalPages={10}
        currentPage={page}
        currentLimit={limit}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
      />
    </div>
  );
}
