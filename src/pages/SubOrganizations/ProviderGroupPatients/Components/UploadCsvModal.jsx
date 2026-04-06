import { Formik } from 'formik';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import Button from '@/components/commonComponents/button/Button';
import ModalComponent from '@/components/commonComponents/modal/ModalComponent';
import FileUpload from '@/components/commonComponents/upload/FileUpload';

import { setCloseUploadModal } from '../providerGroupPatientsSlice';

export default function UploadCsvModal({ open }) {
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
    <ModalComponent
      title="Upload CSV File"
      open={open}
      close={handleClose}
      customClasses="max-w-[1000px] w-[900px]"
      maxChildrenHeight="max-h-[70vh]"
      footerButton={
        <div className="flex justify-between w-full">
          <Button
            variant="outlineTeal"
            size="sm"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="primaryTeal"
            size="sm"
            type="button"
            onClick={handleImport}
            disabled={!csvFile}
          >
            Import
          </Button>
        </div>
      }
    >
      <Formik initialValues={{ csvFile: null }} onSubmit={() => {}}>
        <div className="flex flex-col gap-4">
          <FileUpload
            name="csvFile"
            allowedFileTypes={['.csv']}
            maxFileSize={5}
            onFileSelect={(file) => setCsvFile(file)}
            showDownloadTemplate
            downloadTemplateLabel="Download Template"
            description=".csv, up to 5MB."
          />
          <p className="text-sm text-text-primary">
            Mandatory fields: pat_first_name, pat_last_name, pat_birthsex and
            pat_dob
          </p>
        </div>
      </Formik>
    </ModalComponent>
  );
}
