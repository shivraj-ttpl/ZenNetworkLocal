import useRoleAccess from '@/hooks/useRoleAccess';

export default function RoleGuard({ allowedRoles, children, fallback = null }) {
  const hasAccess = useRoleAccess(allowedRoles);
  return hasAccess ? children : fallback;
}
