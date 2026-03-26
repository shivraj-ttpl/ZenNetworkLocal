import { useState, useMemo, useCallback, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Table, buildColumns } from "@/components/commonComponents/table";
import Pagination from "@/components/commonComponents/pagination/Pagination";
import Icon from "@/components/icons/Icon";
import Button from "@/components/commonComponents/button/Button";
import ActionDropdown from "@/components/commonComponents/actionDropdown";
import { feeScheduleData } from "@/data/subOrganizationsData";
import { componentKey, setOpenAddDrawer } from "../ProviderGroupFeeSchedule/providerGroupFeeScheduleSlice";
import { useDispatch, useSelector } from "react-redux";
import AddFeeScheduleDrawer from '../ProviderGroupFeeSchedule/Components/AddFeeScheduleDrawer'
export default function ProviderGroupFeeSchedule() {
  const { setToolbar } = useOutletContext();
 const { drawerOpen, drawerMode, editData } = useSelector(
    (state) => state[componentKey] ?? {})
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const dispatch=useDispatch()
  useEffect(() => {
    setToolbar(
      <>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-52">
          <Icon name="Search" size={14} className="text-neutral-400" />
          <input
            type="text"
            placeholder="Search by CPT Code"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-transparent text-sm outline-none text-neutral-800 placeholder-text-placeholder"
          />
        </div>
        <Button variant="primaryTeal" size="sm" onClick={()=>dispatch(setOpenAddDrawer())}>
          <Icon name="Plus" size={14} />
          Add Fee Schedule
        </Button>
      </>
    );
    return () => setToolbar(null);
  }, [setToolbar, search]);

  const handleSortChange = useCallback((key, order) => {
    setSortKey(key);
    setSortOrder(order);
  }, []);

  const filteredData = useMemo(() => {
    if (!search.trim()) return feeScheduleData;
    const term = search.toLowerCase();
    return feeScheduleData.filter((item) => item.cptCode.toLowerCase().includes(term));
  }, [search]);

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
        { id: "programName", header: "Program Name", accessorKey: "programName" },
        { id: "cptCode", header: "CPT Code", accessorKey: "cptCode" },
        { id: "startDate", header: "Start Date", accessorKey: "startDate" },
        { id: "endDate", header: "End Date", accessorKey: "endDate" },
        {
          id: "rate",
          header: "Rate ($)",
          accessorKey: "rate",
          align: "right",
          render: (row) => <span className="text-text-primary">{row.rate}</span>,
        },
        {
          id: "actions",
          header: "Action",
          width: 70,
          align: "center",
          render: () => (
            <ActionDropdown
              options={[
                { label: "Edit", value: "edit", onClickCb: () => {} },
                { label: "Delete", value: "delete", onClickCb: () => {} },
              ]}
            />
          ),
        },
      ]),
    []
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
      <AddFeeScheduleDrawer open={drawerOpen} drawerMode={drawerMode} editData={editData}/>
    </div>
  );
}
