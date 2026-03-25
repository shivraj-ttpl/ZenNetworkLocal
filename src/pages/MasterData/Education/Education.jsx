import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { Table, buildColumns } from "@/components/commonComponents/table";
import Pagination from "@/components/commonComponents/pagination/Pagination";
import Icon from "@/components/icons/Icon";
import Checkbox from "@/components/commonComponents/checkbox/Checkbox";
import Button from "@/components/commonComponents/button/Button";
import ActionDropdown from "@/components/commonComponents/actionDropdown";
import { educationData } from "@/data/masterData";
import { setOpenAddDrawer, setOpenEditDrawer, setOpenViewModal } from "./educationSlice";
import AddMaterialDrawer from "./Components/AddMaterialDrawer";
import ViewEducationModal from "./Components/ViewEducationModal";
import FilterDropdown from "./Components/FilterDropdown";

export default function Education() {
  const dispatch = useDispatch();
  const { setToolbar } = useOutletContext();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [showArchive, setShowArchive] = useState(false);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [filters, setFilters] = useState({ specialty: null, fileType: null });

  const handleFilterApply = useCallback((newFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

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
            placeholder="Search by File Name"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-transparent text-sm outline-none text-neutral-800 placeholder-text-placeholder"
          />
        </div>
        <FilterDropdown onApply={handleFilterApply} />
        <Button variant="primaryTeal" size="sm" onClick={() => dispatch(setOpenAddDrawer())}>
          <Icon name="Plus" size={14} />
          Add Material
        </Button>
      </>
    );
    return () => setToolbar(null);
  }, [setToolbar, showArchive, search, dispatch, handleFilterApply]);

  const handleSortChange = useCallback((key, order) => {
    setSortKey(key);
    setSortOrder(order);
  }, []);

  const filteredData = useMemo(() => {
    let data = educationData;

    if (search) {
      const term = search.toLowerCase();
      data = data.filter((item) => item.fileName.toLowerCase().includes(term));
    }

    if (filters.specialty) {
      data = data.filter((item) => item.specialty === filters.specialty);
    }

    if (filters.fileType) {
      data = data.filter((item) => item.fileType === filters.fileType);
    }

    return data;
  }, [search, filters]);

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
        { id: "fileName", header: "File Name", accessorKey: "fileName" },
        { id: "specialty", header: "Specialty", accessorKey: "specialty", width: 160 },
        { id: "fileType", header: "File Type", accessorKey: "fileType", width: 100 },
        { id: "uploadedOn", header: "Uploaded On", accessorKey: "uploadedOn", width: 130 },
        { id: "uploadedBy", header: "Uploaded By", accessorKey: "uploadedBy", width: 160 },
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
                { label: "Edit", value: "edit", onClickCb: () => { dispatch(setOpenEditDrawer(row)); } },
                { label: "View", value: "view", onClickCb: () => dispatch(setOpenViewModal(row)) },
                { label: "Download", value: "download", onClickCb: () => {} },
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

      <AddMaterialDrawer />
      <ViewEducationModal />
    </div>
  );
}
