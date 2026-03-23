import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import ModalComponent from "@/components/commonComponents/modal/ModalComponent";
import FileUpload from "@/components/commonComponents/upload/FileUpload";
import Button from "@/components/commonComponents/button/Button";
import { componentKey, closeImportModal } from "@/pages/MasterData/Codes/codesSlice";

export default function ImportCodes() {
  const dispatch = useDispatch();
  const importModalFor = useSelector((state) => state[componentKey]?.importModalFor ?? "");
  const isOpen = Boolean(importModalFor);

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");

  const handleClose = () => {
    setFile(null);
    setFileError("");
    dispatch(closeImportModal());
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
    <ModalComponent
      title={`Import ${importModalFor} Codes`}
      open={isOpen}
      close={handleClose}
      customClasses="w-full max-w-[966px] mx-4"
      footerButton={
        <>
        <div className="flex justify-between w-[100%]">
          <Button variant="outlineTeal" size="sm"  type="button" onClick={handleClose}>
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
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-text-secondary text-center">
          Upload a file to import {importModalFor} codes into the system.
        </p>
        <FileUpload
          allowedFileTypes={[".csv"]}
          maxFileSize={5}
          onFileSelect={handleFileSelect}
          showDownloadTemplate
          onDownloadTemplate={handleDownloadTemplate}
        />
      </div>
    </ModalComponent>
  );
}
