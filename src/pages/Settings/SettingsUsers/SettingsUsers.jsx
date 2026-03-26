import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";

import Button from "@/components/commonComponents/button/Button";
import Checkbox from "@/components/commonComponents/checkbox/Checkbox";
import Pagination from "@/components/commonComponents/pagination/Pagination";
import { buildColumns, Table } from "@/components/commonComponents/table";
import Icon from "@/components/icons/Icon";
import ActionDropdown from "@/components/commonComponents/actionDropdown";
import { settingsUsersData } from "@/data/settingsData";
import { useFlexCleanup } from "@/hooks/useFlexCleanup";

import {
  componentKey,
  setOpenAddDrawer,
  setOpenEditDrawer,
  setOpenViewModal,
  setOpenFilterDrawer,
} from "./settingsUsersSlice";
import "./settingsUsersSaga";

import AddUserDrawer from "./Components/AddUserDrawer";
import ViewUserModal from "./Components/ViewUserModal";
import FilterDrawer from "./Components/FilterDrawer";

export default function SettingsUsers() {
  const { setToolbar } = useOutletContext();
  const dispatch = useDispatch();
  const state = useSelector((s) => s[componentKey]);

  useFlexCleanup(componentKey);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [showArchive, setShowArchive] = useState(false);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const {
    drawerOpen,
    drawerMode,
    editData,
    viewModalOpen,
    viewData,
    filterDrawerOpen,
    filters,
  } = state || {};

  useEffect(() => {
    setToolbar(
      <>
        <Checkbox
          label="Show Archive"
          checked={showArchive}
          onChange={() => setShowArchive((p) => !p)}
          variant="blue"
          size="sm"
        />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-56">
          <Icon name="Search" size={14} className="text-neutral-400" />
          <input
            type="text"
            placeholder="Search by Name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-transparent text-sm outline-none text-neutral-800 placeholder-text-placeholder"
          />
        </div>
        <button
          className="p-2 rounded-lg border border-border hover:bg-neutral-50 transition-colors cursor-pointer"
          onClick={() => dispatch(setOpenFilterDrawer())}
        >
          <Icon
            name="SlidersHorizontal"
            size={16}
            className="text-neutral-500"
          />
        </button>
        <Button
          variant="primaryBlue"
          size="sm"
          onClick={() => dispatch(setOpenAddDrawer())}
        >
          <Icon name="Plus" size={14} />
          Add User
        </Button>
      </>,
    );
    return () => setToolbar(null);
  }, [setToolbar, showArchive, search, dispatch]);

  const handleSortChange = useCallback((key, order) => {
    setSortKey(key);
    setSortOrder(order);
  }, []);

  const filteredData = useMemo(() => {
    let data = settingsUsersData;
    if (!showArchive) {
      data = data.filter((row) => row.status === "Active");
    }
    if (search.trim()) {
      const term = search.toLowerCase();
      data = data.filter((item) => item.name.toLowerCase().includes(term));
    }
    if (filters?.roleName) {
      data = data.filter((item) => item.roleName === filters.roleName.value);
    }
    if (filters?.subOrganization) {
      data = data.filter(
        (item) => item.subOrganizations === filters.subOrganization.value,
      );
    }
    if (filters?.providerGroup) {
      data = data.filter(
        (item) => item.providerGroup === filters.providerGroup.value,
      );
    }
    return data;
  }, [search, showArchive, filters]);

  const totalPages = Math.ceil(filteredData.length / limit) || 1;

  const paginatedData = useMemo(
    () =>
      filteredData
        .slice((page - 1) * limit, page * limit)
        .map((item, i) => ({
          ...item,
          srNo: String((page - 1) * limit + i + 1).padStart(2, "0"),
        })),
    [filteredData, page, limit],
  );

  const columns = useMemo(
    () =>
      buildColumns([
        { id: "srNo", header: "Sr. No", accessorKey: "srNo", width: 70 },
        {
          id: "name",
          header: "Name",
          accessorKey: "name",
          render: (row) => (
            <span className="text-primary-700 font-medium">{row.name}</span>
          ),
        },
        {
          id: "email",
          header: "Email Address",
          accessorKey: "email",
          render: (row) => (
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-text-primary">{row.email}</span>
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                  row.emailVerified ? "bg-success-500" : "bg-warning-500"
                }`}
              >
                <Icon name="Check" size={10} className="text-white" />
              </span>
            </div>
          ),
        },
        { id: "roleName", header: "Role Name", accessorKey: "roleName" },
        {
          id: "subOrganizations",
          header: "Sub-Organizations",
          accessorKey: "subOrganizations",
        },
        {
          id: "providerGroup",
          header: "Provider Group",
          accessorKey: "providerGroup",
        },
        { id: "lastLogin", header: "Last Login", accessorKey: "lastLogin" },
        {
          id: "actions",
          header: "Action",
          width: 70,
          align: "center",
          render: (row) => (
            <ActionDropdown
              options={[
                {
                  label: "View",
                  value: "view",
                  onClickCb: () => dispatch(setOpenViewModal(row)),
                },
                {
                  label: "Edit",
                  value: "edit",
                  onClickCb: () => dispatch(setOpenEditDrawer(row)),
                },
                {
                  label: "Archive",
                  value: "archive",
                  onClickCb: () => {},
                },
              ]}
            />
          ),
        },
      ]),
    [dispatch],
  );

  return (
    <div className="px-5 pb-4">
      <Table
        columns={columns}
        data={paginatedData}
        size="sm"
        maxHeight="calc(100vh - 240px)"
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
        onLimitChange={(val) => {
          setLimit(val);
          setPage(1);
        }}
      />

      <AddUserDrawer
        open={drawerOpen}
        drawerMode={drawerMode}
        editData={editData}
      />
      <ViewUserModal open={viewModalOpen} viewData={viewData} />
      <FilterDrawer open={filterDrawerOpen} filters={filters} />
    </div>
  );
}
