import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { componentKey } from '@/pages/Auth/authSlice';

const useSubOrgTenantName = () => {
  const { subOrgId } = useParams();
  const { loggedInUser } = useSelector((state) => state[componentKey] ?? {});

  const tenantName =
    loggedInUser?.subOrganizations?.find(
      (sub) => String(sub.id) === String(subOrgId),
    )?.schemaName ?? null;

  return tenantName;
};

export default useSubOrgTenantName;
