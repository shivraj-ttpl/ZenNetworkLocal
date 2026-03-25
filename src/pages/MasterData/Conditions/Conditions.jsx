import { useState, useMemo, useCallback, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Table, buildColumns } from "@/components/commonComponents/table";
import Pagination from "@/components/commonComponents/pagination/Pagination";
import Icon from "@/components/icons/Icon";
import Checkbox from "@/components/commonComponents/checkbox/Checkbox";
import Button from "@/components/commonComponents/button/Button";
import ActionDropdown from "@/components/commonComponents/actionDropdown";
import { setOpenAddDrawer, setOpenEditDrawer } from "./conditionsSlice";
import AddConditionDrawer from "./Components/AddConditionDrawer";
import { conditionsData } from "@/data/masterData";

export default function Conditions() {
  const { setToolbar } = useOutletContext();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [showArchive, setShowArchive] = useState(false);
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
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-60">
          <Icon name="Search" size={14} className="text-neutral-400" />
          <input
            type="text"
            placeholder="Search by Name or Description"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-transparent text-sm outline-none text-neutral-800 placeholder-text-placeholder"
          />
        </div>
        <Button variant="primaryTeal" size="sm" onClick={() => dispatch(setOpenAddDrawer())}>
          <Icon name="Plus" size={14} />
          Add Condition
        </Button>
      </>
    );
    return () => setToolbar(null);
  }, [setToolbar, showArchive, search, dispatch]);

  const handleSortChange = useCallback((key, order) => {
    setSortKey(key);
    setSortOrder(order);
  }, []);

  const filteredData = useMemo(() => {
    if (!search) return conditionsData;
    const term = search.toLowerCase();
    return conditionsData.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
    );
  }, [search]);

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
        { id: "name", header: "Condition Name", accessorKey: "name" },
        {
          id: "icdCode",
          header: "ICD Code",
          accessorKey: "icdCode",
          width: 120,
          render: (row) => (
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-700">
              {row.icdCode}
            </span>
          ),
        },
        { id: "description", header: "Description", accessorKey: "description" },
        { id: "createdDate", header: "Created Date", accessorKey: "createdDate", width: 130 },
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
                { label: "Add to Favorites", value: "addToFavorites", onClickCb: () => {} },
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
      <AddConditionDrawer />
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
    </div>
  );
}
