import { FieldArray } from 'formik';

import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Input from '@/components/commonComponents/input/Input';
import PhoneInput from '@/components/commonComponents/phoneInput';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import UploadPhoto from '@/components/commonComponents/upload/UploadPhoto';
import Icon from '@/components/icons/Icon';
import { timezoneOptions } from '@/constants/commonDropdownOptions';

import {
  CARE_MANAGER_OPTIONS,
  CONTACT_METHOD_OPTIONS,
  COUNTRY_OPTIONS,
  COUNTY_OPTIONS,
  ETHNICITY_OPTIONS,
  FORM_FIELDS_NAMES,
  GENDER_OPTIONS,
  LANGUAGE_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  PROVIDER_OPTIONS,
  RACE_OPTIONS,
  RELATIONSHIP_OPTIONS,
  SEX_AT_BIRTH_OPTIONS,
  STATE_OPTIONS,
} from '../../constant';

const emptyFamilyContact = {
  [FORM_FIELDS_NAMES.FC_EMERGENCY]: false,
  [FORM_FIELDS_NAMES.FC_FIRST_NAME]: '',
  [FORM_FIELDS_NAMES.FC_LAST_NAME]: '',
  [FORM_FIELDS_NAMES.FC_RELATIONSHIP]: null,
  [FORM_FIELDS_NAMES.FC_EMAIL]: '',
  [FORM_FIELDS_NAMES.FC_PRIMARY_CONTACT]: '',
  [FORM_FIELDS_NAMES.FC_SECONDARY_CONTACT]: '',
};

// eslint-disable-next-line react-refresh/only-export-components
export { emptyFamilyContact };

export default function PatientDetails({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
}) {
  return (
    <div className="flex gap-6">
      {/* Photo Upload */}
      <div className="shrink-0 w-50">
        <UploadPhoto
          name="photo"
          label="Profile Photo"
          maxFileSize={5}
          onFileSelect={(file) => setFieldValue('photo', file)}
        />
      </div>

      {/* Form Fields */}
      <div className="flex-1 flex flex-col gap-5">
        {/* Demographics */}
        <h4 className="text-base font-semibold text-text-primary">
          Demographics
        </h4>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="First Name"
            name={FORM_FIELDS_NAMES.FIRST_NAME}
            placeholder="Enter First Name"
            value={values[FORM_FIELDS_NAMES.FIRST_NAME]}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors[FORM_FIELDS_NAMES.FIRST_NAME]}
            touched={touched[FORM_FIELDS_NAMES.FIRST_NAME]}
            required
          />
          <Input
            label="Last Name"
            name={FORM_FIELDS_NAMES.LAST_NAME}
            placeholder="Enter Last Name"
            value={values[FORM_FIELDS_NAMES.LAST_NAME]}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors[FORM_FIELDS_NAMES.LAST_NAME]}
            touched={touched[FORM_FIELDS_NAMES.LAST_NAME]}
            required
          />
          <Input
            label="Middle Name"
            name={FORM_FIELDS_NAMES.MIDDLE_NAME}
            placeholder="Enter"
            value={values[FORM_FIELDS_NAMES.MIDDLE_NAME]}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <SelectDropdown
            label="Sex at Birth"
            name={FORM_FIELDS_NAMES.SEX_AT_BIRTH}
            placeholder="Select Sex at Birth"
            options={SEX_AT_BIRTH_OPTIONS}
            value={values[FORM_FIELDS_NAMES.SEX_AT_BIRTH]}
            onChange={(selected) =>
              setFieldValue(FORM_FIELDS_NAMES.SEX_AT_BIRTH, selected)
            }
            isRequired
          />
          <Input
            label="Date of Birth"
            name={FORM_FIELDS_NAMES.DATE_OF_BIRTH}
            placeholder="MM/DD/YYYY"
            type="date"
            value={values[FORM_FIELDS_NAMES.DATE_OF_BIRTH]}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors[FORM_FIELDS_NAMES.DATE_OF_BIRTH]}
            touched={touched[FORM_FIELDS_NAMES.DATE_OF_BIRTH]}
            required
          />
          <SelectDropdown
            label="Marital Status"
            name={FORM_FIELDS_NAMES.MARITAL_STATUS}
            placeholder="Select Marital Status"
            options={MARITAL_STATUS_OPTIONS}
            value={values[FORM_FIELDS_NAMES.MARITAL_STATUS]}
            onChange={(selected) =>
              setFieldValue(FORM_FIELDS_NAMES.MARITAL_STATUS, selected)
            }
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <SelectDropdown
            label="Identified Gender"
            name={FORM_FIELDS_NAMES.IDENTIFIED_GENDER}
            placeholder="Select Gender"
            options={GENDER_OPTIONS}
            value={values[FORM_FIELDS_NAMES.IDENTIFIED_GENDER]}
            onChange={(selected) =>
              setFieldValue(FORM_FIELDS_NAMES.IDENTIFIED_GENDER, selected)
            }
          />
          <SelectDropdown
            label="Race"
            name={FORM_FIELDS_NAMES.RACE}
            placeholder="Select Race"
            options={RACE_OPTIONS}
            value={values[FORM_FIELDS_NAMES.RACE]}
            onChange={(selected) =>
              setFieldValue(FORM_FIELDS_NAMES.RACE, selected)
            }
          />
          <SelectDropdown
            label="Ethnicity"
            name={FORM_FIELDS_NAMES.ETHNICITY}
            placeholder="Select Ethnicity"
            options={ETHNICITY_OPTIONS}
            value={values[FORM_FIELDS_NAMES.ETHNICITY]}
            onChange={(selected) =>
              setFieldValue(FORM_FIELDS_NAMES.ETHNICITY, selected)
            }
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <SelectDropdown
            label="Preferred Language"
            name={FORM_FIELDS_NAMES.PREFERRED_LANGUAGE}
            placeholder="Select Language"
            options={LANGUAGE_OPTIONS}
            value={values[FORM_FIELDS_NAMES.PREFERRED_LANGUAGE]}
            onChange={(selected) =>
              setFieldValue(FORM_FIELDS_NAMES.PREFERRED_LANGUAGE, selected)
            }
          />
          <Input
            label="Email Address"
            name={FORM_FIELDS_NAMES.EMAIL}
            placeholder="example@Email Address.com"
            type="email"
            value={values[FORM_FIELDS_NAMES.EMAIL]}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <PhoneInput
            label="Primary Contact Number"
            name={FORM_FIELDS_NAMES.PRIMARY_CONTACT}
            value={values[FORM_FIELDS_NAMES.PRIMARY_CONTACT]}
            onChange={(val) =>
              setFieldValue(FORM_FIELDS_NAMES.PRIMARY_CONTACT, val || '')
            }
            onBlur={handleBlur}
            defaultCountry="US"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <PhoneInput
            label="Secondary Contact Number"
            name={FORM_FIELDS_NAMES.SECONDARY_CONTACT}
            value={values[FORM_FIELDS_NAMES.SECONDARY_CONTACT]}
            onChange={(val) =>
              setFieldValue(FORM_FIELDS_NAMES.SECONDARY_CONTACT, val || '')
            }
            onBlur={handleBlur}
            defaultCountry="US"
          />
          <SelectDropdown
            label="Preferred Method of Contact"
            name={FORM_FIELDS_NAMES.PREFERRED_METHOD_OF_CONTACT}
            placeholder="Select Preferred Method"
            options={CONTACT_METHOD_OPTIONS}
            value={values[FORM_FIELDS_NAMES.PREFERRED_METHOD_OF_CONTACT]}
            onChange={(selected) =>
              setFieldValue(
                FORM_FIELDS_NAMES.PREFERRED_METHOD_OF_CONTACT,
                selected,
              )
            }
          />
        </div>

        {/* Address Information */}
        <h4 className="text-base font-semibold text-text-primary">
          Address Information
        </h4>

        <div className="grid grid-cols-4 gap-4">
          <Input
            label="Address Line 1"
            name={FORM_FIELDS_NAMES.ADDRESS_LINE_1}
            placeholder="Enter Address Line 1"
            value={values[FORM_FIELDS_NAMES.ADDRESS_LINE_1]}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors[FORM_FIELDS_NAMES.ADDRESS_LINE_1]}
            touched={touched[FORM_FIELDS_NAMES.ADDRESS_LINE_1]}
            required
          />
          <Input
            label="Address Line 2"
            name={FORM_FIELDS_NAMES.ADDRESS_LINE_2}
            placeholder="Enter Address Line 2"
            value={values[FORM_FIELDS_NAMES.ADDRESS_LINE_2]}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <SelectDropdown
            label="State"
            name={FORM_FIELDS_NAMES.STATE}
            placeholder="Select State"
            options={STATE_OPTIONS}
            value={values[FORM_FIELDS_NAMES.STATE]}
            onChange={(selected) =>
              setFieldValue(FORM_FIELDS_NAMES.STATE, selected)
            }
            isRequired
          />
          <SelectDropdown
            label="Time Zone"
            name={FORM_FIELDS_NAMES.TIMEZONE}
            placeholder="Select Time Zone"
            options={timezoneOptions}
            value={values[FORM_FIELDS_NAMES.TIMEZONE]}
            onChange={(selected) =>
              setFieldValue(FORM_FIELDS_NAMES.TIMEZONE, selected)
            }
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <SelectDropdown
            label="City"
            name={FORM_FIELDS_NAMES.CITY}
            placeholder="Select State"
            options={STATE_OPTIONS}
            value={values[FORM_FIELDS_NAMES.CITY]}
            onChange={(selected) =>
              setFieldValue(FORM_FIELDS_NAMES.CITY, selected)
            }
            isRequired
          />
          <Input
            label="ZIP CODE"
            name={FORM_FIELDS_NAMES.ZIP_CODE}
            placeholder="Enter ZIP CODE"
            value={values[FORM_FIELDS_NAMES.ZIP_CODE]}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors[FORM_FIELDS_NAMES.ZIP_CODE]}
            touched={touched[FORM_FIELDS_NAMES.ZIP_CODE]}
            required
          />
          <SelectDropdown
            label="County"
            name={FORM_FIELDS_NAMES.COUNTY}
            placeholder="Select County"
            options={COUNTY_OPTIONS}
            value={values[FORM_FIELDS_NAMES.COUNTY]}
            onChange={(selected) =>
              setFieldValue(FORM_FIELDS_NAMES.COUNTY, selected)
            }
          />
          <SelectDropdown
            label="Country"
            name={FORM_FIELDS_NAMES.COUNTRY}
            placeholder="Select Country"
            options={COUNTRY_OPTIONS}
            value={values[FORM_FIELDS_NAMES.COUNTRY]}
            onChange={(selected) =>
              setFieldValue(FORM_FIELDS_NAMES.COUNTRY, selected)
            }
          />
        </div>

        {/* Family/Guardian Contact */}
        <h4 className="text-base font-semibold text-text-primary">
          Family/Guardian Contact
        </h4>

        <FieldArray name={FORM_FIELDS_NAMES.FAMILY_CONTACTS}>
          {({ push, remove }) => (
            <div className="flex flex-col gap-5">
              {values[FORM_FIELDS_NAMES.FAMILY_CONTACTS]?.map(
                (contact, index) => {
                  const prefix = `${FORM_FIELDS_NAMES.FAMILY_CONTACTS}[${index}]`;
                  return (
                    <div
                      key={index}
                      className="flex flex-col gap-4 border border-border-light rounded-lg p-4 relative"
                    >
                      {values[FORM_FIELDS_NAMES.FAMILY_CONTACTS].length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-error-500 cursor-pointer"
                        >
                          <Icon name="X" size={14} />
                        </button>
                      )}

                      <Checkbox
                        label="Emergency Contact"
                        checked={contact[FORM_FIELDS_NAMES.FC_EMERGENCY]}
                        onChange={(e) =>
                          setFieldValue(
                            `${prefix}.${FORM_FIELDS_NAMES.FC_EMERGENCY}`,
                            e.target.checked,
                          )
                        }
                        variant="teal"
                        size="sm"
                      />

                      <div className="grid grid-cols-3 gap-4">
                        <Input
                          label="First Name"
                          name={`${prefix}.${FORM_FIELDS_NAMES.FC_FIRST_NAME}`}
                          placeholder="Enter"
                          value={contact[FORM_FIELDS_NAMES.FC_FIRST_NAME]}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <Input
                          label="Last Name"
                          name={`${prefix}.${FORM_FIELDS_NAMES.FC_LAST_NAME}`}
                          placeholder="Enter"
                          value={contact[FORM_FIELDS_NAMES.FC_LAST_NAME]}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <SelectDropdown
                          label="Relationship Type"
                          name={`${prefix}.${FORM_FIELDS_NAMES.FC_RELATIONSHIP}`}
                          placeholder="Select"
                          options={RELATIONSHIP_OPTIONS}
                          value={contact[FORM_FIELDS_NAMES.FC_RELATIONSHIP]}
                          onChange={(selected) =>
                            setFieldValue(
                              `${prefix}.${FORM_FIELDS_NAMES.FC_RELATIONSHIP}`,
                              selected,
                            )
                          }
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <Input
                          label="Email Address"
                          name={`${prefix}.${FORM_FIELDS_NAMES.FC_EMAIL}`}
                          placeholder="Enter"
                          type="email"
                          value={contact[FORM_FIELDS_NAMES.FC_EMAIL]}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <PhoneInput
                          label="Primary Contact Number"
                          name={`${prefix}.${FORM_FIELDS_NAMES.FC_PRIMARY_CONTACT}`}
                          value={contact[FORM_FIELDS_NAMES.FC_PRIMARY_CONTACT]}
                          onChange={(val) =>
                            setFieldValue(
                              `${prefix}.${FORM_FIELDS_NAMES.FC_PRIMARY_CONTACT}`,
                              val || '',
                            )
                          }
                          onBlur={handleBlur}
                          defaultCountry="US"
                        />
                        <PhoneInput
                          label="Secondary Contact Number"
                          name={`${prefix}.${FORM_FIELDS_NAMES.FC_SECONDARY_CONTACT}`}
                          value={
                            contact[FORM_FIELDS_NAMES.FC_SECONDARY_CONTACT]
                          }
                          onChange={(val) =>
                            setFieldValue(
                              `${prefix}.${FORM_FIELDS_NAMES.FC_SECONDARY_CONTACT}`,
                              val || '',
                            )
                          }
                          onBlur={handleBlur}
                          defaultCountry="US"
                        />
                      </div>
                    </div>
                  );
                },
              )}

              <button
                type="button"
                onClick={() => push({ ...emptyFamilyContact })}
                className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 cursor-pointer w-fit"
              >
                <Icon name="Plus" size={16} />
                Add Family/Guardian Contact
              </button>
            </div>
          )}
        </FieldArray>

        {/* Provider & Care Team */}
        <h4 className="text-base font-semibold text-text-primary">
          Provider & Care Team
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <SelectDropdown
            label="Referring Provider"
            name={FORM_FIELDS_NAMES.REFERRING_PROVIDER}
            placeholder="Select Referring Provider"
            options={PROVIDER_OPTIONS}
            value={values[FORM_FIELDS_NAMES.REFERRING_PROVIDER]}
            onChange={(selected) =>
              setFieldValue(FORM_FIELDS_NAMES.REFERRING_PROVIDER, selected)
            }
          />
          <SelectDropdown
            label="Primary Care Provider"
            name={FORM_FIELDS_NAMES.PRIMARY_CARE_PROVIDER}
            placeholder="Select Primary Care Provider"
            options={PROVIDER_OPTIONS}
            value={values[FORM_FIELDS_NAMES.PRIMARY_CARE_PROVIDER]}
            onChange={(selected) =>
              setFieldValue(FORM_FIELDS_NAMES.PRIMARY_CARE_PROVIDER, selected)
            }
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <SelectDropdown
            label="Primary Care Manager"
            name={FORM_FIELDS_NAMES.PRIMARY_CARE_MANAGER}
            placeholder="Select Primary Care Manager"
            options={CARE_MANAGER_OPTIONS}
            value={values[FORM_FIELDS_NAMES.PRIMARY_CARE_MANAGER]}
            onChange={(selected) =>
              setFieldValue(FORM_FIELDS_NAMES.PRIMARY_CARE_MANAGER, selected)
            }
          />
          <SelectDropdown
            label="Secondary Care Manager"
            name={FORM_FIELDS_NAMES.SECONDARY_CARE_MANAGER}
            placeholder="Select Secondary Care Manager"
            options={CARE_MANAGER_OPTIONS}
            value={values[FORM_FIELDS_NAMES.SECONDARY_CARE_MANAGER]}
            onChange={(selected) =>
              setFieldValue(FORM_FIELDS_NAMES.SECONDARY_CARE_MANAGER, selected)
            }
          />
          <SelectDropdown
            label="Additional Care Team Member"
            name={FORM_FIELDS_NAMES.ADDITIONAL_CARE_TEAM_MEMBER}
            placeholder="Select Additional Care Team Member"
            options={CARE_MANAGER_OPTIONS}
            value={values[FORM_FIELDS_NAMES.ADDITIONAL_CARE_TEAM_MEMBER]}
            onChange={(selected) =>
              setFieldValue(
                FORM_FIELDS_NAMES.ADDITIONAL_CARE_TEAM_MEMBER,
                selected,
              )
            }
          />
        </div>

        {/* Approval for Communication */}
        <h4 className="text-base font-semibold text-text-primary">
          Approval for communication
        </h4>

        <div className="flex items-center gap-8">
          <Checkbox
            label="Consent to Message"
            checked={values[FORM_FIELDS_NAMES.CONSENT_TO_MESSAGE]}
            onChange={(e) =>
              setFieldValue(
                FORM_FIELDS_NAMES.CONSENT_TO_MESSAGE,
                e.target.checked,
              )
            }
            variant="teal"
            size="sm"
          />
          <Checkbox
            label="Consent to Call"
            checked={values[FORM_FIELDS_NAMES.CONSENT_TO_CALL]}
            onChange={(e) =>
              setFieldValue(FORM_FIELDS_NAMES.CONSENT_TO_CALL, e.target.checked)
            }
            variant="teal"
            size="sm"
          />
          <Checkbox
            label="Consent to Email Address"
            checked={values[FORM_FIELDS_NAMES.CONSENT_TO_EMAIL]}
            onChange={(e) =>
              setFieldValue(
                FORM_FIELDS_NAMES.CONSENT_TO_EMAIL,
                e.target.checked,
              )
            }
            variant="teal"
            size="sm"
          />
          <Checkbox
            label="Enable Call Recording"
            checked={values[FORM_FIELDS_NAMES.ENABLE_CALL_RECORDING]}
            onChange={(e) =>
              setFieldValue(
                FORM_FIELDS_NAMES.ENABLE_CALL_RECORDING,
                e.target.checked,
              )
            }
            variant="teal"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
