import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import Button from '@/components/commonComponents/button/Button';
import Drawer from '@/components/commonComponents/drawer/Drawer';
import Input from '@/components/commonComponents/input/Input';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import FileUpload from '@/components/commonComponents/upload/FileUpload';
import { spcialitityOptions } from '@/constants/commonDropdownOptions';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useLoadingKey } from '@/hooks/useLoadingKey';

import { FORM_FIELDS_NAMES } from '../constant';
import { educationActions } from '../educationSaga';
import { componentKey, setCloseDrawer } from '../educationSlice';

const { createEducation, updateEducation } = educationActions;
const EMPTY_STATE = {};

const validationSchema = Yup.object().shape({
  [FORM_FIELDS_NAMES.FILE_NAME]: Yup.string().required('File Name is required'),
  [FORM_FIELDS_NAMES.FILE]: Yup.mixed().required('File is required'),
});

export default function AddMaterialDrawer() {
  const dispatch = useDispatch();
  const {
    drawerOpen = false,
    drawerMode = '',
    editData = null,
  } = useSelector((state) => state[componentKey] ?? EMPTY_STATE);
  const isEdit = drawerMode === 'edit';
  const isCreating = useLoadingKey(LOADING_KEYS.EDUCATION_POST_CREATE);
  const isUpdating = useLoadingKey(LOADING_KEYS.EDUCATION_PATCH_UPDATE);
  const isSaving = isCreating || isUpdating;

  const [fileError, setFileError] = useState('');

  const handleClose = () => {
    setFileError('');
    dispatch(setCloseDrawer());
  };

  const handleFormSubmit = (values) => {
    const file = values[FORM_FIELDS_NAMES.FILE];
    const data = {
      fileName: values[FORM_FIELDS_NAMES.FILE_NAME],
      specialty: values[FORM_FIELDS_NAMES.SPECIALTY]?.value || '',
      fileType: file?.type?.includes('pdf')
        ? 'PDF'
        : file?.type?.includes('video')
          ? 'VIDEO'
          : file?.type?.includes('image')
            ? 'IMAGE'
            : 'DOCUMENT',
      fileSize: file?.size || '',
      contentType: file?.type || '',
    };

    if (isEdit) {
      dispatch(updateEducation({ id: editData?.id, data }));
    } else {
      dispatch(createEducation({ data }));
    }
  };

  const title = isEdit ? 'Edit Material' : 'Add Material';
  const submitLabel = isSaving ? 'Saving...' : isEdit ? 'Update' : 'Upload';

  return (
    <Drawer
      title={title}
      open={drawerOpen}
      close={handleClose}
      width="max-w-[500px] w-[500px]"
      footerButton={null}
    >
      <Formik
        initialValues={{
          [FORM_FIELDS_NAMES.FILE_NAME]: editData?.fileName ?? '',
          [FORM_FIELDS_NAMES.SPECIALTY]: editData?.specialty
            ? { value: editData.specialty, label: editData.specialty }
            : null,
          [FORM_FIELDS_NAMES.FILE]: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          isValid,
          dirty,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          resetForm,
        }) => (
          <Form className="flex flex-col h-full">
            <div className="flex flex-col gap-4 flex-1">
              <Input
                label="File Name"
                name={FORM_FIELDS_NAMES.FILE_NAME}
                placeholder="Enter File Name"
                value={values[FORM_FIELDS_NAMES.FILE_NAME]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors[FORM_FIELDS_NAMES.FILE_NAME]}
                touched={touched[FORM_FIELDS_NAMES.FILE_NAME]}
                required
              />

              <SelectDropdown
                label="Specialty"
                name={FORM_FIELDS_NAMES.SPECIALTY}
                placeholder="Select Specialty"
                options={spcialitityOptions}
                value={values[FORM_FIELDS_NAMES.SPECIALTY]}
                onChange={(selected) =>
                  setFieldValue(FORM_FIELDS_NAMES.SPECIALTY, selected)
                }
              />

              <FileUpload
                label="Upload File"
                name={FORM_FIELDS_NAMES.FILE}
                isRequired
                allowedFileTypes={[
                  '.pdf',
                  '.mp4',
                  '.doc',
                  '.docx',
                  '.ppt',
                  '.pptx',
                  '.png',
                  '.jpg',
                ]}
                maxFileSize={5}
                description="pdf, mp4, doc, docx, ppt, pptx, png, jpg, up to 5MB."
                onFileSelect={(file, error) => {
                  setFieldValue(FORM_FIELDS_NAMES.FILE, file);
                  setFileError(error);
                }}
                error={
                  fileError ||
                  (touched[FORM_FIELDS_NAMES.FILE]
                    ? errors[FORM_FIELDS_NAMES.FILE]
                    : '')
                }
                touched={touched[FORM_FIELDS_NAMES.FILE]}
              />
            </div>

            <div className="flex justify-between gap-2 mt-auto pt-4 border-t border-[#E9E9E9]">
              <Button
                variant="outlineBlue"
                size="sm"
                type="button"
                onClick={() => {
                  resetForm();
                  handleClose();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primaryBlue"
                size="sm"
                type="button"
                onClick={handleSubmit}
                disabled={!(isValid && dirty) || Boolean(fileError) || isSaving}
              >
                {submitLabel}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}
