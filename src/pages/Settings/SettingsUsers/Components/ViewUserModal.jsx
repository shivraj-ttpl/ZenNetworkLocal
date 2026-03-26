import { useDispatch } from "react-redux";
import ModalComponent from "@/components/commonComponents/modal/ModalComponent";
import Avatar from "@/components/commonComponents/avatar/Avatar";
import { setCloseViewModal } from "../settingsUsersSlice";

const getUserProfile = (user) => ({
  fullName: user?.name || "—",
  contact: user?.contact || user?.contactNumber || "—",
  subOrganization: user?.subOrganizations || "—",
  email: user?.email || "—",
  address: user?.address || "—",
});

export default function ViewUserModal({ open, viewData }) {
  const dispatch = useDispatch();
  const profile = getUserProfile(viewData);

  const handleClose = () => dispatch(setCloseViewModal());

  const infoRows = [
    { label: "Full Name", value: profile.fullName },
    { label: "Contact", value: profile.contact },
    { label: "Sub-Organization", value: profile.subOrganization },
    { label: "Email Address", value: profile.email, isLink: true },
    { label: "Address", value: profile.address },
  ];

  return (
    <ModalComponent
      title="User Details"
      open={open}
      close={handleClose}
      customClasses="w-[95%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[30%] max-w-[600px]"
      maxChildrenHeight="max-h-[70vh] md:max-h-[80vh]"
    >
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-shrink-0 flex justify-center md:block">
          <Avatar
            name={viewData?.name || ""}
            size="6xl"
            variant="square"
          />
        </div>

        <div className="flex-1 flex flex-col gap-2.5">
          {infoRows.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-2 text-sm py-0.5"
            >
              <span className="text-neutral-500 min-w-[130px] shrink-0">
                {item.label}
              </span>
              <span className="text-neutral-400">:</span>
              {item.isLink ? (
                <a
                  href={`mailto:${item.value}`}
                  className="text-primary-700 hover:underline break-all"
                >
                  {item.value}
                </a>
              ) : (
                <span className="text-text-primary break-words">
                  {item.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </ModalComponent>
  );
}
