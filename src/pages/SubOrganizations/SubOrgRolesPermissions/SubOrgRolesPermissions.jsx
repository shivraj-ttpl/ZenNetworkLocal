import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { buildColumns, Table } from '@/components/commonComponents/table';
import ToggleSwitch from '@/components/commonComponents/toggleSwitch/ToggleSwitch';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useDebounce } from '@/hooks/useDebounce';
import { useFlexCleanup } from '@/hooks/useFlexCleanup';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import { useTableHeight } from '@/hooks/useTableHeight';
import { formatDate } from '@/utils/GeneralUtils';

import useCurrentUserRole from '../../../hooks/getCurrentUserRole';
import CreateRoleModal from './Components/CreateRoleModal';
import { registerSaga, subOrgRolesActions } from './subOrgRolesPermissionsSaga';
import {
  componentKey,
  registerReducer,
  setOpenCreateRoleModal,
} from './subOrgRolesPermissionsSlice';

export default function SubOrgRolesPermissions() {
  const { subOrgId } = useParams();
  const { setToolbar } = useOutletContext();
  const { isOrgAdmin } = useCurrentUserRole();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const nameParam = searchParams.get('name') || '';
  const qs = nameParam ? `?name=${encodeURIComponent(nameParam)}` : '';

  const state = useSelector((s) => s[componentKey]);
  const {
    createRoleModalOpen,
    rolesData,
    totalRecords,
    refreshFlag = 0,
  } = state || {};

  const tableRef = useRef(null);
  const tableMaxHeight = useTableHeight(tableRef);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [showArchive, setShowArchive] = useState(false);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const isLoading = useLoadingKey(LOADING_KEYS.SUB_ORG_ROLES_GET_LIST);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    registerReducer();
    registerSaga();
  }, []);

  useFlexCleanup(componentKey);

  useEffect(() => {
    dispatch(
      subOrgRolesActions.fetchRoles({
        page,
        limit,
        search: debouncedSearch.trim() || undefined,
        showArchived: showArchive || undefined,
        sortBy: sortKey || undefined,
        sortOrder: sortKey ? (sortOrder ?? 'desc') : undefined,
        subOrgId,
      }),
    );
  }, [
    dispatch,
    page,
    limit,
    debouncedSearch,
    showArchive,
    sortKey,
    sortOrder,
    refreshFlag,
    subOrgId,
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
            placeholder="Search by Role Name..."
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
        {isOrgAdmin && (
          <Button
            variant="primaryBlue"
            size="sm"
            onClick={() => dispatch(setOpenCreateRoleModal())}
          >
            <Icon name="Plus" size={14} />
            Create Roles
          </Button>
        )}
      </>,
    );
    return () => setToolbar(null);
  }, [setToolbar, showArchive, search, dispatch, isOrgAdmin]);

  const handleSortChange = useCallback((key, order) => {
    setSortKey(key);
    setSortOrder(order);
  }, []);

  const totalPages = Math.ceil((totalRecords ?? 0) / limit) || 1;

  const tableData = useMemo(
    () =>
      (rolesData ?? []).map((item, i) => ({
        ...item,
        srNo: String((page - 1) * limit + i + 1).padStart(2, '0'),
      })),
    [rolesData, page, limit],
  );

  const columns = useMemo(
    () =>
      buildColumns([
        {
          id: 'srNo',
          header: 'Sr. No',
          accessorKey: 'srNo',
          width: 70,
        },
        {
          id: 'name',
          header: 'Role Name',
          accessorKey: 'name',
          render: (row) => (
            <span
              className="cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                navigate(
                  `/sub-organizations/${subOrgId}/roles-permissions/${row.id}/view${qs}`,
                );
              }}
            >
              {row?.name}
            </span>
          ),
        },
        {
          id: 'roleType',
          header: 'Role Type',
          accessorKey: 'roleType',
        },
        {
          id: 'createdAt',
          header: 'Created Date',
          accessorKey: 'createdAt',
          render: (row) => formatDate(row?.createdAt),
        },
        {
          id: 'updatedAt',
          header: 'Updated Date',
          accessorKey: 'updatedAt',
          render: (row) => formatDate(row?.updatedAt),
        },
        {
          id: 'status',
          header: 'Status',
          accessorKey: 'status',
          render: (row) => (
            <ToggleSwitch
              name={`status-${row.id}`}
              checked={row.status === 'ACTIVE'}
              showLabel={false}
              onChangeCb={() =>
                dispatch(
                  subOrgRolesActions.updateRoleStatus({
                    roleId: row.id,
                    status: row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
                    // subOrgId: subOrgId,
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
                onClickCb: () =>
                  navigate(
                    `/sub-organizations/${subOrgId}/roles-permissions/${row.id}/view${qs}`,
                  ),
              },
              {
                label: 'Edit',
                value: 'edit',
                onClickCb: () =>
                  navigate(
                    `/sub-organizations/${subOrgId}/roles-permissions/${row.id}/edit${qs}`,
                  ),
              },
            ];

            if (showArchive) {
              options.push({
                label: 'Unarchive',
                value: 'unarchive',
                onClickCb: () =>
                  dispatch(
                    subOrgRolesActions.archiveRole({
                      roleId: row.id,
                      isArchived: true,
                      subOrgId: subOrgId,
                    }),
                  ),
              });
            } else {
              options.push({
                label: 'Archive',
                value: 'archive',
                onClickCb: () =>
                  dispatch(
                    subOrgRolesActions.archiveRole({
                      roleId: row.id,
                      isArchived: false,
                      subOrgId: subOrgId,
                    }),
                  ),
              });
            }

            return <ActionDropdown options={options} />;
          },
        },
      ]),
    [navigate, dispatch, showArchive, subOrgId, qs],
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
        totalRecords={totalRecords ?? 0}
        totalPages={totalPages}
        currentPage={page}
        currentLimit={limit}
        onPageChange={setPage}
        onLimitChange={(val) => {
          setLimit(val);
          setPage(1);
        }}
      />

      <CreateRoleModal open={createRoleModalOpen} subOrgId={subOrgId} />
    </div>
  );
}
