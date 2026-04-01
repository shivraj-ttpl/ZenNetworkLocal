import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Button from '@/components/commonComponents/button/Button';
import Drawer from '@/components/commonComponents/drawer/Drawer';
import FileUpload from '@/components/commonComponents/upload/FileUpload';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useLoadingKey } from '@/hooks/useLoadingKey';

import { payersActions } from '../payersSaga';
import { componentKey, setCloseImportModal } from '../payersSlice';

const { importPayers } = payersActions;
const EMPTY_STATE = {};

export default function ImportPayersDrawer() {
  const dispatch = useDispatch();
  const { importModalOpen = false } = useSelector(
    (state) => state[componentKey] ?? EMPTY_STATE,
  );

  const isImporting = useLoadingKey(LOADING_KEYS.PAYERS_POST_IMPORT);

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');

  const handleClose = () => {
    setFile(null);
    setFileError('');
    dispatch(setCloseImportModal());
  };

  const handleFileSelect = useCallback((selectedFile, error) => {
    setFile(selectedFile);
    setFileError(error);
  }, []);

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/templates/payersTemplate.csv';
    link.download = 'payers-template.csv';
    link.click();
  };

  const handleImport = () => {
    if (!file || fileError) return;
    dispatch(importPayers({ file }));
  };

  return (
    <Drawer
      title="Upload CSV File"
      open={importModalOpen}
      close={handleClose}
      width="max-w-[700px] w-[700px]"
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
        <FileUpload
          allowedFileTypes={['.csv']}
          maxFileSize={5}
          onFileSelect={handleFileSelect}
          showDownloadTemplate
          onDownloadTemplate={handleDownloadTemplate}
        />
      </div>
    </Drawer>
  );
}
