                                          import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Table, buildColumns } from "@/components/commonComponents/table";
import Pagination from "@/components/commonComponents/pagination/Pagination";
import Icon from "@/components/icons/Icon";
import Checkbox from "@/components/commonComponents/checkbox/Checkbox";
import Button from "@/components/commonComponents/button/Button";
import SelectDropdown from "@/components/commonComponents/selectDropdown/SelectDropdown";
import ActionDropdown from "@/components/commonComponents/actionDropdown";
import { subOrganizationsData, STATUS_OPTIONS } from "@/data/subOrganizationsData";
import ToggleSwitch from "../../../components/commonComponents/toggleSwitch/ToggleSwitch";
import AddSubOrgDrawer from "./Components/AddSubOrgDrawer";

export default function SubOrgList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [showArchive, setShowArchive] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [showAddDrawer, setShowAddDrawer] = useState(false);

  const handleSortChange = useCallback((key, order) => {
    setSortKey(key);
    setSortOrder(order);
  }, []);

  const filteredData = useMemo(() => {
    let data = subOrganizationsData;
    if (!showArchive) {
      data = data.filter((row) => row.status === "Active");
    }
    if (search.trim()) {
      const term = search.toLowerCase();
      data = data.filter(
        (row) =>
          row.name.toLowerCase().includes(term) ||
          String(row.subOrgId).toLowerCase().includes(term)
      );
    }
    if (statusFilter) {
      data = data.filter((row) => row.status === statusFilter.value);
    }
    return data;
  }, [search, showArchive, statusFilter]);

  const sortedData = useMemo(() => {
    if (!sortKey || !sortOrder) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      const aVal = String(a[sortKey] ?? "");
      const bVal = String(b[sortKey] ?? "");
      return aVal.localeCompare(bVal);
    });
    return sortOrder === "asc" ? sorted : sorted.reverse();
  }, [filteredData, sortKey, sortOrder]);

  const totalRecords = sortedData.length;
  const totalPages = totalRecords === 0 ? 1 : Math.ceil(totalRecords / limit);
  const pageSafe = Math.min(Math.max(1, page), totalPages);

  const paginatedData = useMemo(
    () =>
      sortedData.slice((pageSafe - 1) * limit, pageSafe * limit).map((item, i) => ({
        ...item,
        srNo: String((pageSafe - 1) * limit + i + 1).padStart(2, "0"),
      })),
    [sortedData, pageSafe, limit]
  );

  const columns = useMemo(
    () =>
      buildColumns([
        { id: "srNo", header: "Sr. No", accessorKey: "srNo", width: 72 },
        {
          id: "subOrgId",
          header: "Sub-Org ID",
          accessorKey: "subOrgId",
          width: 100,
          sortable: true,
        },
        {
          id: "name",
          header: "Sub-Organization Name",
          accessorKey: "name",
          sortable: true,
          render: (row) => (
            <span
              className="text-primary-700 cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/sub-organizations/${row.id}`);
              }}
            >
              {row.name}
            </span>
          ),
        },
        {
          id: "address",
          header: "Address",
          accessorKey: "address",
          sortable: true,
          minWidth: 200,
        },
        {
          id: "createdDate",
          header: "Created Date",
          accessorKey: "createdDate",
          width: 120,
          sortable: true,
        },
        {
          id: "status",
          header: "Status",
          accessorKey: "status",
          width: 100,
          sortable: true,
          render: (row) => (
            <ToggleSwitch
              name={`status-${row.id}`}
              checked={row.status}
              showLabel={false}
            />
          ),
        },
        {
          id: "actions",
          header: "Action",
          width: 72,
          align: "center",
          render: () => (
            <ActionDropdown
              options={[
                { label: "View", value: "view", onClickCb: () => {} },
                { label: "Edit", value: "edit", onClickCb: () => {} },
                { label: "Archive", value: "archive", onClickCb: () => {} },
              ]}
            />
          ),
        },
      ]),
    [navigate]
  );

  return (
    <div className="bg-surface h-full rounded-xl border border-border-light overflow-hidden">
      <div className="flex items-center justify-end px-5 pt-4 pb-3 gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap">
          <Checkbox
            label="Show Archive"
            checked={showArchive}
            onChange={() => {
              setShowArchive((p) => !p);
              setPage(1);
            }}
            variant="blue"
            size="sm"
          />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-60">
            <Icon name="Search" size={14} className="text-neutral-400" />
            <input
              type="text"
              placeholder="Search by ID, Name"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-transparent text-sm outline-none text-neutral-800 placeholder-text-placeholder"
            />
          </div>
          <div className="w-32">
            <SelectDropdown
              name="status"
              placeholder="Status"
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
            />
          </div>
        </div>
        <Button variant="primaryBlue" size="sm" onClick={() => setShowAddDrawer(true)}>
          <Icon name="Plus" size={14} />
          Add New
        </Button>
      </div>
      <div className="px-5 pb-4">
        <Table
          columns={columns}
          data={paginatedData}
          size="sm"
          maxHeight="calc(100vh - 280px)"
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
        <Pagination
          totalRecords={totalRecords}
          totalPages={totalPages}
          currentPage={pageSafe}
          currentLimit={limit}
          onPageChange={setPage}
          onLimitChange={(val) => {
            setLimit(val);
            setPage(1);
          }}
        />
      </div>
      <AddSubOrgDrawer open={showAddDrawer} onClose={() => setShowAddDrawer(false)} />
    </div>
  );
}
