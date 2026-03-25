import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Drawer from "@/components/commonComponents/drawer/Drawer";
import FileUpload from "@/components/commonComponents/upload/FileUpload";
import Button from "@/components/commonComponents/button/Button";
import { componentKey, setCloseImportModal } from "../payersSlice";

export default function ImportPayersDrawer() {
  const dispatch = useDispatch();
  const importModalOpen = useSelector(
    (state) => state[componentKey]?.importModalOpen ?? false
  );

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");

  const handleClose = () => {
    setFile(null);
    setFileError("");
    dispatch(setCloseImportModal());
  };

  const handleFileSelect = useCallback((selectedFile, error) => {
    setFile(selectedFile);
    setFileError(error);
  }, []);

  const handleDownloadTemplate = () => {
    // TODO: dispatch saga action to download CSV template
  };

  const handleImport = () => {
    if (!file || fileError) return;
    // TODO: dispatch saga action to upload/import file
    handleClose();
  };

  return (
    <Drawer
      title="Upload CSV File"
      open={importModalOpen}
      close={handleClose}
      width="max-w-[700px] w-[700px]"
      footerButton={
        <div className="flex justify-between w-full">
          <Button variant="outlineTeal" size="sm" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primaryTeal"
            size="sm"
            type="button"
            onClick={handleImport}
            disabled={!file || Boolean(fileError)}
          >
            Import
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <FileUpload
          allowedFileTypes={[".csv"]}
          maxFileSize={5}
          onFileSelect={handleFileSelect}
          showDownloadTemplate
          onDownloadTemplate={handleDownloadTemplate}
        />
      </div>
    </Drawer>
  );
}
