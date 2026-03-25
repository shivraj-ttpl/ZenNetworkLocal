import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { Table, buildColumns } from "@/components/commonComponents/table";
import Pagination from "@/components/commonComponents/pagination/Pagination";
import Icon from "@/components/icons/Icon";
import Checkbox from "@/components/commonComponents/checkbox/Checkbox";
import SelectDropdown from "@/components/commonComponents/selectDropdown/SelectDropdown";
import ActionDropdown from "@/components/commonComponents/actionDropdown";
import ToggleSwitch from "@/components/commonComponents/toggleSwitch/ToggleSwitch";
import { payersData } from "@/data/masterData";
import { setOpenEditDrawer, setOpenStatusModal } from "./payersSlice";
import { PAYER_TYPE_OPTIONS } from "./constant";
import AddPayersDropdown from "./Components/AddPayersDropdown";
import AddPayerDrawer from "./Components/AddPayerDrawer";
import ImportPayersDrawer from "./Components/ImportPayersDrawer";
import StatusChangeModal from "./Components/StatusChangeModal";

export default function Payers() {
  const dispatch = useDispatch();
  const { setToolbar } = useOutletContext();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [showArchive, setShowArchive] = useState(false);
  const [payerType, setPayerType] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  useEffect(() => {
    setToolbar(
      <>
        <Checkbox
          label="Show Archive"
          checked={showArchive}
          onChange={() => setShowArchive((p) => !p)}
          variant="teal"
          size="sm"
        />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-50">
          <Icon name="Search" size={14} className="text-neutral-400" />
          <input
            type="text"
            placeholder="Search by Payer Name"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-transparent text-sm outline-none text-neutral-800 placeholder-text-placeholder"
          />
        </div>
        <div className="w-40">
          <SelectDropdown
            name="payerType"
            placeholder="Payer Type"
            options={PAYER_TYPE_OPTIONS}
            value={payerType}
            onChangeCb={(val) => { setPayerType(val); setPage(1); }}
          />
        </div>
        <AddPayersDropdown />
      </>
    );
    return () => setToolbar(null);
  }, [setToolbar, showArchive, search, payerType, dispatch]);

  const handleSortChange = useCallback((key, order) => {
    setSortKey(key);
    setSortOrder(order);
  }, []);

  const filteredData = useMemo(() => {
    let data = payersData;
    if (search) {
      const term = search.toLowerCase();
      data = data.filter((item) => item.name.toLowerCase().includes(term));
    }
    if (payerType) {
      data = data.filter((item) => item.type === payerType.value);
    }
    return data;
  }, [search, payerType]);

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
        { id: "name", header: "Name", accessorKey: "name" },
        { id: "type", header: "Type", accessorKey: "type", width: 140 },
        {
          id: "status",
          header: "Status",
          accessorKey: "status",
          width: 120,
          render: (row) => (
            <div onClick={(e) => e.stopPropagation()}>
              <ToggleSwitch
                name={`status-${row.id}`}
                checked={row.status === "Active"}
                onChangeCb={() => dispatch(setOpenStatusModal(row))}
                activeLabel="Active"
                inactiveLabel="Inactive"
              />
            </div>
          ),
        },
        {
          id: "favorites",
          header: "Favorites",
          width: 100,
          align: "center",
          render: (row) => (
            <span className={row.isFavorite ? "text-primary-700" : "text-neutral-400"}>
              {row.isFavorite ? "✓" : "-"}
            </span>
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

      <AddPayerDrawer />
      <ImportPayersDrawer />
      <StatusChangeModal />
    </div>
  );
}
