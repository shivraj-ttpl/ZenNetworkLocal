import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import Button from '@/components/commonComponents/button/Button';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import { buildColumns, Table } from '@/components/commonComponents/table';
import ToolTip from '@/components/commonComponents/toolTip/ToolTip';
import Icon from '@/components/icons/Icon';
import { useTableHeight } from '@/hooks/useTableHeight';

import ConfirmUpdatePermissionsModal from './Components/ConfirmUpdatePermissionsModal';
import CreateRoleModal from './Components/CreateRoleModal';
import { subOrgRolesActions } from './subOrgRolesPermissionsSaga';
import {
  componentKey,
  setOpenCreateRoleModal,
} from './subOrgRolesPermissionsSlice';

const renderChangeCell = (value) => {
  if (value === 'No Change')
    return <span className="text-neutral-400">No Change</span>;
  if (value)
    return <Icon name="Check" size={16} className="text-primary-700" />;
  return <Icon name="X" size={16} className="text-error-500" />;
};

function ChangesTooltip({ changes, roleName }) {
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

  const tooltipContent = (
    <>
      <div className="px-5 pt-4 pb-3 border-b border-border-light">
        <p className="text-xs text-neutral-500">Role Name:</p>
        <p className="text-base font-semibold text-text-primary">{roleName}</p>
      </div>

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
    </>
  );

  return (
    <ToolTip
      content={tooltipContent}
      position="bottom-end"
      contentClassName="w-130 min-w-130"
    >
      <span className="border border-border-light rounded-lg px-3 py-1.5 text-sm flex items-center gap-1.5 cursor-pointer">
        {changes.length} Changes
        <Icon name="CircleHelp" size={14} className="text-neutral-400" />
      </span>
    </ToolTip>
  );
}

export default function SubOrgEditRolePermissions() {
  const { setToolbar } = useOutletContext();
  const { subOrgId, roleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const nameParam = searchParams.get('name') || '';
  const qs = nameParam ? `?name=${encodeURIComponent(nameParam)}` : '';

  const tableRef = useRef(null);
  const tableMaxHeight = useTableHeight(tableRef);
  const basePath = `/sub-organizations/${subOrgId}`;
  const state = useSelector((s) => s[componentKey]);
  const { createRoleModalOpen, roleDetail } = state || {};

  useEffect(() => {
    if (roleId) {
      dispatch(subOrgRolesActions.fetchRoleById({ roleId }));
    }
  }, [dispatch, roleId]);

  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (roleDetail?.permissions) {
      setPermissions(
        roleDetail.permissions.map((row) => ({
          ...row,
          noAccess: !row.view && !row.create,
        })),
      );
    }
  }, [roleDetail]);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const handleSavePermissions = () => {
    setConfirmModalOpen(false);
    dispatch(
      subOrgRolesActions.updateRolePermissions({
        roleId,
        payload: {
          name: roleDetail?.name,
          roleType: roleDetail?.roleType,
          permissions: permissions.map((p) => ({
            permissionId: p.permissionId,
            view: p.view,
            create: p.create,
            noAccess: p.noAccess,
          })),
        },
        onSuccess: () =>
          navigate(`${basePath}/roles-permissions/${roleId}/view${qs}`),
      }),
    );
  };

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const originalPermissions = roleDetail?.permissions ?? [];

  const changes = useMemo(() => {
    const changed = [];
    permissions.forEach((row, idx) => {
      const original = originalPermissions[idx];
      if (!original) return;
      const origNoAccess = !original.view && !original.create;
      if (
        row.view !== original.view ||
        row.create !== original.create ||
        row.noAccess !== origNoAccess
      ) {
        changed.push({
          srNo: idx + 1,
          module: row.module,
          feature: row.feature,
          view: row.view !== original.view ? row.view : 'No Change',
          create: row.create !== original.create ? row.create : 'No Change',
          noAccess: row.noAccess !== origNoAccess ? row.noAccess : 'No Change',
        });
      }
    });
    return changed;
  }, [permissions, originalPermissions]);

  const handleToggle = useCallback((index, field) => {
    setPermissions((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        const updated = { ...row, [field]: !row[field] };

        if (field === 'create' && updated.create) {
          updated.view = true;
          updated.noAccess = false;
        } else if (field === 'view' && updated.view) {
          updated.noAccess = false;
        } else if (field === 'view' && !updated.view) {
          updated.create = false;
          updated.noAccess = true;
        } else if (field === 'noAccess' && updated.noAccess) {
          updated.view = false;
          updated.create = false;
        } else if (field === 'noAccess' && !updated.noAccess) {
          if (!updated.view && !updated.create) {
            updated.view = true;
          }
        }

        return updated;
      }),
    );
  }, []);

  const handleToggleAll = useCallback(
    (field) => {
      const allChecked = permissions.every((row) => row[field]);
      const newValue = !allChecked;
      setPermissions((prev) =>
        prev.map((row) => {
          const updated = { ...row, [field]: newValue };

          if (field === 'create' && newValue) {
            updated.view = true;
            updated.noAccess = false;
          } else if (field === 'view' && newValue) {
            updated.noAccess = false;
          } else if (field === 'view' && !newValue) {
            updated.create = false;
            updated.noAccess = true;
          } else if (field === 'noAccess' && newValue) {
            updated.view = false;
            updated.create = false;
          } else if (field === 'noAccess' && !newValue) {
            if (!updated.view && !updated.create) {
              updated.view = true;
            }
          }

          return updated;
        }),
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
            <span className="inline-flex items-center gap-2">
              <Checkbox
                checked={isAllChecked('view')}
                indeterminate={isSomeChecked('view')}
                onChange={() => handleToggleAll('view')}
                variant="blue"
                size="sm"
              />
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
    <div className="px-5 pb-4" ref={tableRef}>
      <div className="flex items-center justify-between mb-4 max-[1149px]:flex-wrap max-[1149px]:gap-3">
        <button
          onClick={() =>
            navigate(`${basePath}/roles-permissions/${roleId}/view${qs}`)
          }
          className="flex items-center gap-1.5 text-sm font-medium text-text-primary hover:text-primary-700 cursor-pointer"
        >
          <Icon name="ArrowLeft" size={16} />
          Edit Permissions
        </button>
        <div className="flex items-center gap-3 max-[1149px]:flex-wrap">
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
          <ChangesTooltip
            changes={changes}
            roleName={roleDetail?.name || '—'}
          />
          <Button
            variant="outlineBlue"
            size="sm"
            onClick={() =>
              navigate(`${basePath}/roles-permissions/${roleId}/view${qs}`)
            }
          >
            Cancel
          </Button>
          <Button
            variant="primaryBlue"
            size="sm"
            onClick={() => setConfirmModalOpen(true)}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        data={tableData}
        size="sm"
        maxHeight={tableMaxHeight}
      />

      <CreateRoleModal open={createRoleModalOpen} subOrgId={subOrgId} />
      <ConfirmUpdatePermissionsModal
        open={confirmModalOpen}
        onCancel={() => setConfirmModalOpen(false)}
        onConfirm={handleSavePermissions}
      />
    </div>
  );
}
