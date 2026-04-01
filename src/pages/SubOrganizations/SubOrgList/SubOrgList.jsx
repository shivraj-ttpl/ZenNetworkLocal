import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import ActionDropdown from '@/components/commonComponents/actionDropdown';
import Button from '@/components/commonComponents/button/Button';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Pagination from '@/components/commonComponents/pagination/Pagination';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import { Table, buildColumns } from '@/components/commonComponents/table';
import ToggleSwitch from '@/components/commonComponents/toggleSwitch/ToggleSwitch';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useDebounce } from '@/hooks/useDebounce';
import { useFlexCleanup } from '@/hooks/useFlexCleanup';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import { formatDate } from '@/utils/GeneralUtils';

import { STATUS_OPTIONS } from './constant';
import AddSubOrgDrawer from './Components/AddSubOrgDrawer';
import StatusChangeModal from './Components/StatusChangeModal';
import { subOrgListActions, registerSaga } from './subOrgListSaga';
import {
  componentKey,
  registerReducer,
  setPage,
  setLimit,
  setSearch,
  setShowArchived,
  setStatusFilter,
  setSortKey,
  setSortOrder,
  setDrawerOpen,
  setStatusModal,
} from './subOrgListSlice';

const { fetchSubOrganizations, fetchSubOrgById, archiveSubOrganization } =
  subOrgListActions;
const EMPTY_STATE = {};

export default function SubOrgList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    subOrgList = [],
    totalRecords = 0,
    totalPages = 0,
    page = 1,
    limit = 20,
    search = '',
    showArchived = false,
    statusFilter = null,
    sortKey = null,
    sortOrder = null,
    refreshFlag = 0,
  } = useSelector((state) => state[componentKey] ?? EMPTY_STATE);

  const isLoading = useLoadingKey(LOADING_KEYS.SUB_ORG_LIST_GET_LIST);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    registerReducer();
    registerSaga();
  }, []);

  useFlexCleanup(componentKey);

  useEffect(() => {
    dispatch(fetchSubOrganizations());
  }, [
    dispatch,
    page,
    limit,
    debouncedSearch,
    showArchived,
    statusFilter,
    sortKey,
    sortOrder,
    refreshFlag,
  ]);

  const handleSortChange = useCallback(
    (key, order) => {
      dispatch(setSortKey(key));
      dispatch(setSortOrder(order));
    },
    [dispatch],
  );

  const handlePageChange = useCallback((p) => dispatch(setPage(p)), [dispatch]);
  const handleLimitChange = useCallback(
    (l) => dispatch(setLimit(l)),
    [dispatch],
  );

  const tableData = useMemo(
    () =>
      subOrgList.map((item, i) => ({
        ...item,
        srNo: String((page - 1) * limit + i + 1).padStart(2, '0'),
      })),
    [subOrgList, page, limit],
  );

  const columns = useMemo(
    () =>
      buildColumns([
        { id: 'srNo', header: 'Sr. No', accessorKey: 'srNo', width: 72 },
        {
          id: 'uuid',
          header: 'Sub-Org ID',
          accessorKey: 'uuid',
          width: 100,
          render: (row) => <span>{row?.uuid && row?.uuid?.slice(-6)}</span>,
        },
        {
          id: 'name',
          header: 'Sub-Organization Name',
          accessorKey: 'name',
          sortable: true,
          render: (row) => (
            <span
              className="text-primary-700 cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/sub-organizations/${row.id}?name=${encodeURIComponent(row.name)}`);
              }}
            >
              {row.name}
            </span>
          ),
        },
        {
          id: 'address',
          header: 'Address',
          minWidth: 200,
          render: (row) => {
            const addr = row.address;
            if (!addr) return '-';
            return [addr.addressLine1, addr.city, addr.state, addr.zipCode]
              .filter(Boolean)
              .join(', ');
          },
        },
        {
          id: 'createdAt',
          header: 'Created Date',
          accessorKey: 'createdAt',
          width: 120,
          sortable: true,
          render: (row) => formatDate(row.createdAt),
        },
        {
          id: 'status',
          header: 'Status',
          accessorKey: 'status',
          width: 100,
          sortable: true,
          render: (row) => (
            <ToggleSwitch
              name={`status-${row.id}`}
              checked={row.status === 'ACTIVE'}
              showLabel={false}
              onChangeCb={() =>
                dispatch(setStatusModal({ open: true, step: 1, row }))
              }
            />
          ),
        },
        {
          id: 'actions',
          header: 'Action',
          width: 72,
          align: 'center',
          render: (row) => {
            const options = [
              {
                label: 'View',
                value: 'view',
                onClickCb: () => navigate(`/sub-organizations/${row.id}?name=${encodeURIComponent(row.name)}`),
              },
              {
                label: 'Edit',
                value: 'edit',
                onClickCb: () => dispatch(fetchSubOrgById({ id: row.id })),
              },
            ];

            if (row.status === 'INACTIVE') {
              options.push({
                label: row.isArchived ? 'Unarchive' : 'Archive',
                value: 'archive',
                onClickCb: () =>
                  dispatch(
                    archiveSubOrganization({
                      id: row.id,
                      isArchived: row.isArchived,
                    }),
                  ),
              });
            }

            return <ActionDropdown options={options} />;
          },
        },
      ]),
    [navigate, dispatch],
  );

  return (
    <div className="bg-surface h-full rounded-xl border border-border-light overflow-hidden">
      <div className="flex items-center justify-end px-5 pt-4 pb-3 gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap">
          <Checkbox
            label="Show Archive"
            checked={showArchived}
            onChange={() => dispatch(setShowArchived(!showArchived))}
            variant="blue"
            size="sm"
          />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-60">
            <Icon name="Search" size={14} className="text-neutral-400" />
            <input
              type="text"
              placeholder="Search by ID, Name"
              value={search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              className="w-full bg-transparent text-sm outline-none text-neutral-800 placeholder-text-placeholder"
            />
          </div>
          <div className="w-32">
            <SelectDropdown
              name="status"
              placeholder="Status"
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={(val) => dispatch(setStatusFilter(val))}
            />
          </div>
        </div>
        <Button
          variant="primaryBlue"
          size="sm"
          onClick={() => dispatch(setDrawerOpen(true))}
        >
          <Icon name="Plus" size={14} />
          Add New
        </Button>
      </div>
      <div className="px-5 pb-4">
        <Table
          columns={columns}
          data={tableData}
          size="sm"
          maxHeight="calc(100vh - 280px)"
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
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>
      <AddSubOrgDrawer />
      <StatusChangeModal />
    </div>
  );
}
