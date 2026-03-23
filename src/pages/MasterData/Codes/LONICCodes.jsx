import { useState, useMemo, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Table, buildColumns } from "@/components/commonComponents/table";
import Pagination from "@/components/commonComponents/pagination/Pagination";
import ActionDropdown from "@/components/commonComponents/actionDropdown";
import { setOpenEditDrawer } from "./codesSlice";
import { lonicCodesData } from "@/data/masterData";

export default function LONICCodes() {
  const { codeLabel } = useOutletContext();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const totalRecords = lonicCodesData.length;
  const totalPages = Math.ceil(totalRecords / limit);

  const paginatedData = useMemo(
    () =>
      lonicCodesData
        .slice((page - 1) * limit, page * limit)
        .map((item, i) => ({
          ...item,
          srNo: String((page - 1) * limit + i + 1).padStart(2, "0"),
        })),
    [page, limit]
  );

  const columns = useMemo(
    () =>
      buildColumns([
        {
          id: "srNo",
          header: "Sr. No",
          accessorKey: "srNo",
          width: 70,
        },
        {
          id: "code",
          header: "LONIC Code",
          accessorKey: "code",
        },
        {
          id: "description",
          header: "Description",
          accessorKey: "description",
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
                { label: "Edit", value: "edit", onClickCb: () => dispatch(setOpenEditDrawer({ codeLabel, data: row })) },
                { label: "Add to Favorites", value: "addToFavorites", onClickCb: () => {} },
                { label: "Archive", value: "archive", onClickCb: () => {} },
              ]}
            />
          ),
        },
      ]),
    [dispatch, codeLabel]
  );

  const handlePageChange = useCallback((p) => setPage(p), []);
  const handleLimitChange = useCallback((l) => { setLimit(l); setPage(1); }, []);

  return (
    <div>
      <Table columns={columns} data={paginatedData} size="sm"  maxHeight="475px" />
      <Pagination
        totalRecords={totalRecords}
        totalPages={totalPages}
        currentPage={page}
        currentLimit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
}
