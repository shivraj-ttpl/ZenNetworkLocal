import { useDispatch } from "react-redux";
import ModalComponent from "@/components/commonComponents/modal/ModalComponent";
import Avatar from "@/components/commonComponents/avatar/Avatar";
import { setCloseViewModal } from "../providerGroupUsersSlice";

const USER_DETAILS = {
  1: {
    fullName: "Alexa Stuart",
    role: "Care Manager",
    contact: "+1 800-555-0199",
    email: "alexastuart@gmail.com",
    address: "1428 Meadowbrook Lane, Suite 205, Dallas Texas, United States, 75201",
  },
};

const getUserProfile = (user) => {
  const details = USER_DETAILS[user?.id] || {};
  return {
    fullName: details.fullName || user?.name || "—",
    role: details.role || user?.role || "—",
    contact: details.contact || user?.contact || "—",
    email: details.email || user?.email || "—",
    address: details.address || "—",
    status: user?.status || "Active",
  };
};

export default function ViewUserModal({ open, viewData }) {
  const dispatch = useDispatch();
  const profile = getUserProfile(viewData);

  const handleClose = () => {
    dispatch(setCloseViewModal());
  };

  const infoRows = [
    { label: "Full Name", value: profile.fullName },
    { label: "Role", value: profile.role },
    { label: "Contact", value: profile.contact },
    { label: "Email Address", value: profile.email, isLink: true },
    { label: "Address", value: profile.address },
  ];

  const title = (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm sm:text-base font-medium">
        {viewData?.name || "Users Profile"}
      </span>
      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-[#287F7C] bg-neutral-100">
        <span className="w-1.5 h-1.5 rounded-full bg-[#287F7C]" />
        {profile.status}
      </span>
    </div>
  );

  return (
    <ModalComponent
      title={title}
      open={open}
      close={handleClose}
      customClasses="w-[95%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[30%] max-w-[600px]"
      maxChildrenHeight="max-h-[70vh] md:max-h-[80vh]"
    >
      <div className="flex flex-col md:flex-row gap-5">
        {/* Avatar */}
        <div className="flex-shrink-0 flex justify-center md:block">
          <Avatar
            name={viewData?.name || ""}
            size="6xl"
            variant="square"
          />
        </div>

        <div className="flex-1 flex flex-col gap-2.5">
          {infoRows.map((item) => (
            <div key={item.label} className="flex items-start gap-2 text-sm py-0.5">
              <span className="text-neutral-500 min-w-[120px] sm:min-w-[130px] shrink-0">
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
