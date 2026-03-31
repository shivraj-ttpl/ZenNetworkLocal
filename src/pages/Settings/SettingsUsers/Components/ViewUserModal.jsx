import { useDispatch } from "react-redux";
import ModalComponent from "@/components/commonComponents/modal/ModalComponent";
import Avatar from "@/components/commonComponents/avatar/Avatar";
import { setCloseViewModal } from "../settingsUsersSlice";

export default function ViewUserModal({ open, viewData }) {
  const dispatch = useDispatch();

  const handleClose = () => dispatch(setCloseViewModal());

  const fullName = [viewData?.firstName, viewData?.lastName].filter(Boolean).join(' ') || '—';
  const subOrgs = (viewData?.assignedSubOrgs ?? []).join(', ') || '—';
  const addressParts = [
    viewData?.address?.addressLine1,
    viewData?.address?.addressLine2,
    viewData?.address?.city,
    viewData?.address?.state,
    viewData?.address?.zipCode,
    viewData?.address?.country,
  ].filter(Boolean);
  const address = addressParts.length ? addressParts.join(', ') : '—';

  const infoRows = [
    { label: "Full Name", value: fullName },
    { label: "Email Address", value: viewData?.email || '—', isLink: true },
    { label: "Contact Number", value: viewData?.contactNumber || '—' },
    { label: "Sub-Organization", value: subOrgs },
    { label: "Status", value: viewData?.status || '—' },
    { label: "Address", value: address },
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
            src={viewData?.profilePhotoUrl}
            name={fullName}
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
