import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import Button from '@/components/commonComponents/button/Button';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import { buildColumns, Table } from '@/components/commonComponents/table';
import Icon from '@/components/icons/Icon';
import { permissionsData, rolesData } from '@/data/settingsData';

import {
  componentKey,
  setOpenCreateRoleModal,
} from './settingsRolesPermissionsSlice';
import './settingsRolesPermissionsSaga';

import CreateRoleModal from './Components/CreateRoleModal';

const renderChangeCell = (value) => {
  if (value === 'No Change') return <span className="text-neutral-400">No Change</span>;
  if (value) return <Icon name="Check" size={16} className="text-primary-700" />;
  return <Icon name="X" size={16} className="text-error-500" />;
};

function ChangesTooltip({ changes, roleName }) {
  const [visible, setVisible] = useState(false);

  const changeTableData = useMemo(
    () =>
      changes.map((row, i) => ({
        ...row,
        srNo: String(row.srNo ?? i + 1).padStart(2, '0'),
      })),
    [changes],
  );

  const changeColumns = useMemo(
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
          render: (row) => renderChangeCell(row.view),
        },
        {
          id: 'create',
          header: 'Create',
          render: (row) => renderChangeCell(row.create),
        },
        {
          id: 'noAccess',
          header: 'No Access',
          render: (row) => renderChangeCell(row.noAccess),
        },
      ]),
    [],
  );

  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span className="border border-border-light rounded-lg px-3 py-1.5 text-sm flex items-center gap-1.5 cursor-pointer">
        {changes.length} Changes
        <Icon name="CircleHelp" size={14} className="text-neutral-400" />
      </span>

      {visible && (
        <div className="absolute right-0 top-full mt-2 z-50 w-130 min-w-130">
          <div className="relative bg-surface border border-border-light rounded-xl shadow-lg overflow-hidden">
            {/* Arrow */}
            <div className="absolute -top-2 right-6 w-4 h-4 bg-surface border-l border-t border-border-light rotate-45" />

            {/* Role Name Header */}
            <div className="px-5 pt-4 pb-3 border-b border-border-light">
              <p className="text-xs text-neutral-500">Role Name:</p>
              <p className="text-base font-semibold text-text-primary">
                {roleName}
              </p>
            </div>

            {/* Content */}
            {changes.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 px-6 bg-neutral-50">
                <Icon name="Info" size={28} className="text-neutral-400" />
                <p className="text-sm text-neutral-500">No changes made</p>
              </div>
            ) : (
              <div className="max-h-75 overflow-auto">
                <Table
                  columns={changeColumns}
                  data={changeTableData}
                  size="sm"
                  maxHeight="300px"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EditRolePermissions() {
  const { setToolbar } = useOutletContext();
  const { roleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((s) => s[componentKey]);

  const { createRoleModalOpen } = state || {};

  const role = useMemo(() => rolesData.find((r) => r.id === roleId), [roleId]);

  const [permissions, setPermissions] = useState(() =>
    permissionsData.map((row) => ({ ...row })),
  );

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

  const changes = useMemo(() => {
    const changed = [];
    permissions.forEach((row, idx) => {
      const original = permissionsData[idx];
      if (
        row.view !== original.view ||
        row.create !== original.create ||
        row.noAccess !== original.noAccess
      ) {
        changed.push({
          srNo: row.srNo,
          module: row.module,
          subModule: row.subModule,
          feature: row.feature,
          view: row.view !== original.view ? row.view : 'No Change',
          create: row.create !== original.create ? row.create : 'No Change',
          noAccess:
            row.noAccess !== original.noAccess ? row.noAccess : 'No Change',
        });
      }
    });
    return changed;
  }, [permissions]);

  const handleToggle = useCallback((index, field) => {
    setPermissions((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, [field]: !row[field] } : row,
      ),
    );
  }, []);

  const handleToggleAll = useCallback(
    (field) => {
      const allChecked = permissions.every((row) => row[field]);
      setPermissions((prev) =>
        prev.map((row) => ({ ...row, [field]: !allChecked })),
      );
    },
    [permissions],
  );

  const isAllChecked = useCallback(
    (field) => permissions.every((row) => row[field]),
    [permissions],
  );

  const isSomeChecked = useCallback(
    (field) =>
      permissions.some((row) => row[field]) &&
      !permissions.every((row) => row[field]),
    [permissions],
  );

  const tableData = useMemo(
    () =>
      permissions.map((item, i) => ({
        ...item,
        _index: i,
        srNo: String(i + 1).padStart(2, '0'),
      })),
    [permissions],
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
          headerRender: (
            <span className="inline-flex items-center gap-2">
              <Checkbox
                checked={isAllChecked('view')}
                indeterminate={isSomeChecked('view')}
                onChange={() => handleToggleAll('view')}
                variant="blue"
                size="sm"
              />
              View
            </span>
          ),
          render: (row) => (
            <Checkbox
              checked={row.view}
              onChange={() => handleToggle(row._index, 'view')}
              variant="blue"
            />
          ),
        },
        {
          id: 'create',
          headerRender: (
            <span className="inline-flex items-center gap-2">
              <Checkbox
                checked={isAllChecked('create')}
                indeterminate={isSomeChecked('create')}
                onChange={() => handleToggleAll('create')}
                variant="blue"
                size="sm"
              />
              Create
            </span>
          ),
          render: (row) => (
            <Checkbox
              checked={row.create}
              onChange={() => handleToggle(row._index, 'create')}
              variant="blue"
            />
          ),
        },
        {
          id: 'noAccess',
          headerRender: (
            <span className="inline-flex items-center gap-2">
              <Checkbox
                checked={isAllChecked('noAccess')}
                indeterminate={isSomeChecked('noAccess')}
                onChange={() => handleToggleAll('noAccess')}
                variant="blue"
                size="sm"
              />
              No Access
            </span>
          ),
          render: (row) => (
            <Checkbox
              checked={row.noAccess}
              onChange={() => handleToggle(row._index, 'noAccess')}
              variant="blue"
            />
          ),
        },
      ]),
    [handleToggle, handleToggleAll, isAllChecked, isSomeChecked],
  );

  return (
    <div className="px-5 pb-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(`/settings/roles-permissions/${roleId}/view`)}
          className="flex items-center gap-1.5 text-sm font-medium text-text-primary hover:text-primary-700 cursor-pointer"
        >
          <Icon name="ArrowLeft" size={16} />
          Edit Permissions
        </button>
        <div className="flex items-center gap-3">
          <span className="border border-border-light rounded-lg px-3 py-1.5 text-sm">
            Role Name:{' '}
            <strong>{role?.roleName || 'Primary Care Provider'}</strong>
          </span>
          <ChangesTooltip changes={changes} roleName={role?.roleName || 'Primary Care Provider'} />
          <Button
            variant="outlineBlue"
            size="sm"
            onClick={() =>
              navigate(`/settings/roles-permissions/${roleId}/view`)
            }
          >
            Cancel
          </Button>
          <Button variant="primaryBlue" size="sm">
            Save Changes
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
