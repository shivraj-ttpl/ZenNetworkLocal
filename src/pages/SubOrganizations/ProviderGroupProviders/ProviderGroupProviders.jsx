import { useState, useMemo, useCallback, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Table, buildColumns } from "@/components/commonComponents/table";
import Pagination from "@/components/commonComponents/pagination/Pagination";
import Icon from "@/components/icons/Icon";
import Checkbox from "@/components/commonComponents/checkbox/Checkbox";
import Button from "@/components/commonComponents/button/Button";
import SelectDropdown from "@/components/commonComponents/selectDropdown/SelectDropdown";
import ActionDropdown from "@/components/commonComponents/actionDropdown";
import { providersData, STATUS_OPTIONS } from "@/data/subOrganizationsData";
import ToggleSwitch from "@/components/commonComponents/toggleSwitch/ToggleSwitch";
import { componentKey, setOpenAddDrawer, setOpenEditDrawer, setOpenViewModal, setOpenStatusModal } from "./providerGroupProvidersSlice";
import AddProviderDrawer from "./Components/AddProviderDrawer";
import ViewProviderModal from "./Components/ViewProviderModal";
import StatusChangeModal from "./Components/StatusChangeModal";

export default function ProviderGroupProviders() {
  const { setToolbar } = useOutletContext();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [showArchive, setShowArchive] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const { drawerOpen, drawerMode, editData, viewModalOpen, viewData, statusModalOpen, statusChangeRow } = useSelector((state) => state[componentKey] ?? {});

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
          Add Provider
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
    let data = providersData;
    if (!showArchive) {
      data = data.filter((row) => row.status === "Active");
    }
    if (search.trim()) {
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
  }, [search, showArchive, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / limit) || 1;

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
          header: "Provider Name",
          accessorKey: "name",
          render: (row) => <span className="text-primary-700 font-medium">{row.name}</span>,
        },
        {
          id: "multiProviderAccess",
          header: "Multi-Provider Access",
          accessorKey: "multiProvider",
          render: (row) => (
            <span className={row.multiProvider ? "text-text-primary" : "text-neutral-400"}>{row.multiProvider ? "✓" : "-"}</span>
          ),
        },
        {
          id: "specialties",
          header: "Specialty",
          accessorKey: "specialties",
          maxWidth: "650px",
          render: (row) => {
            const visible = row.specialties.slice(0, 2);
            const remaining = row.specialties.length - 2;
            return (
              <div className="flex items-center gap-1 ">
                {visible.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-lg text-xs font-medium bg-primary-50 text-primary-700 whitespace-nowrap">
                    {s.length > 15 ? s.slice(0, 12) + "..." : s}
                  </span>
                ))}
                {remaining > 0 && <span className="text-xs text-primary-700 font-medium">+{remaining}</span>}
              </div>
            );
          },
        },
        { id: "role", header: "Role", accessorKey: "role" },
        {
          id: "email",
          header: "Email Address",
          accessorKey: "email",
          render: (row) => (
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-text-primary">{row.email}</span>
              {row.emailVerified && (
                <span className="w-4 h-4 rounded-full bg-success-500 flex items-center justify-center shrink-0">
                  <Icon name="Check" size={10} className="text-white" />
                </span>
              )}
            </div>
          ),
        },
        { id: "contact", header: "Contact", accessorKey: "contact", width: 140 },
        { id: "lastLogin", header: "Last Login", accessorKey: "lastLogin" },
        {
          id: "status",
          header: "Status",
          accessorKey: "status",
          width: 120,
          render: (row) => (
            <ToggleSwitch
              name={`status-${row.id}`}
              checked={row.status === "Active"}
              onChangeCb={() => dispatch(setOpenStatusModal(row))}
              showLabel={false}
            />
          ),
        },
        {
          id: "actions",
          header: "Action",
          sticky: "right",
          width: 70,
          align: "center",
          render: (row) => (
            <ActionDropdown
              options={[
                { label: "View", value: "view", onClickCb: () => dispatch(setOpenViewModal(row)) },
                { label: "Edit", value: "edit", onClickCb: () => dispatch(setOpenEditDrawer(row)) },
                { label: "Archive", value: "archive", onClickCb: () => {} },
              ]}
            />
          ),
        },
      ]),
    [dispatch]
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
      <AddProviderDrawer open={drawerOpen} drawerMode={drawerMode} editData={editData} />
      <ViewProviderModal open={viewModalOpen} viewData={viewData} />
      <StatusChangeModal open={statusModalOpen} statusChangeRow={statusChangeRow} />
    </div>
  );
}
