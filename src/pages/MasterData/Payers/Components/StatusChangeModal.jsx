import { useSelector, useDispatch } from "react-redux";
import ModalComponent from "@/components/commonComponents/modal/ModalComponent";
import Button from "@/components/commonComponents/button/Button";
import { componentKey, setCloseStatusModal } from "../payersSlice";

export default function StatusChangeModal() {
  const dispatch = useDispatch();
  const { statusModalOpen = false, statusChangeRow = null } = useSelector(
    (state) => state[componentKey] ?? {}
  );

  const isActive = statusChangeRow?.status === "Active";
  const payerName = statusChangeRow?.name || "";

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
      open={statusModalOpen}
      close={handleClose}
      customClasses="w-full max-w-[600px] mx-4"
      footerButton={
        <div className="flex justify-between w-full">
          <Button variant="outlineBlue" size="sm" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="brandPrimary" size="sm" type="button" onClick={handleConfirm}>
            {isActive ? "Yes, Deactivate" : "Yes, Activate"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-2 py-4">
        <p className="text-base font-semibold text-text-primary text-center">
          Are you sure you want to {isActive ? "deactivate" : "activate"} &quot;{payerName}&quot;?
        </p>
        <p className="text-sm text-text-secondary text-center">
          {isActive
            ? "This payer will no longer be available for new patient enrollments"
            : "This Payer will become available for new patient enrollments"}
        </p>
      </div>
    </ModalComponent>
  );
}
