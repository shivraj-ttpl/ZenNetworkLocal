import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext, useParams } from 'react-router-dom';

import ActionDropdown from '@/components/commonComponents/actionDropdown';
import Button from '@/components/commonComponents/button/Button';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Pagination from '@/components/commonComponents/pagination/Pagination';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import { buildColumns, Table } from '@/components/commonComponents/table';
import ToggleSwitch from '@/components/commonComponents/toggleSwitch/ToggleSwitch';
import VerificationIcon from '@/components/commonComponents/verificationIcon/VerificationIcon';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useDebounce } from '@/hooks/useDebounce';
import { useFlexCleanup } from '@/hooks/useFlexCleanup';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import useSubOrgTenantName from '@/hooks/useSubOrgTenantName';
import { useTableHeight } from '@/hooks/useTableHeight';

import AddUserDrawer from './Components/AddUserDrawer';
import ViewUserModal from './Components/ViewUserModal';
import {
  providerGroupUsersActions,
  registerSaga,
} from './providerGroupUsersSaga';
import {
  componentKey,
  registerReducer,
  setOpenAddDrawer,
  setOpenEditDrawer,
  setOpenViewModal,
} from './providerGroupUsersSlice';

const { fetchUsers, archiveUser } = providerGroupUsersActions;
const EMPTY_STATE = {};

const STATUS_OPTIONS = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
];

export default function ProviderGroupUsers() {
  const { providerGroupId } = useParams();
  const { setToolbar } = useOutletContext();
  const dispatch = useDispatch();
  const tenantName = useSubOrgTenantName();

  const {
    usersList = [],
    totalRecords = 0,
    refreshFlag = 0,
  } = useSelector((state) => state[componentKey] ?? EMPTY_STATE);

  const tableRef = useRef(null);
  const tableMaxHeight = useTableHeight(tableRef);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [showArchive, setShowArchive] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const isLoading = useLoadingKey(LOADING_KEYS.PROVIDER_GROUP_USERS_GET_LIST);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    registerReducer();
    registerSaga();
  }, []);

  useFlexCleanup(componentKey);

  useEffect(() => {
    if (providerGroupId) {
      dispatch(
        fetchUsers({
          providerGroupId,
          tenantName,
          page,
          limit,
          search: debouncedSearch.trim() || undefined,
          showArchived: showArchive || undefined,
          status: statusFilter?.value || undefined,
          sortBy: sortKey || undefined,
          sortOrder: sortKey ? (sortOrder ?? 'desc') : undefined,
        }),
      );
    }
  }, [
    dispatch,
    providerGroupId,
    tenantName,
    page,
    limit,
    debouncedSearch,
    showArchive,
    statusFilter,
    sortKey,
    sortOrder,
    refreshFlag,
  ]);

  useEffect(() => {
    setToolbar(
      <>
        <Checkbox
          label="Show Archived"
          checked={showArchive}
          onChange={() => {
            setShowArchive((p) => !p);
            setPage(1);
          }}
          variant="blue"
          size="sm"
        />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-56 max-w-72 max-[1149px]:min-w-0 max-[1149px]:max-w-67.5 max-[1149px]:flex-1">
          <Icon name="Search" size={14} className="text-neutral-400" />
          <input
            type="text"
            placeholder="Search by Name/Role"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-transparent text-sm outline-none text-neutral-800 placeholder-text-placeholder"
          />
          <button
            type="button"
            onClick={() => dispatch(setSearch(''))}
            className={`text-neutral-400 hover:text-neutral-600 shrink-0 ${search ? 'visible' : 'invisible'}`}
          >
            <Icon name="X" size={14} />
          </button>
        </div>
        <div className="w-32 max-[1149px]:w-auto max-[1149px]:max-w-57.5 max-[1149px]:flex-1 max-[1149px]:min-w-30">
          <SelectDropdown
            name="status"
            placeholder="Status"
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
          />
        </div>
        <Button
          variant="primaryBlue"
          size="sm"
          onClick={() => dispatch(setOpenAddDrawer())}
        >
          <Icon name="Plus" size={14} />
          Add Users
        </Button>
      </>,
    );
    return () => setToolbar(null);
  }, [setToolbar, showArchive, search, statusFilter, dispatch]);

  const handleSortChange = useCallback((key, order) => {
    setSortKey(key);
    setSortOrder(order);
  }, []);

  const totalPages = Math.ceil((totalRecords ?? 0) / limit) || 1;

  const tableData = useMemo(
    () =>
      usersList.map((item, i) => ({
        ...item,
        srNo: String((page - 1) * limit + i + 1).padStart(2, '0'),
        name: `${item.firstName || ''} ${item.lastName || ''}`.trim(),
      })),
    [usersList, page, limit],
  );

  const columns = useMemo(
    () =>
      buildColumns([
        { id: 'srNo', header: 'Sr. No', accessorKey: 'srNo', width: 70 },
        {
          id: 'name',
          header: 'Name',
          accessorKey: 'name',
          render: (row) => (
            <span className="text-primary-700 font-medium">{row.name}</span>
          ),
        },
        {
          id: 'email',
          header: 'Email Address',
          accessorKey: 'email',
          render: (row) => (
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-text-primary">{row.email}</span>
              <VerificationIcon
                verified={row.emailVerified === 'VERIFIED'}
                size={18}
              />
            </div>
          ),
        },
        {
          id: 'providerGroupRoleTitle',
          header: 'Role',
          accessorKey: 'providerGroupRoleTitle',
          render: (row) => {
            const pg = row.providerGroups?.[0];
            return pg?.roleTitle || row.userType || '—';
          },
        },
        {
          id: 'status',
          header: 'Status',
          accessorKey: 'status',
          width: 120,
          render: (row) => (
            <ToggleSwitch
              checked={row?.status === 'ACTIVE'}
              showLabel={false}
              onChangeCb={() =>
                dispatch(
                  providerGroupUsersActions.updateUserStatus({
                    userId: row.id,
                    status: row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
                  }),
                )
              }
            />
          ),
        },
        {
          id: 'actions',
          header: 'Action',
          width: 70,
          align: 'center',
          render: (row) => {
            const options = [
              {
                label: 'View',
                value: 'view',
                onClickCb: () => dispatch(setOpenViewModal(row)),
              },
              {
                label: 'Edit',
                value: 'edit',
                onClickCb: () => dispatch(setOpenEditDrawer(row)),
              },
            ];

            if (showArchive) {
              options.push({
                label: 'Unarchive',
                value: 'unarchive',
                onClickCb: () =>
                  dispatch(archiveUser({ userId: row.id, isArchived: true })),
              });
            } else {
              options.push({
                label: 'Archive',
                value: 'archive',
                onClickCb: () =>
                  dispatch(archiveUser({ userId: row.id, isArchived: false })),
              });
            }

            return <ActionDropdown options={options} />;
          },
        },
      ]),
    [dispatch, showArchive],
  );

  return (
    <div className="px-5 pb-4" ref={tableRef}>
      <Table
        columns={columns}
        data={tableData}
        size="sm"
        maxHeight={tableMaxHeight}
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
      <AddUserDrawer />
      <ViewUserModal />
    </div>
  );
}
