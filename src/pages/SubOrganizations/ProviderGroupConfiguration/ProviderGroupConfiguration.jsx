import { Formik } from 'formik';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext, useParams } from 'react-router-dom';

import Button from '@/components/commonComponents/button/Button';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useFlexCleanup } from '@/hooks/useFlexCleanup';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import useSubOrgTenantName from '@/hooks/useSubOrgTenantName';
import { getValidationSchema } from '@/utils/formUtils';

import { FORM_FIELDS_NAMES } from './constant';
import {
  providerGroupConfigurationActions,
  registerSaga,
} from './providerGroupConfigurationSaga';
import {
  componentKey,
  registerReducer,
} from './providerGroupConfigurationSlice';

const {
  fetchConfiguration,
  createCallerId,
  deleteCallerId,
  createSenderEmail,
  deleteSenderEmail,
} = providerGroupConfigurationActions;

const callerIdValidationSchema = getValidationSchema([
  {
    fieldName: FORM_FIELDS_NAMES.CALLER_ID,
    isRequired: true,
    customFieldName: 'Caller ID',
  },
]);

const senderEmailValidationSchema = getValidationSchema([
  {
    fieldName: FORM_FIELDS_NAMES.EMAIL,
    isRequired: true,
    isEmail: true,
    customFieldName: 'Email Address',
  },
]);

const EMPTY_STATE = {};

export default function ProviderGroupConfiguration() {
  const { setToolbar } = useOutletContext();
  const { providerGroupId } = useParams();
  const dispatch = useDispatch();
  const tenantName = useSubOrgTenantName();

  const { configuration, refreshFlag } =
    useSelector((state) => state[componentKey]) || EMPTY_STATE;

  const isCreatingCallerId = useLoadingKey(
    LOADING_KEYS.PG_CONFIGURATION_POST_CALLER_ID,
  );
  const isDeletingCallerId = useLoadingKey(
    LOADING_KEYS.PG_CONFIGURATION_DELETE_CALLER_ID,
  );
  const isCreatingSenderEmail = useLoadingKey(
    LOADING_KEYS.PG_CONFIGURATION_POST_SENDER_EMAIL,
  );
  const isDeletingSenderEmail = useLoadingKey(
    LOADING_KEYS.PG_CONFIGURATION_DELETE_SENDER_EMAIL,
  );

  useEffect(() => {
    registerReducer();
    registerSaga();
  }, []);

  useEffect(() => {
    setToolbar(null);
    return () => setToolbar(null);
  }, [setToolbar]);

  useEffect(() => {
    if (providerGroupId) {
      dispatch(fetchConfiguration({ providerGroupId, tenantName }));
    }
  }, [dispatch, providerGroupId, tenantName, refreshFlag]);

  useFlexCleanup(componentKey);

  const handleCreateCallerId = (values, { resetForm }) => {
    dispatch(
      createCallerId({
        providerGroupId,
        tenantName,
        data: {
          callerId: values[FORM_FIELDS_NAMES.CALLER_ID],
          verify: values[FORM_FIELDS_NAMES.VERIFY],
        },
        resetForm,
      }),
    );
  };

  const handleDeleteCallerId = () => {
    dispatch(deleteCallerId({ providerGroupId, tenantName }));
  };

  const handleCreateSenderEmail = (values, { resetForm }) => {
    dispatch(
      createSenderEmail({
        providerGroupId,
        tenantName,
        data: {
          email: values[FORM_FIELDS_NAMES.EMAIL],
        },
        resetForm,
      }),
    );
  };

  const handleDeleteSenderEmail = () => {
    dispatch(deleteSenderEmail({ providerGroupId, tenantName }));
  };

  return (
    <div className="px-5 pb-5">
      <div className="grid grid-cols-2 gap-6">
        <div className="border border-border-light rounded-lg p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            Caller ID Verification
          </h3>
          {configuration?.callerId && (
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg mb-4">
              <span className="text-sm text-text-primary">
                Caller ID : {configuration.callerId.callerId}
              </span>
              <button
                type="button"
                className="text-error-500 hover:text-error-700 cursor-pointer"
                onClick={handleDeleteCallerId}
                disabled={isDeletingCallerId}
              >
                <Icon name="Trash2" size={16} />
              </button>
            </div>
          )}
          <Formik
            initialValues={{
              [FORM_FIELDS_NAMES.CALLER_ID]: '',
              [FORM_FIELDS_NAMES.VERIFY]: false,
            }}
            validationSchema={callerIdValidationSchema}
            onSubmit={handleCreateCallerId}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                <div className="space-y-3">
                  <label className="text-sm text-text-primary font-medium">
                    Caller ID
                  </label>
                  <div>
                    <input
                      type="text"
                      name={FORM_FIELDS_NAMES.CALLER_ID}
                      placeholder="Enter Caller ID"
                      value={values[FORM_FIELDS_NAMES.CALLER_ID]}
                      onChange={handleChange}
                      className="w-full h-10 px-4 rounded-lg border border-border bg-surface text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-neutral-800 placeholder-text-placeholder"
                    />
                    {touched[FORM_FIELDS_NAMES.CALLER_ID] &&
                      errors[FORM_FIELDS_NAMES.CALLER_ID] && (
                        <p className="text-xs text-error-500 mt-1">
                          {errors[FORM_FIELDS_NAMES.CALLER_ID]}
                        </p>
                      )}
                  </div>
                  <Checkbox
                    label="Verify ID"
                    variant="blue"
                    size="sm"
                    checked={values[FORM_FIELDS_NAMES.VERIFY]}
                    onChange={() =>
                      setFieldValue(
                        FORM_FIELDS_NAMES.VERIFY,
                        !values[FORM_FIELDS_NAMES.VERIFY],
                      )
                    }
                    name={FORM_FIELDS_NAMES.VERIFY}
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    type="submit"
                    variant="primaryBlue"
                    size="sm"
                    disabled={isCreatingCallerId}
                  >
                    Create Caller ID
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </div>

        <div className="border border-border-light rounded-lg p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            Sender Email Address Verification
          </h3>
          {configuration?.senderEmail?.emailAddress && (
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg mb-4">
              <span className="text-sm text-text-primary">
                Email : {configuration.senderEmail?.emailAddress}
              </span>
              <button
                type="button"
                className="text-error-500 hover:text-error-700 cursor-pointer"
                onClick={handleDeleteSenderEmail}
                disabled={isDeletingSenderEmail}
              >
                <Icon name="Trash2" size={16} />
              </button>
            </div>
          )}
          <Formik
            initialValues={{
              [FORM_FIELDS_NAMES.EMAIL]: '',
            }}
            validationSchema={senderEmailValidationSchema}
            onSubmit={handleCreateSenderEmail}
          >
            {({ values, errors, touched, handleChange, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div className="space-y-3">
                  <label className="text-sm text-text-primary font-medium">
                    Email Address
                  </label>
                  <div>
                    <input
                      type="text"
                      name={FORM_FIELDS_NAMES.EMAIL}
                      placeholder="Enter Email Address"
                      value={values[FORM_FIELDS_NAMES.EMAIL]}
                      onChange={handleChange}
                      className="w-full h-10 px-4 rounded-lg border border-border bg-surface text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-neutral-800 placeholder-text-placeholder"
                    />
                    {touched[FORM_FIELDS_NAMES.EMAIL] &&
                      errors[FORM_FIELDS_NAMES.EMAIL] && (
                        <p className="text-xs text-error-500 mt-1">
                          {errors[FORM_FIELDS_NAMES.EMAIL]}
                        </p>
                      )}
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    type="submit"
                    variant="primaryBlue"
                    size="sm"
                    disabled={isCreatingSenderEmail}
                  >
                    Verify
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
