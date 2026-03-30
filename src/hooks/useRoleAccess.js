import useCurrentUserRole from './getCurrentUserRole';

const useRoleAccess = (allowedRoles) => {
  const { currentUserRole } = useCurrentUserRole();
  return allowedRoles.includes(currentUserRole);
};

export default useRoleAccess;
