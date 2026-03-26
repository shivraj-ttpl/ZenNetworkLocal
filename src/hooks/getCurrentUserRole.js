import { useSelector } from "react-redux";
import { componentKey } from "../pages/Auth/authSlice";

const useCurrentUserRole = () => {
  const { currentUserRole = "" } = useSelector(
    (state) => state[componentKey]
  );

  const isOrgAdmin = currentUserRole === "ORG_ADMIN";

  return { isOrgAdmin, currentUserRole };
};

export default useCurrentUserRole;