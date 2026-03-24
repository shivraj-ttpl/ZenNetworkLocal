import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { Table, buildColumns } from "@/components/commonComponents/table";
import Pagination from "@/components/commonComponents/pagination/Pagination";
import Icon from "@/components/icons/Icon";
import Checkbox from "@/components/commonComponents/checkbox/Checkbox";
import Button from "@/components/commonComponents/button/Button";
import ActionDropdown from "@/components/commonComponents/actionDropdown";
import { useFlexCleanup } from "@/hooks/useFlexCleanup";
import { carePlansData } from "@/data/masterData";
import { componentKey, setOpenAddDrawer, setOpenEditDrawer, setCloseDrawer } from "./carePlansSlice";
import ViewCarePlanDrawer from "./components/ViewCarePlanDrawer";

export default function CarePlans() {
  const dispatch = useDispatch();
  const { setToolbar } = useOutletContext();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [showArchive, setShowArchive] = useState(false);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  // useFlexCleanup(componentKey);

  const drawerOpen = useSelector((state) => state[componentKey]?.drawerOpen ?? false);

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
            placeholder="Search by Care Plan Name"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-transparent text-sm outline-none text-neutral-800 placeholder-text-placeholder"
          />
        </div>
      </>
    );
    return () => setToolbar(null);
  }, [setToolbar, showArchive, search, dispatch]);

  const handleSortChange = useCallback((key, order) => {
    setSortKey(key);
    setSortOrder(order);
  }, []);

  const filteredData = useMemo(() => {
    if (!search) return carePlansData;
    const term = search.toLowerCase();
    return carePlansData.filter((item) => item.name.toLowerCase().includes(term));
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
        { id: "name", header: "Name", accessorKey: "name" },
        { id: "description", header: "Care Plan Description", accessorKey: "description" },
        { id: "duration", header: "Duration", accessorKey: "duration", width: 130 },
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
                { label: "View", value: "view", onClickCb: () => dispatch(setOpenAddDrawer()) },
                { label: "Add to Favorites", value: "add_to_favorites", onClickCb: () => {} },
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

      <ViewCarePlanDrawer open={drawerOpen} onClose={() => dispatch(setCloseDrawer())} />
    </div>
  );
}
