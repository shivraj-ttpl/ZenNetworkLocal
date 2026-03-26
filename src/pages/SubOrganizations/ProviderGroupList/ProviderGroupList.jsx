import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Table, buildColumns } from "@/components/commonComponents/table";
import Pagination from "@/components/commonComponents/pagination/Pagination";
import Icon from "@/components/icons/Icon";
import Checkbox from "@/components/commonComponents/checkbox/Checkbox";
import Button from "@/components/commonComponents/button/Button";
import SelectDropdown from "@/components/commonComponents/selectDropdown/SelectDropdown";
import ActionDropdown from "@/components/commonComponents/actionDropdown";
import { providerGroupsData, STATUS_OPTIONS } from "@/data/subOrganizationsData";
import ToggleSwitch from "@/components/commonComponents/toggleSwitch/ToggleSwitch";
import { componentKey, setOpenAddDrawer, setOpenEditDrawer } from "./providerGroupListSlice";
import AddProviderGroupDrawer from "./Components/AddProviderGroupDrawer";

export default function ProviderGroupList() {
  const { subOrgId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setToolbar } = useOutletContext();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [showArchive, setShowArchive] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const { drawerOpen, drawerMode, editData } = useSelector((state) => state[componentKey] ?? {});

  useEffect(() => {
    setToolbar(
      <>
        <Checkbox label="Show Archive" checked={showArchive} onChange={() => setShowArchive((p) => !p)} variant="blue" size="sm" />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-56">
          <Icon name="Search" size={14} className="text-neutral-400" />
          <input
            type="text"
            placeholder="Search by Name/Specialty"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-transparent text-sm outline-none text-neutral-800 placeholder-text-placeholder"
          />
        </div>
        <div className="w-32">
          <SelectDropdown name="status" placeholder="Status" options={STATUS_OPTIONS} value={statusFilter} onChange={(val) => { setStatusFilter(val); setPage(1); }} />
        </div>
        <Button variant="primaryBlue" size="sm" onClick={() => dispatch(setOpenAddDrawer())}>
          <Icon name="Plus" size={14} />
          Add Provider Group
        </Button>
      </>
    );
    return () => setToolbar(null);
  }, [setToolbar, showArchive, search, statusFilter, dispatch]);

  const handleSortChange = useCallback((key, order) => {
    setSortKey(key);
    setSortOrder(order);
  }, []);

  const filteredData = useMemo(() => {
    let data = providerGroupsData;
    if (search) {
      const term = search.toLowerCase();
      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.specialties.some((s) => s.toLowerCase().includes(term))
      );
    }
    if (statusFilter) {
      data = data.filter((item) => item.status === statusFilter.value);
    }
    return data;
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / limit);

  const paginatedData = useMemo(
    () =>
      filteredData
        .slice((page - 1) * limit, page * limit)
        .map((item, i) => ({
          ...item,
          srNo: String((page - 1) * limit + i + 1).padStart(2, "0"),
        })),
    [filteredData, page, limit]
  );

  const columns = useMemo(
    () =>
      buildColumns([
        { id: "srNo", header: "Sr. No", accessorKey: "srNo", width: 70 },
        {
          id: "name",
          header: "Provider Group Name",
          accessorKey: "name",
          render: (row) => (
            <span
              className="text-primary-700 cursor-pointer hover:underline"
              onClick={() => navigate(`/sub-organizations/${subOrgId}/provider-groups/${row.id}`)}
            >
              {row.name}
            </span>
          ),
        },
        {
          id: "specialties",
          header: "Specialty",
          accessorKey: "specialties",
          render: (row) => {
            const MAX_VISIBLE = 2;
            const visible = row.specialties.slice(0, MAX_VISIBLE);
            const remaining = row.specialties.length - MAX_VISIBLE;
            return (
              <div className="flex items-center gap-1 flex-wrap">
                {visible.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-700 whitespace-nowrap">
                    {s.length > 18 ? `${s.slice(0, 15)}...` : s}
                  </span>
                ))}
                {remaining > 0 && (
                  <span className="text-xs text-primary-700 font-medium">+{remaining}</span>
                )}
              </div>
            );
          },
        },
        { id: "email", header: "Email Address", accessorKey: "email" },
        { id: "address", header: "Address", accessorKey: "address" },
        { id: "contact", header: "Contact", accessorKey: "contact", width: 140 },
        {
          id: "status",
          header: "Status",
          accessorKey: "status",
          width: 120,
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
          width: 70,
          align: "center",
          render: (row) => (
            <ActionDropdown
              options={[
                { label: "View", value: "view", onClickCb: () => navigate(`/sub-organizations/${subOrgId}/provider-groups/${row.id}`) },
                { label: "Edit", value: "edit", onClickCb: () => dispatch(setOpenEditDrawer(row)) },
                { label: "Archive", value: "archive", onClickCb: () => {} },
              ]}
            />
          ),
        },
      ]),
    [navigate, subOrgId]
  );

  return (
    <div className="px-5 pb-4">
      <Table
        columns={columns}
        data={paginatedData}
        size="sm"
        maxHeight="475px"
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />
      <Pagination
        totalRecords={filteredData.length}
        totalPages={totalPages}
        currentPage={page}
        currentLimit={limit}
        onPageChange={setPage}
        onLimitChange={(val) => { setLimit(val); setPage(1); }}
      />
      <AddProviderGroupDrawer open={drawerOpen} drawerMode={drawerMode} editData={editData} />
    </div>
  );
}
