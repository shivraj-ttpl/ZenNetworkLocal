import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import ActionDropdown from '@/components/commonComponents/actionDropdown';
import Button from '@/components/commonComponents/button/Button';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Pagination from '@/components/commonComponents/pagination/Pagination';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import { buildColumns, Table } from '@/components/commonComponents/table';
import ToggleSwitch from '@/components/commonComponents/toggleSwitch/ToggleSwitch';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { ROLES } from '@/constants/roles';
import useCurrentUserRole from '@/hooks/getCurrentUserRole';
import { useDebounce } from '@/hooks/useDebounce';
import { useFlexCleanup } from '@/hooks/useFlexCleanup';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import { useTableHeight } from '@/hooks/useTableHeight';

import ToolTip from '../../../components/commonComponents/toolTip/ToolTip';
import AddProviderGroupDrawer from './Components/AddProviderGroupDrawer';
import StatusChangeModal from './Components/StatusChangeModal';
import { ALL_STATUS_OPTION, STATUS_OPTIONS } from './constant';
import {
  providerGroupListActions,
  registerSaga,
} from './providerGroupListSaga';
import {
  componentKey,
  registerReducer,
  setDrawerOpen,
  setLimit,
  setPage,
  setSearch,
  setShowArchived,
  setSortKey,
  setSortOrder,
  setStatusFilter,
  setStatusModal,
} from './providerGroupListSlice';
import useSubOrgTenantName from '@/hooks/useSubOrgTenantName';

const { fetchProviderGroups, fetchProviderGroupById, archiveProviderGroup } =
  providerGroupListActions;
const EMPTY_STATE = {};

export default function ProviderGroupList() {
  const { subOrgId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const subOrgName = searchParams.get('name') || '';
  const { setToolbar } = useOutletContext();
  const { currentUserRole } = useCurrentUserRole();
  const isSubOrgAdmin = currentUserRole === ROLES.SUB_ORG_ADMIN;
  const tenantName = useSubOrgTenantName();

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
    drawerMode = '',
    editData = null,
  } = useSelector((state) => state[componentKey] ?? EMPTY_STATE);

  const tableRef = useRef(null);
  const tableMaxHeight = useTableHeight(tableRef);
  const isLoading = useLoadingKey(LOADING_KEYS.PROVIDER_GROUP_LIST_GET_LIST);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    registerReducer();
    registerSaga();
  }, []);

  useFlexCleanup(componentKey);

  useEffect(() => {
    if (subOrgId) {
      dispatch(
        fetchProviderGroups({
          subOrgId,
          tenantName,
          ...(isSubOrgAdmin ? { tenantName } : {}),
        }),
      );
    }
  }, [
    dispatch,
    subOrgId,
    tenantName,
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
          label="Show Archived"
          checked={showArchived}
          onChange={() => dispatch(setShowArchived(!showArchived))}
          variant="blue"
          size="sm"
        />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-56 max-w-72 max-[1149px]:min-w-0 max-[1149px]:max-w-67.5 max-[1149px]:flex-1">
          <Icon name="Search" size={14} className="text-neutral-400" />
          <input
            type="text"
            placeholder="Search by Name/Specialty"
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
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
            options={[ALL_STATUS_OPTION, ...STATUS_OPTIONS]}
            value={statusFilter}
            isClearable={!!statusFilter?.value}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setToolbar, showArchived, search, statusFilter, dispatch]);

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
                onClick={() => {
                  const params = new URLSearchParams();
                  if (subOrgName) params.set('name', subOrgName);
                  if (row.name) params.set('pgName', row.name);
                  navigate(
                    `/sub-organizations/${subOrgId}/provider-groups/${row.id}?${params.toString()}`,
                  );
                }}
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
            if (!specs?.length) return '-';
            const MAX_VISIBLE = 2;
            const visible = specs?.slice(0, MAX_VISIBLE);
            const remaining = specs?.length - MAX_VISIBLE;
            return (
              <div className="flex items-center gap-1 flex-wrap">
                {visible?.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-700 whitespace-nowrap"
                  >
                    {s.length > 18 ? `${s.slice(0, 15)}...` : s}
                  </span>
                ))}
                {remaining > 0 && (
                  <ToolTip
                    content={
                      <div className="p-2 w-80 flex flex-wrap gap-2">
                        {specs?.slice(MAX_VISIBLE).map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-700 whitespace-nowrap"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    }
                    position="bottom"
                  >
                    <span className="text-xs text-primary-700 font-medium cursor-pointer">
                      +{remaining}
                    </span>
                  </ToolTip>
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
                      onClickCb: () => {
                        const params = new URLSearchParams();
                        if (subOrgName) params.set('name', subOrgName);
                        if (row.name) params.set('pgName', row.name);
                        navigate(
                          `/sub-organizations/${subOrgId}/provider-groups/${row.id}?${params.toString()}`,
                        );
                      },
                    },
                    {
                      label: 'Edit',
                      value: 'edit',
                      onClickCb: () =>
                        dispatch(
                          fetchProviderGroupById({ id: row.id, tenantName }),
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
                            tenantName,
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
    [navigate, subOrgId, dispatch, isSubOrgAdmin, subOrgName],
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
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
      {isSubOrgAdmin && (
        <>
          <AddProviderGroupDrawer
            subOrgId={subOrgId}
            drawerMode={drawerMode}
            editData={editData}
          />
          <StatusChangeModal />
        </>
      )}
    </div>
  );
}
