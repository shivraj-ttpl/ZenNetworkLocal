import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@/components/commonComponents/button/Button';
import ModalComponent from '@/components/commonComponents/modal/ModalComponent';
import FileUpload from '@/components/commonComponents/upload/FileUpload';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import { codesActions } from '@/pages/MasterData/Codes/codeSaga';
import {
  closeImportModal,
  componentKey,
} from '@/pages/MasterData/Codes/codesSlice';
import { CODE_TYPE_MAP } from '@/pages/MasterData/Codes/constant';

const { importCodes } = codesActions;
const EMPTY_STATE = {};

export default function ImportCodes() {
  const dispatch = useDispatch();
  const { importModalFor = '' } = useSelector(
    (state) => state[componentKey] ?? EMPTY_STATE,
  );
  const isOpen = Boolean(importModalFor);
  const isImporting = useLoadingKey(LOADING_KEYS.CODES_POST_IMPORT);

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');

  const handleClose = () => {
    setFile(null);
    setFileError('');
    dispatch(closeImportModal());
  };

  const handleFileSelect = useCallback((selectedFile, error) => {
    setFile(selectedFile);
    setFileError(error);
  }, []);

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/templates/mastercodes.csv';
    link.download = 'mastercodes-template.csv';
    link.click();
  };

  const handleImport = () => {
    if (!file || fileError) return;
    const type = CODE_TYPE_MAP[importModalFor];
    dispatch(importCodes({ type, file }));
    handleClose();
  };

  return (
    <ModalComponent
      title={`Import ${importModalFor} Codes`}
      open={isOpen}
      close={handleClose}
      customClasses="w-full max-w-[966px] mx-4"
      footerButton={
        <div className="flex justify-between w-full">
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
            onClick={handleImport}
            disabled={!file || Boolean(fileError) || isImporting}
          >
            {isImporting ? 'Importing...' : 'Import'}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-text-secondary text-center">
          Upload a file to import {importModalFor} codes into the system.
        </p>
        <FileUpload
          allowedFileTypes={['.csv']}
          maxFileSize={5}
          onFileSelect={handleFileSelect}
          showDownloadTemplate
          onDownloadTemplate={handleDownloadTemplate}
        />
      </div>
    </ModalComponent>
  );
}
