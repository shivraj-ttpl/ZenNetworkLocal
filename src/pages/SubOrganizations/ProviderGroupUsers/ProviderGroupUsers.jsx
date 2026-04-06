import { useState, useMemo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext, useParams } from 'react-router-dom';

import ActionDropdown from '@/components/commonComponents/actionDropdown';
import Button from '@/components/commonComponents/button/Button';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Pagination from '@/components/commonComponents/pagination/Pagination';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import { Table, buildColumns } from '@/components/commonComponents/table';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useDebounce } from '@/hooks/useDebounce';
import { useFlexCleanup } from '@/hooks/useFlexCleanup';
import { useLoadingKey } from '@/hooks/useLoadingKey';

import AddUserDrawer from './Components/AddUserDrawer';
import ViewUserModal from './Components/ViewUserModal';
import { providerGroupUsersActions, registerSaga } from './providerGroupUsersSaga';
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

  const {
    usersList = [],
    totalRecords = 0,
    refreshFlag = 0,
  } = useSelector((state) => state[componentKey] ?? EMPTY_STATE);

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
  }, [dispatch, providerGroupId, page, limit, debouncedSearch, showArchive, statusFilter, sortKey, sortOrder, refreshFlag]);

  useEffect(() => {
    setToolbar(
      <>
        <Checkbox
          label="Show Archive"
          checked={showArchive}
          onChange={() => {
            setShowArchive((p) => !p);
            setPage(1);
          }}
          variant="blue"
          size="sm"
        />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-56">
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
        </div>
        <div className="w-32">
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
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${row.emailVerified ? 'bg-success-500' : 'bg-warning-500'}`}
              >
                <Icon name="Check" size={10} className="text-white" />
              </span>
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
            <span
              className={
                row.status === 'ACTIVE'
                  ? 'text-text-primary'
                  : 'text-neutral-400'
              }
            >
              {row.status === 'ACTIVE' ? 'Active' : 'Inactive'}
            </span>
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
      <AddUserDrawer />
      <ViewUserModal />
    </div>
  );
}
