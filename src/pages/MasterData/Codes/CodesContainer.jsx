import { useState, useMemo, useEffect } from "react";
import { NavLink, Outlet, useLocation, Navigate, useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import Checkbox from "@/components/commonComponents/checkbox/Checkbox";
import Button from "@/components/commonComponents/button/Button";
import Icon from "@/components/icons/Icon";
import { setOpenAddDrawer } from "./codesSlice";
import AddCodeDrawer from "../Components/AddCodeDrawer";
import { PATH_TO_LABEL } from "./constant";

const TABS = [
  { label: "ICD Code", path: "/master-data/codes", end: true },
  { label: "CPT Code", path: "/master-data/codes/cpt" },
  { label: "LONIC Code", path: "/master-data/codes/lonic" },
  { label: "SNOMED CT Code", path: "/master-data/codes/snomed-ct" },
  { label: "HCPCS Code", path: "/master-data/codes/hcpcs" },
];

function getCodeLabel(pathname) {
  const match = Object.entries(PATH_TO_LABEL).find(([path]) => pathname === path);
  return match ? match[1] : "ICD";
}

export default function CodesContainer() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { setToolbar } = useOutletContext();
  const [showArchive, setShowArchive] = useState(false);
  const [search, setSearch] = useState("");
  // useFlexCleanup(componentKey);

  const codeLabel = useMemo(() => getCodeLabel(location.pathname), [location.pathname]);
  useEffect(() => {
    setToolbar(
      <>
        <Button variant="outlineTeal" size="sm">
          <Icon name="Plus" size={14} />
          Import {codeLabel} Codes
        </Button>
        <Button variant="primaryTeal" size="sm" onClick={() => dispatch(setOpenAddDrawer(codeLabel))}>
          <Icon name="Plus" size={14} />
          Add {codeLabel} Code
        </Button>
      </>
    );
    return () => setToolbar(null);
  }, [setToolbar, codeLabel, dispatch]);

  if (location.pathname === "/master-data/codes/") {
    return <Navigate to="/master-data/codes" replace />;
  }

  return (
    <div className="px-5 pb-4 space-y-3">
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-6">
          {TABS.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.end}
              className={({ isActive }) =>
                `pb-2 text-xs font-normal border-b-2 transition-colors ${
                  isActive
                    ? "text-primary-700 border-primary"
                    : "text-neutral-400 border-transparent hover:text-neutral-600"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Checkbox
            label="Show Archive"
            checked={showArchive}
            onChange={() => setShowArchive((prev) => !prev)}
            variant="teal"
            size="sm"
          />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-65">
            <Icon name="Search" size={14} className="text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search by ${codeLabel} Code or Description`}
              className="w-full bg-transparent text-sm outline-none text-neutral-800 placeholder-text-placeholder"
            />
          </div>
        </div>
      </div>

      <Outlet context={{ showArchive, search, codeLabel }} />

      <AddCodeDrawer />
    </div>
  );
}
