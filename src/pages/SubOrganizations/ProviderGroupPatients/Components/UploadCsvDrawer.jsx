import { Formik } from 'formik';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import Button from '@/components/commonComponents/button/Button';
import Drawer from '@/components/commonComponents/drawer/Drawer';
import FileUpload from '@/components/commonComponents/upload/FileUpload';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import useSubOrgTenantName from '@/hooks/useSubOrgTenantName';

import { patientActions } from '../providerGroupPatientsSaga';
import { setCloseUploadModal } from '../providerGroupPatientsSlice';

export default function UploadCsvDrawer({ open }) {
  const dispatch = useDispatch();
  const { providerGroupId } = useParams();
  const tenantName = useSubOrgTenantName();
  const isImporting = useLoadingKey(LOADING_KEYS.PG_PATIENTS_POST_IMPORT_CSV);
  const [csvFile, setCsvFile] = useState(null);

  const handleClose = () => {
    setCsvFile(null);
    dispatch(setCloseUploadModal());
  };

  const handleImport = () => {
    if (!csvFile || !providerGroupId || !tenantName) return;
    dispatch(
      patientActions.importPatientsCsv({
        providerGroupId,
        tenantName,
        file: csvFile,
      }),
    );
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/templates/patientImportTemplate.csv';
    link.download = 'patient_import_template.csv';
    link.click();
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
              allowedFileTypes={['.csv']}
              maxFileSize={5}
              onFileSelect={(file) => setCsvFile(file)}
              showDownloadTemplate
              onDownloadTemplate={handleDownloadTemplate}
              description=".csv, up to 5MB."
            />
            <p className="text-sm text-text-primary">
              Mandatory fields: pat_first_name, pat_last_name, pat_birthsex and
              pat_dob
            </p>
          </div>

          <div className="flex justify-between gap-2 mt-auto pt-4 border-t border-[#E9E9E9]">
            <Button
              variant="outlineBlue"
              size="sm"
              type="button"
              onClick={handleClose}
              disabled={isImporting}
            >
              Cancel
            </Button>
            <Button
              variant="primaryBlue"
              size="sm"
              type="button"
              onClick={handleImport}
              disabled={!csvFile || isImporting}
            >
              {isImporting ? 'Importing...' : 'Import'}
            </Button>
          </div>
        </div>
      </Formik>
    </Drawer>
  );
}
