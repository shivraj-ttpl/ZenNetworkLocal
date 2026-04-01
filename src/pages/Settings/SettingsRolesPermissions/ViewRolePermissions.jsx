import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import Button from '@/components/commonComponents/button/Button';
import { buildColumns, Table } from '@/components/commonComponents/table';
import Icon from '@/components/icons/Icon';

import {
  componentKey,
  setOpenCreateRoleModal,
} from './settingsRolesPermissionsSlice';
import './settingsRolesPermissionsSaga';
import { settingsRolesActions } from './settingsRolesPermissionsSaga';

import CreateRoleModal from './Components/CreateRoleModal';

export default function ViewRolePermissions() {
  const { setToolbar } = useOutletContext();
  const { roleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((s) => s[componentKey]);

  const { createRoleModalOpen, roleDetail } = state || {};

  useEffect(() => {
    if (roleId) {
      dispatch(settingsRolesActions.fetchRoleById({ roleId }));
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
              <Icon name="CircleHelp" size={14} className="text-neutral-400" />
            </span>
          ),
        },
        {
          id: 'view',
          header: 'View',
          render: (row) =>
            row.view ? (
              <Icon name="Check" size={16} className="text-primary-700" />
            ) : (
              <Icon name="X" size={16} className="text-error-500" />
            ),
        },
        {
          id: 'create',
          header: 'Create',
          render: (row) =>
            row.create ? (
              <Icon name="Check" size={16} className="text-primary-700" />
            ) : (
              <Icon name="X" size={16} className="text-error-500" />
            ),
        },
        {
          id: 'noAccess',
          header: 'No Access',
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
          onClick={() => navigate('/settings/roles-permissions')}
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
              navigate(`/settings/roles-permissions/${roleId}/edit`)
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
      />

      <CreateRoleModal open={createRoleModalOpen} />
    </div>
  );
}
