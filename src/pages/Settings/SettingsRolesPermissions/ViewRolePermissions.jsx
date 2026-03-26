import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import Button from '@/components/commonComponents/button/Button';
import { buildColumns, Table } from '@/components/commonComponents/table';
import Icon from '@/components/icons/Icon';
import { permissionsData, rolesData } from '@/data/settingsData';

import {
  componentKey,
  setOpenCreateRoleModal,
} from './settingsRolesPermissionsSlice';
import './settingsRolesPermissionsSaga';

import CreateRoleModal from './Components/CreateRoleModal';

export default function ViewRolePermissions() {
  const { setToolbar } = useOutletContext();
  const { roleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((s) => s[componentKey]);

  const { createRoleModalOpen } = state || {};

  const role = useMemo(() => rolesData.find((r) => r.id === roleId), [roleId]);

  useEffect(() => {
    setToolbar(
      <Button
        variant="primaryBlue"
        size="sm"
        onClick={() => dispatch(setOpenCreateRoleModal())}
      >
        <Icon name="Plus" size={14} />Create Role
      </Button>,
    );
    return () => setToolbar(null);
  }, [setToolbar, dispatch]);

  const tableData = useMemo(
    () =>
      permissionsData.map((item, i) => ({
        ...item,
        srNo: String(i + 1).padStart(2, '0'),
      })),
    [],
  );

  const columns = useMemo(
    () =>
      buildColumns([
        { id: 'srNo', header: 'Sr. No', accessorKey: 'srNo', width: 60 },
        { id: 'module', header: 'Module', accessorKey: 'module' },
        { id: 'subModule', header: 'Sub-Module', accessorKey: 'subModule' },
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
              <span className="text-success-500 font-medium">&#10003;</span>
            ) : (
              <span className="text-error-500 font-medium">&#10007;</span>
            ),
        },
        {
          id: 'create',
          header: 'Create',
          render: (row) =>
            row.create ? (
              <span className="text-success-500 font-medium">&#10003;</span>
            ) : (
              <span className="text-error-500 font-medium">&#10007;</span>
            ),
        },
        {
          id: 'noAccess',
          header: 'No Access',
          render: (row) =>
            row.noAccess ? (
              <span className="text-success-500 font-medium">&#10003;</span>
            ) : (
              <span className="text-error-500 font-medium">&#10007;</span>
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
          <span className="border border-border-light rounded-lg px-3 py-1.5 text-sm">
            Role Name:{' '}
            <strong>{role?.roleName || 'Primary Care Provider'}</strong>
          </span>
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
