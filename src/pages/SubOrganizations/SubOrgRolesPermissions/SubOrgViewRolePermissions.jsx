import { useEffect, useMemo } from 'react';
import {
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import Button from '@/components/commonComponents/button/Button';
import { buildColumns, Table } from '@/components/commonComponents/table';
import Icon from '@/components/icons/Icon';
import { permissionsData, rolesData } from '@/data/settingsData';

export default function SubOrgViewRolePermissions() {
  const { setToolbar } = useOutletContext();
  const { subOrgId, roleId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nameParam = searchParams.get('name') || '';
  const qs = nameParam ? `?name=${encodeURIComponent(nameParam)}` : '';

  const basePath = `/sub-organizations/${subOrgId}`;

  const role = useMemo(
    () => rolesData.find((r) => r.id === roleId),
    [roleId],
  );

  useEffect(() => {
    setToolbar(null);
    return () => setToolbar(null);
  }, [setToolbar]);

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
              <Icon
                name="CircleHelp"
                size={14}
                className="text-neutral-400"
              />
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
          onClick={() => navigate(`${basePath}/roles-permissions${qs}`)}
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
      />
    </div>
  );
}
