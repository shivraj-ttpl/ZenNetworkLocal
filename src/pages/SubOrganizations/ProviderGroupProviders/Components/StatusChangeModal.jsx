import { useDispatch } from "react-redux";
import ModalComponent from "@/components/commonComponents/modal/ModalComponent";
import Button from "@/components/commonComponents/button/Button";
import { setCloseStatusModal } from "../providerGroupProvidersSlice";

export default function StatusChangeModal({ open, statusChangeRow }) {
  const dispatch = useDispatch();
  const isActive = statusChangeRow?.status === "Active";
  const name = statusChangeRow?.name || "";

  const handleClose = () => {
    dispatch(setCloseStatusModal());
  };

  const handleConfirm = () => {
    // TODO: dispatch saga action to toggle status
    handleClose();
  };

  return (
    <ModalComponent
      title="Status Change"
      open={open}
      close={handleClose}
      customClasses="max-w-[800px] w-[700px]"
      maxChildrenHeight="max-h-[50vh]"
      footerButton={
        <div className="flex justify-between w-full">
          <Button variant="outlineTeal" size="sm" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primaryTeal" size="sm" type="button" onClick={handleConfirm}>
            {isActive ? "Yes, Deactivate" : "Yes, Activate"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-3 py-4">
        <p className="text-lg font-semibold text-text-primary text-center">
          Are you sure you want to {isActive ? "deactivate" : "activate"} &quot;{name}&quot;?
        </p>
        <p className="text-sm text-neutral-500 text-center">
          {isActive
            ? "This action will immediately remove their access to the Provider Portal."
            : "This will restore their access to the Provider Portal."}
        </p>
      </div>
    </ModalComponent>
  );
}
