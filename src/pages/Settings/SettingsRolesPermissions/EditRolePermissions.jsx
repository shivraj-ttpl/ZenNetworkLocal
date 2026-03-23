import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import Button from '@/components/commonComponents/button/Button';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import { buildColumns, Table } from '@/components/commonComponents/table';
import Icon from '@/components/icons/Icon';
import { permissionsData, rolesData } from '@/data/settingsData';

function ChangesTooltip({ changes }) {
  const [visible, setVisible] = useState(false);

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
        <div className="absolute right-0 top-full mt-2 z-50 w-[520px]">
          <div className="relative bg-surface border border-border-light rounded-xl shadow-lg p-4">
            <div className="absolute -top-2 right-6 w-4 h-4 bg-surface border-l border-t border-border-light rotate-45" />

            {changes.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-neutral-500 py-2">
                <Icon name="Info" size={14} className="text-neutral-400" />
                No changes made
              </div>
            ) : (
              <div className="overflow-auto max-h-60">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-neutral-500 border-b border-border-light">
                      <th className="pb-2 pr-3 font-medium">Sr. No</th>
                      <th className="pb-2 pr-3 font-medium">Module</th>
                      <th className="pb-2 pr-3 font-medium">Feature</th>
                      <th className="pb-2 pr-3 font-medium">View</th>
                      <th className="pb-2 pr-3 font-medium">Create</th>
                      <th className="pb-2 font-medium">No Access</th>
                    </tr>
                  </thead>
                  <tbody>
                    {changes.map((row) => (
                      <tr
                        key={row.srNo}
                        className="border-b border-border-light last:border-0"
                      >
                        <td className="py-2 pr-3">
                          {String(row.srNo).padStart(2, '0')}
                        </td>
                        <td className="py-2 pr-3">{row.module}</td>
                        <td className="py-2 pr-3">{row.feature}</td>
                        <td className="py-2 pr-3">
                          {row.view === 'No Change' ? (
                            <span className="text-neutral-400">—</span>
                          ) : row.view ? (
                            <span className="text-success-500">&#10003;</span>
                          ) : (
                            <span className="text-error-500">&#10007;</span>
                          )}
                        </td>
                        <td className="py-2 pr-3">
                          {row.create === 'No Change' ? (
                            <span className="text-neutral-400">—</span>
                          ) : row.create ? (
                            <span className="text-success-500">&#10003;</span>
                          ) : (
                            <span className="text-error-500">&#10007;</span>
                          )}
                        </td>
                        <td className="py-2">
                          {row.noAccess === 'No Change' ? (
                            <span className="text-neutral-400">—</span>
                          ) : row.noAccess ? (
                            <span className="text-success-500">&#10003;</span>
                          ) : (
                            <span className="text-error-500">&#10007;</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

  const role = useMemo(() => rolesData.find((r) => r.id === roleId), [roleId]);

  const [permissions, setPermissions] = useState(() =>
    permissionsData.map((row) => ({ ...row })),
  );

  useEffect(() => {
    setToolbar(
      <Button
        variant="primaryTeal"
        size="sm"
        onClick={() => navigate('/settings/roles-permissions/create')}
      >
        <Icon name="Plus" size={14} />+ Create Role
      </Button>,
    );
    return () => setToolbar(null);
  }, [setToolbar, navigate]);

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
                variant="teal"
                size="sm"
              />
              View
            </span>
          ),
          render: (row) => (
            <Checkbox
              checked={row.view}
              onChange={() => handleToggle(row._index, 'view')}
              variant="teal"
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
                variant="teal"
                size="sm"
              />
              Create
            </span>
          ),
          render: (row) => (
            <Checkbox
              checked={row.create}
              onChange={() => handleToggle(row._index, 'create')}
              variant="teal"
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
                variant="teal"
                size="sm"
              />
              No Access
            </span>
          ),
          render: (row) => (
            <Checkbox
              checked={row.noAccess}
              onChange={() => handleToggle(row._index, 'noAccess')}
              variant="teal"
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
          <ChangesTooltip changes={changes} />
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate(`/settings/roles-permissions/${roleId}/view`)
            }
          >
            Cancel
          </Button>
          <Button variant="primaryTeal" size="sm">
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
    </div>
  );
}
