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
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useDebounce } from '@/hooks/useDebounce';
import { useFlexCleanup } from '@/hooks/useFlexCleanup';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import useSubOrgTenantName from '@/hooks/useSubOrgTenantName';
import { useTableHeight } from '@/hooks/useTableHeight';

import AddProviderDrawer from './Components/AddProviderDrawer';
import StatusChangeModal from './Components/StatusChangeModal';
import ViewProviderModal from './Components/ViewProviderModal';
import {
  providerGroupProvidersActions,
  registerSaga,
} from './providerGroupProvidersSaga';
import {
  componentKey,
  registerReducer,
  setOpenAddDrawer,
  setOpenEditDrawer,
  setOpenStatusModal,
  setOpenViewModal,
} from './providerGroupProvidersSlice';

const STATUS_OPTIONS = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
];

const { fetchProviders, fetchProviderById, archiveProvider } =
  providerGroupProvidersActions;
const EMPTY_STATE = {};

export default function ProviderGroupProviders() {
  const { setToolbar } = useOutletContext();
  const { providerGroupId } = useParams();
  const dispatch = useDispatch();
  const tenantName = useSubOrgTenantName();

  const tableRef = useRef(null);
  const tableMaxHeight = useTableHeight(tableRef);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [showArchive, setShowArchive] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const {
    providersList = [],
    totalRecords = 0,
    refreshFlag = 0,
    statusModalOpen,
    statusChangeRow,
  } = useSelector((state) => state[componentKey] ?? EMPTY_STATE);

  const isLoading = useLoadingKey(
    LOADING_KEYS.PROVIDER_GROUP_PROVIDERS_GET_LIST,
  );
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    registerReducer();
    registerSaga();
  }, []);

  useFlexCleanup(componentKey);

  useEffect(() => {
    if (providerGroupId) {
      dispatch(
        fetchProviders({
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
          label="Show Archive"
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
            placeholder="Search by Name/Specialty"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-transparent text-sm outline-none text-neutral-800 placeholder-text-placeholder"
          />
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
          Add Provider
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
      providersList.map((item, i) => ({
        ...item,
        srNo: String((page - 1) * limit + i + 1).padStart(2, '0'),
      })),
    [providersList, page, limit],
  );

  const columns = useMemo(
    () =>
      buildColumns([
        { id: 'srNo', header: 'Sr. No', accessorKey: 'srNo', width: 70 },
        {
          id: 'name',
          header: 'Provider Name',
          accessorKey: 'name',
          render: (row) => {
            const name = `${row?.firstName}  ${row?.lastName}`;
            return <span className="text-primary-700 font-medium">{name}</span>;
          },
        },
        {
          id: 'multiProviderAccess',
          header: 'Multi-Provider Access',
          accessorKey: 'multiProvider',
          render: (row) => (
            <span
              className={
                row.multiProvider ? 'text-text-primary' : 'text-neutral-400'
              }
            >
              {row.multiProvider ? '\u2713' : '-'}
            </span>
          ),
        },
        {
          id: 'specialties',
          header: 'Specialty',
          accessorKey: 'specialties',
          maxWidth: '650px',
          render: (row) => {
            const specs = row.specialties || [];
            if (!specs.length) return '-';
            const visible = specs.slice(0, 2);
            const remaining = specs.length - 2;
            return (
              <div className="flex items-center gap-1">
                {visible.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-lg text-xs font-medium bg-primary-50 text-primary-700 whitespace-nowrap"
                  >
                    {s.length > 15 ? s.slice(0, 12) + '...' : s}
                  </span>
                ))}
                {remaining > 0 && (
                  <span className="text-xs text-primary-700 font-medium">
                    +{remaining}
                  </span>
                )}
              </div>
            );
          },
        },
        {
          id: 'role',
          header: 'Role',
          accessorKey: 'role',
          render: (row) => row?.primaryRoleTitle,
        },
        {
          id: 'email',
          header: 'Email Address',
          accessorKey: 'email',
          render: (row) => (
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-text-primary">{row.email}</span>
              {row.emailVerified && (
                <span className="w-4 h-4 rounded-full bg-success-500 flex items-center justify-center shrink-0">
                  <Icon name="Check" size={10} className="text-white" />
                </span>
              )}
            </div>
          ),
        },
        {
          id: 'contact',
          header: 'Contact',
          accessorKey: 'contact',
          width: 140,
        },
        { id: 'lastLogin', header: 'Last Login', accessorKey: 'lastLogin' },
        {
          id: 'status',
          header: 'Status',
          accessorKey: 'status',
          width: 120,
          render: (row) => (
            <ToggleSwitch
              name={`status-${row.id}`}
              checked={row.status === 'ACTIVE'}
              onChangeCb={() => dispatch(setOpenStatusModal(row))}
              showLabel={false}
            />
          ),
        },
        {
          id: 'actions',
          header: 'Action',
          sticky: 'right',
          width: 70,
          align: 'center',
          render: (row) => (
            <ActionDropdown
              options={[
                {
                  label: 'View',
                  value: 'view',
                  onClickCb: () => {
                    dispatch(setOpenViewModal(row));
                    dispatch(
                      fetchProviderById({
                        providerId: row.id,
                        providerGroupId,
                        tenantName,
                      }),
                    );
                  },
                },
                {
                  label: 'Edit',
                  value: 'edit',
                  onClickCb: () => {
                    dispatch(setOpenEditDrawer(row));
                    dispatch(
                      fetchProviderById({
                        providerId: row.id,
                        providerGroupId,
                        tenantName,
                      }),
                    );
                  },
                },
                {
                  label: row.isArchived ? 'Unarchive' : 'Archive',
                  value: 'archive',
                  onClickCb: () =>
                    dispatch(
                      archiveProvider({
                        providerId: row.id,
                        isArchived: row.isArchived,
                      }),
                    ),
                },
              ]}
            />
          ),
        },
      ]),
    [dispatch, providerGroupId, tenantName],
  );

  return (
    <div className="px-5 pb-4" ref={tableRef}>
      <Table
        columns={columns}
        data={tableData}
        size="sm"
        maxHeight={tableMaxHeight}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        loading={isLoading}
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
      <AddProviderDrawer />
      <ViewProviderModal />
      <StatusChangeModal
        open={statusModalOpen}
        statusChangeRow={statusChangeRow}
      />
    </div>
  );
}
