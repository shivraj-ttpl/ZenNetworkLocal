import { useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import ActionDropdown from '@/components/commonComponents/actionDropdown';
import Button from '@/components/commonComponents/button/Button';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Pagination from '@/components/commonComponents/pagination/Pagination';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import { Table, buildColumns } from '@/components/commonComponents/table';
import ToggleSwitch from '@/components/commonComponents/toggleSwitch/ToggleSwitch';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { ROLES } from '@/constants/roles';
import { useDebounce } from '@/hooks/useDebounce';
import { useFlexCleanup } from '@/hooks/useFlexCleanup';
import useCurrentUserRole from '@/hooks/getCurrentUserRole';
import { useLoadingKey } from '@/hooks/useLoadingKey';

import { STATUS_OPTIONS } from './constant';
import AddProviderGroupDrawer from './Components/AddProviderGroupDrawer';
import StatusChangeModal from './Components/StatusChangeModal';
import { providerGroupListActions, registerSaga } from './providerGroupListSaga';
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
} from './providerGroupListSlice';

const { fetchProviderGroups, archiveProviderGroup } = providerGroupListActions;
const EMPTY_STATE = {};

export default function ProviderGroupList() {
  const { subOrgId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setToolbar } = useOutletContext();
  const { currentUserRole } = useCurrentUserRole();
  const isSubOrgAdmin = currentUserRole === ROLES.SUB_ORG_ADMIN;

  const {
    providerGroupList = [],
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

  const isLoading = useLoadingKey(LOADING_KEYS.PROVIDER_GROUP_LIST_GET_LIST);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    registerReducer();
    registerSaga();
  }, []);

  useFlexCleanup(componentKey);

  useEffect(() => {
    if (subOrgId) {
      dispatch(fetchProviderGroups({ subOrgId }));
    }
  }, [
    dispatch,
    subOrgId,
    page,
    limit,
    debouncedSearch,
    showArchived,
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
          checked={showArchived}
          onChange={() => dispatch(setShowArchived(!showArchived))}
          variant="blue"
          size="sm"
        />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-56">
          <Icon name="Search" size={14} className="text-neutral-400" />
          <input
            type="text"
            placeholder="Search by Name/Specialty"
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
        {isSubOrgAdmin && (
          <Button
            variant="primaryBlue"
            size="sm"
            onClick={() => dispatch(setDrawerOpen(true))}
          >
            <Icon name="Plus" size={14} />
            Add Provider Group
          </Button>
        )}
      </>,
    );
    return () => setToolbar(null);
  }, [setToolbar, showArchived, search, statusFilter, dispatch]);

  const handleSortChange = useCallback(
    (key, order) => {
      dispatch(setSortKey(key));
      dispatch(setSortOrder(order));
    },
    [dispatch],
  );

  const handlePageChange = useCallback(
    (p) => dispatch(setPage(p)),
    [dispatch],
  );
  const handleLimitChange = useCallback(
    (l) => dispatch(setLimit(l)),
    [dispatch],
  );

  const tableData = useMemo(
    () =>
      providerGroupList.map((item, i) => ({
        ...item,
        srNo: String((page - 1) * limit + i + 1).padStart(2, '0'),
      })),
    [providerGroupList, page, limit],
  );

  const columns = useMemo(
    () =>
      buildColumns([
        { id: 'srNo', header: 'Sr. No', accessorKey: 'srNo', width: 70 },
        {
          id: 'name',
          header: 'Provider Group Name',
          accessorKey: 'name',
          sortable: true,
          render: (row) =>
            isSubOrgAdmin ? (
              <span
                className="text-primary-700 cursor-pointer hover:underline"
                onClick={() =>
                  navigate(
                    `/sub-organizations/${subOrgId}/provider-groups/${row.id}`,
                  )
                }
              >
                {row.name}
              </span>
            ) : (
              <span>{row.name}</span>
            ),
        },
        {
          id: 'specialties',
          header: 'Specialty',
          accessorKey: 'specialties',
          render: (row) => {
            const specs = row.specialties || [];
            if (!specs.length) return '-';
            const MAX_VISIBLE = 2;
            const visible = specs.slice(0, MAX_VISIBLE);
            const remaining = specs.length - MAX_VISIBLE;
            return (
              <div className="flex items-center gap-1 flex-wrap">
                {visible.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-700 whitespace-nowrap"
                  >
                    {s.length > 18 ? `${s.slice(0, 15)}...` : s}
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
          id: 'email',
          header: 'Email Address',
          accessorKey: 'email',
          render: (row) => row.email || '-',
        },
        {
          id: 'address',
          header: 'Address',
          minWidth: 200,
          render: (row) => {
            const addr = row.primaryAddress || row.address;
            if (!addr) return '-';
            return [addr.addressLine1, addr.city, addr.state, addr.zipCode]
              .filter(Boolean)
              .join(', ');
          },
        },
        {
          id: 'contact',
          header: 'Contact',
          width: 140,
          render: (row) => {
            if (!row.contactNumber) return '-';
            const code = row.countryCode || '';
            return `${code} ${row.contactNumber}`.trim();
          },
        },
        ...(isSubOrgAdmin
          ? [
              {
                id: 'status',
                header: 'Status',
                accessorKey: 'status',
                width: 120,
                sortable: true,
                render: (row) => (
                  <ToggleSwitch
                    name={`status-${row.id}`}
                    checked={row.status === 'ACTIVE'}
                    showLabel={false}
                    onChangeCb={() =>
                      dispatch(setStatusModal({ open: true, row }))
                    }
                  />
                ),
              },
            ]
          : []),
        ...(isSubOrgAdmin
          ? [
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
                      onClickCb: () =>
                        navigate(
                          `/sub-organizations/${subOrgId}/provider-groups/${row.id}`,
                        ),
                    },
                  ];

                  if (row.status === 'INACTIVE') {
                    options.push({
                      label: row.isArchived ? 'Unarchive' : 'Archive',
                      value: 'archive',
                      onClickCb: () =>
                        dispatch(
                          archiveProviderGroup({
                            id: row.id,
                            isArchived: row.isArchived,
                          }),
                        ),
                    });
                  }

                  return <ActionDropdown options={options} />;
                },
              },
            ]
          : []),
      ]),
    [navigate, subOrgId, dispatch, isSubOrgAdmin],
  );

  return (
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
      {isSubOrgAdmin && (
        <>
          <AddProviderGroupDrawer subOrgId={subOrgId} />
          <StatusChangeModal />
        </>
      )}
    </div>
  );
}
