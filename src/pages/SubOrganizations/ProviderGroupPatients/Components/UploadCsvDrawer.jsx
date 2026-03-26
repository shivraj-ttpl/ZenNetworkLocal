import { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import Drawer from "@/components/commonComponents/drawer/Drawer";
import Button from "@/components/commonComponents/button/Button";
import FileUpload from "@/components/commonComponents/upload/FileUpload";
import { setCloseUploadModal } from "../providerGroupPatientsSlice";

export default function UploadCsvDrawer({ open }) {
  const dispatch = useDispatch();
  const [csvFile, setCsvFile] = useState(null);

  const handleClose = () => {
    setCsvFile(null);
    dispatch(setCloseUploadModal());
  };

  const handleImport = () => {
    // TODO: dispatch saga action to upload CSV
    handleClose();
  };

  return (
    <Drawer
      title="Upload CSV File"
      open={open}
      close={handleClose}
      footerButton={null}
          width="max-w-[85%] w-[700px]"
    >
      <Formik initialValues={{ csvFile: null }} onSubmit={() => {}}>
        <div className="flex flex-col h-full">
          <div className="flex-1 flex flex-col gap-4">
            <FileUpload
              name="csvFile"
              allowedFileTypes={[".csv"]}
              maxFileSize={5}
              onFileSelect={(file) => setCsvFile(file)}
              showDownloadTemplate
              downloadTemplateLabel="Download Template"
              description=".csv, up to 5MB."
            />
            <p className="text-sm text-text-primary">
              Mandatory fields: pat_first_name, pat_last_name, pat_birthsex and pat_dob
            </p>
          </div>

          <div className="flex justify-between gap-2 mt-auto pt-4 border-t border-[#E9E9E9]">
            <Button variant="outlineTeal" size="sm" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primaryTeal" size="sm" type="button" onClick={handleImport} disabled={!csvFile}>
              Import
            </Button>
          </div>
        </div>
      </Formik>
    </Drawer>
  );
}
