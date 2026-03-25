import { useDispatch } from "react-redux";
import ModalComponent from "@/components/commonComponents/modal/ModalComponent";
import Avatar from "@/components/commonComponents/avatar/Avatar";
import { setCloseViewModal } from "../providerGroupProvidersSlice";

const PROVIDER_DETAILS = {
  1: {
    fullName: "Alexa Stuart",
    specialties: "Dermatologist",
    specialistGroup: "California Hub",
    primaryRole: "Attending Physician",
    gender: "Female",
    secondaryRole: "Clinical Supervisor",
    email: "alexastuart@gmail.com",
    npiNumber: "1459873621",
    language: "English",
    stateLicense: "TX-78321",
    contact: "+1 800-555-0199",
    yearsOfExperience: "12",
    providerType: "MD",
    timezone: "CST (Central Standard Time)",
    address:
      "1428 Meadowbrook Lane, Suite 205, Dallas Texas, United States, 75201",
    bio:
      "Sunrise Family Care Group is a multidisciplinary team providing comprehensive primary and preventive care. Our providers focus on patient-centered treatment, chronic condition management, wellness planning, and accessible care for individuals and families of all ages.",
  },
};

const getProviderProfile = (provider) => {
  const details = PROVIDER_DETAILS[provider?.id] || {};
  return {
    fullName: details.fullName || provider?.name || "—",
    specialties:
      details.specialties || provider?.specialties?.join(", ") || "—",
    specialistGroup: details.specialistGroup || "—",
    primaryRole: details.primaryRole || provider?.role || "—",
    gender: details.gender || "—",
    secondaryRole: details.secondaryRole || "—",
    email: details.email || provider?.email || "—",
    npiNumber: details.npiNumber || "—",
    language: details.language || "—",
    stateLicense: details.stateLicense || "—",
    contact: details.contact || provider?.contact || "—",
    yearsOfExperience: details.yearsOfExperience || "—",
    providerType: details.providerType || "—",
    timezone: details.timezone || "—",
    address: details.address || "—",
    bio: details.bio || "—",
    status: provider?.status || "Active",
  };
};

export default function ViewProviderModal({ open, viewData }) {
  const dispatch = useDispatch();
  const profile = getProviderProfile(viewData);

  const handleClose = () => {
    dispatch(setCloseViewModal());
  };

  const infoRows = [
    [
      { label: "Full Name", value: profile.fullName },
      { label: "Specialties", value: profile.specialties },
    ],
    [
      { label: "Specialist Group", value: profile.specialistGroup },
      { label: "Primary Role", value: profile.primaryRole },
    ],
    [
      { label: "Gender", value: profile.gender },
      { label: "Secondary Role", value: profile.secondaryRole },
    ],
    [
      { label: "Email Address", value: profile.email, isLink: true },
      { label: "NPI Number", value: profile.npiNumber },
    ],
    [
      { label: "Language", value: profile.language },
      { label: "State License", value: profile.stateLicense },
    ],
    [
      { label: "Contact Number", value: profile.contact },
      { label: "Year Of Experience", value: profile.yearsOfExperience },
    ],
    [
      { label: "Provider Type", value: profile.providerType },
      { label: "Timezone", value: profile.timezone },
    ],
  ];

  const title = (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm sm:text-base font-medium">
        {viewData?.name || "Provider Profile"}
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
      customClasses="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[70%] xl:w-[60%] max-w-[1000px]"
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
          {infoRows.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-6"
            >
              {row.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-2 text-sm py-0.5"
                >
                  <span className="text-neutral-500 min-w-[120px] sm:min-w-[140px] shrink-0">
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
          ))}

          <div className="flex items-start gap-2 text-sm py-0.5">
            <span className="text-neutral-500 min-w-[120px] sm:min-w-[140px] shrink-0">
              Address
            </span>
            <span className="text-neutral-400">:</span>
            <span className="text-text-primary break-words">
              {profile.address}
            </span>
          </div>

          <div className="flex items-start gap-2 text-sm py-0.5">
            <span className="text-neutral-500 min-w-[120px] sm:min-w-[140px] shrink-0">
              Bio
            </span>
            <span className="text-neutral-400">:</span>
            <span className="text-text-primary break-words">
              {profile.bio}
            </span>
          </div>
        </div>
      </div>
    </ModalComponent>
  );
}