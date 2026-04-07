import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext, useParams } from 'react-router-dom';

import ActionDropdown from '@/components/commonComponents/actionDropdown';
import Button from '@/components/commonComponents/button/Button';
import Pagination from '@/components/commonComponents/pagination/Pagination';
import { buildColumns, Table } from '@/components/commonComponents/table';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useDebounce } from '@/hooks/useDebounce';
import { useFlexCleanup } from '@/hooks/useFlexCleanup';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import { formatDate } from '@/utils/GeneralUtils';

import useSubOrgTenantName from '../../../hooks/useSubOrgTenantName';
import AddFeeScheduleDrawer from './Components/AddFeeScheduleDrawer';
import {
  feeScheduleActions,
  registerSaga,
} from './providerGroupFeeScheduleSaga';
import {
  componentKey,
  registerReducer,
  setOpenAddDrawer,
  setOpenEditDrawer,
} from './providerGroupFeeScheduleSlice';

const { fetchFeeSchedules, deleteFeeSchedule } = feeScheduleActions;
const EMPTY_STATE = {};

export default function ProviderGroupFeeSchedule() {
  const { providerGroupId } = useParams();
  const { setToolbar } = useOutletContext();
  const dispatch = useDispatch();
  const tenantName = useSubOrgTenantName();

  const {
    feeScheduleList = [],
    totalRecords = 0,
    refreshFlag = 0,
  } = useSelector((state) => state[componentKey] ?? EMPTY_STATE);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const isLoading = useLoadingKey(LOADING_KEYS.FEE_SCHEDULE_GET_LIST);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    registerReducer();
    registerSaga();
  }, []);

  useFlexCleanup(componentKey);

  useEffect(() => {
    if (providerGroupId) {
      dispatch(
        fetchFeeSchedules({
          providerGroupId,
          tenantName,
          page,
          limit,
          search: debouncedSearch.trim() || undefined,
          sortBy: sortKey || undefined,
          sortOrder: sortKey ? (sortOrder ?? 'desc') : undefined,
        }),
      );
    }
  }, [
    dispatch,
    providerGroupId,
    page,
    limit,
    debouncedSearch,
    sortKey,
    sortOrder,
    refreshFlag,
    tenantName,
  ]);

  useEffect(() => {
    setToolbar(
      <>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-52">
          <Icon name="Search" size={14} className="text-neutral-400" />
          <input
            type="text"
            placeholder="Search by CPT Code"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-transparent text-sm outline-none text-neutral-800 placeholder-text-placeholder"
          />
        </div>
        <Button
          variant="primaryBlue"
          size="sm"
          onClick={() => dispatch(setOpenAddDrawer())}
        >
          <Icon name="Plus" size={14} />
          Add Fee Schedule
        </Button>
      </>,
    );
    return () => setToolbar(null);
  }, [setToolbar, search, dispatch]);

  const handleSortChange = useCallback((key, order) => {
    setSortKey(key);
    setSortOrder(order);
  }, []);

  const totalPages = Math.ceil((totalRecords ?? 0) / limit) || 1;

  const tableData = useMemo(
    () =>
      feeScheduleList.map((item, i) => ({
        ...item,
        srNo: String((page - 1) * limit + i + 1).padStart(2, '0'),
      })),
    [feeScheduleList, page, limit],
  );

  const columns = useMemo(
    () =>
      buildColumns([
        { id: 'srNo', header: 'Sr. No', accessorKey: 'srNo', width: 70 },
        { id: 'program', header: 'Program Name', accessorKey: 'program' },
        { id: 'cptCode', header: 'CPT Code', accessorKey: 'cptCode' },
        {
          id: 'startDate',
          header: 'Start Date',
          accessorKey: 'startDate',
          render: (row) => formatDate(row.startDate),
        },
        {
          id: 'endDate',
          header: 'End Date',
          accessorKey: 'endDate',
          render: (row) => formatDate(row.endDate),
        },
        {
          id: 'rate',
          header: 'Rate ($)',
          accessorKey: 'rate',
          align: 'right',
          render: (row) => (
            <span className="text-text-primary">{row.rate ?? '—'}</span>
          ),
        },
        {
          id: 'actions',
          header: 'Action',
          width: 70,
          align: 'center',
          render: (row) => (
            <ActionDropdown
              options={[
                {
                  label: 'Edit',
                  value: 'edit',
                  onClickCb: () => dispatch(setOpenEditDrawer(row)),
                },
                {
                  label: 'Delete',
                  value: 'delete',
                  onClickCb: () => dispatch(deleteFeeSchedule({ id: row.id })),
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
        data={tableData}
        size="sm"
        maxHeight="475px"
        loading={isLoading}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />
      <Pagination
        totalRecords={totalRecords}
        totalPages={totalPages}
        currentPage={page}
        currentLimit={limit}
        onPageChange={setPage}
        onLimitChange={(val) => {
          setLimit(val);
          setPage(1);
        }}
      />
      <AddFeeScheduleDrawer />
    </div>
  );
}
