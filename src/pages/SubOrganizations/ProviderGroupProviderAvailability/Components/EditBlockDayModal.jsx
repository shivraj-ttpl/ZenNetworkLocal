import { useState } from "react";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";

import ModalComponent from "@/components/commonComponents/modal/ModalComponent";
import Button from "@/components/commonComponents/button/Button";
import RadioButton from "@/components/commonComponents/radioButton";

import { setCloseBlockDayModal } from "../providerGroupProviderAvailabilitySlice";

export default function EditBlockDayModal({ open, blockDayDate }) {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState("block");

  const handleClose = () => dispatch(setCloseBlockDayModal());

  const handleSave = () => {
    handleClose();
  };

  const formattedDate = blockDayDate
    ? dayjs(blockDayDate).format("D MMMM YYYY")
    : "";

  return (
    <ModalComponent
      title={`Edit Block Day- ${formattedDate}`}
      open={open}
      close={handleClose}
      customClasses="w-[95%] sm:w-[450px]"
      footerButton={
        <>
          <Button
            variant="outlineBlue"
            size="sm"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="primaryBlue"
            size="sm"
            type="button"
            onClick={handleSave}
          >
            Save
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <RadioButton
          label="Block Day"
          name="blockDayOption"
          value="block"
          checked={selected === "block"}
          onChangeCb={() => setSelected("block")}
        />
        <RadioButton
          label="Available Day"
          name="blockDayOption"
          value="available"
          checked={selected === "available"}
          onChangeCb={() => setSelected("available")}
        />
      </div>
    </ModalComponent>
  );
}
