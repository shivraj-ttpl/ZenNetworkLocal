import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import Button from '@/components/commonComponents/button/Button';
import { buildColumns, Table } from '@/components/commonComponents/table';
import ToolTip from '@/components/commonComponents/toolTip/ToolTip';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useLoadingKey } from '@/hooks/useLoadingKey';

import CreateRoleModal from './Components/CreateRoleModal';
import { subOrgRolesActions } from './subOrgRolesPermissionsSaga';
import {
  componentKey,
  setOpenCreateRoleModal,
} from './subOrgRolesPermissionsSlice';

export default function SubOrgViewRolePermissions() {
  const { setToolbar } = useOutletContext();
  const { subOrgId, roleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const nameParam = searchParams.get('name') || '';
  const qs = nameParam ? `?name=${encodeURIComponent(nameParam)}` : '';

  const basePath = `/sub-organizations/${subOrgId}`;
  const state = useSelector((s) => s[componentKey]);
  const { createRoleModalOpen, roleDetail } = state || {};
  const isLoading = useLoadingKey(LOADING_KEYS.SUB_ORG_ROLES_GET_BY_ID);

  useEffect(() => {
    if (roleId) {
      dispatch(subOrgRolesActions.fetchRoleById({ roleId }));
    }
  }, [dispatch, roleId]);

  useEffect(() => {
    setToolbar(
      <Button
        variant="primaryBlue"
        size="sm"
        onClick={() => dispatch(setOpenCreateRoleModal())}
      >
        <Icon name="Plus" size={14} />
        Create Role
      </Button>,
    );
    return () => setToolbar(null);
  }, [setToolbar, dispatch]);

  const tableData = useMemo(
    () =>
      (roleDetail?.permissions ?? []).map((item, i) => ({
        ...item,
        srNo: String(i + 1).padStart(2, '0'),
        noAccess: item?.noAccess,
      })),
    [roleDetail],
  );

  const columns = useMemo(
    () =>
      buildColumns([
        { id: 'srNo', header: 'Sr. No', accessorKey: 'srNo', width: 60 },
        { id: 'module', header: 'Module', accessorKey: 'module' },
        {
          id: 'feature',
          header: 'Feature',
          accessorKey: 'feature',
          render: (row) => (
            <span className="inline-flex items-center gap-1.5">
              {row.feature}
              <ToolTip
                position="bottom"
                usePortal
                content={
                  <p className="text-sm text-text-secondary p-3 w-84">
                    {`Enable users to view ${row?.feature} read/unread status and preferences, and dismiss or archive ${row?.feature}`}
                  </p>
                }
              >
                <Icon
                  name="CircleHelp"
                  size={14}
                  className="text-neutral-400 cursor-pointer"
                />
              </ToolTip>
            </span>
          ),
        },
        {
          id: 'view',
          headerRender: (
            <span className="inline-flex items-center gap-1.5">
              View
              <ToolTip
                position="bottom"
                usePortal
                content={
                  <p className="text-sm text-text-secondary p-3 w-72">
                    Allows users to view and access this module or feature
                  </p>
                }
              >
                <Icon
                  name="CircleHelp"
                  size={14}
                  className="text-neutral-400 cursor-pointer"
                />
              </ToolTip>
            </span>
          ),
          render: (row) =>
            row.view ? (
              <Icon name="Check" size={16} className="text-primary-700" />
            ) : (
              <Icon name="X" size={16} className="text-error-500" />
            ),
        },
        {
          id: 'create',
          headerRender: (
            <span className="inline-flex items-center gap-1.5">
              Create
              <ToolTip
                position="bottom"
                usePortal
                content={
                  <p className="text-sm text-text-secondary p-3 w-72">
                    Allows users to add new entries and make changes within this
                    module or feature.
                  </p>
                }
              >
                <Icon
                  name="CircleHelp"
                  size={14}
                  className="text-neutral-400 cursor-pointer"
                />
              </ToolTip>
            </span>
          ),
          render: (row) =>
            row.create ? (
              <Icon name="Check" size={16} className="text-primary-700" />
            ) : (
              <Icon name="X" size={16} className="text-error-500" />
            ),
        },
        {
          id: 'noAccess',
          headerRender: (
            <span className="inline-flex items-center gap-1.5">
              No Access
              <ToolTip
                position="bottom"
                usePortal
                content={
                  <p className="text-sm text-text-secondary p-3 w-72">
                    Restricts users from viewing or interacting with this module
                    or feature.
                  </p>
                }
              >
                <Icon
                  name="CircleHelp"
                  size={14}
                  className="text-neutral-400 cursor-pointer"
                />
              </ToolTip>
            </span>
          ),
          render: (row) =>
            row.noAccess ? (
              <Icon name="Check" size={16} className="text-primary-700" />
            ) : (
              <Icon name="X" size={16} className="text-error-500" />
            ),
        },
      ]),
    [],
  );

  return (
    <div className="px-5 pb-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(`${basePath}/roles-permissions${qs}`)}
          className="flex items-center gap-1.5 text-sm font-medium text-text-primary hover:text-primary-700 cursor-pointer"
        >
          <Icon name="ArrowLeft" size={16} />
          View Role & Permissions
        </button>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center bg-[#EBEBEB] border border-border-light rounded-lg px-4 py-2 text-sm gap-3">
            <div className="flex items-center gap-1">
              <span className="text-text-secondary">Role Name:</span>
              <span className="text-text-primary font-medium">
                {roleDetail?.name || '—'}
              </span>
            </div>
            <div className="h-4 w-px bg-border-light" />
            <div className="flex items-center gap-1">
              <span className="text-text-secondary">Role Type:</span>
              <span className="text-text-primary font-medium capitalize">
                {roleDetail?.roleType || '—'}
              </span>
            </div>
          </div>
          <Button
            variant="outlineBlue"
            size="sm"
            onClick={() =>
              navigate(`${basePath}/roles-permissions/${roleId}/edit${qs}`)
            }
          >
            <Icon name="Pencil" size={14} />
            Edit Permission
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        data={tableData}
        size="sm"
        maxHeight="calc(100vh - 280px)"
        loading={isLoading}
      />

      <CreateRoleModal open={createRoleModalOpen} subOrgId={subOrgId} />
    </div>
  );
}
