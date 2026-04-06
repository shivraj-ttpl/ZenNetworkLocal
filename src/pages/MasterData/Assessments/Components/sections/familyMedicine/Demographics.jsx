import { useRef, useState } from 'react';

import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Input from '@/components/commonComponents/input/Input';
import PhoneInput from '@/components/commonComponents/phoneInput';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import { Icon } from '@/components/icons';
import {
  CITY_OPTIONS,
  CONTACT_METHOD_OPTIONS,
  COUNTRY_OPTIONS,
  COUNTY_OPTIONS,
  IDENTIFIED_GENDER_OPTIONS,
  LANGUAGE_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  PRONOUNS_OPTIONS,
  RACE_ETHNICITY_OPTIONS,
  RELATIONSHIP_TO_INSURED_OPTIONS,
  SEX_AT_BIRTH_OPTIONS,
  STATE_OPTIONS,
} from '@/pages/MasterData/Assessments/constant';

const YES_NO = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

const PREFERRED_CONTACT_RADIO = [
  { label: 'Text Message', value: 'textMessage' },
  { label: 'Email Address', value: 'email' },
  { label: 'Telephone Message', value: 'telephone' },
];

const EMPTY_INSURANCE = {
  insuranceType: '',
  insuranceName: '',
  relationshipToInsured: '',
  policyHolderName: '',
  insuranceEffectiveDate: '',
  policyNumber: '',
  insuredGroupPlan: '',
  employerSchoolName: '',
  sameAsPrimaryAddress: false,
  insuredAddressLine1: '',
  insuredAddressLine2: '',
  insuredState: '',
  insuredCity: '',
  insuredZipCode: '',
  insuredCounty: '',
  insuranceCardFront: null,
  insuranceCardBack: null,
};

function RadioGroup({ name, options, value, onChange }) {
  return (
    <div className="flex items-center gap-6">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="accent-primary w-4 h-4"
          />
          <span className="text-sm text-text-primary">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

function UploadBox({ label, file, onFileChange }) {
  const inputRef = useRef(null);
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-text-primary">{label}</p>
      <div
        className="border-2 border-dashed border-neutral-300 rounded-lg flex flex-col items-center justify-center gap-2 py-10 cursor-pointer hover:border-primary transition-colors"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) onFileChange(f);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files[0];
            if (f) onFileChange(f);
          }}
        />
        {file ? (
          <p className="text-sm text-text-primary">{file.name}</p>
        ) : (
          <>
            <Icon name="Image" size={32} className="text-neutral-400" />
            <p className="text-sm text-text-secondary text-center">
              Drop your image here, or{' '}
              <span className="text-blue-500 font-medium underline cursor-pointer">
                click to browse
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function Demographics({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
}) {
  const d = values?.demographics || {};
  const [insurances, setInsurances] = useState([{ ...EMPTY_INSURANCE }]);

  const updateInsurance = (index, field, value) => {
    setInsurances((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addInsurance = () =>
    setInsurances((prev) => [...prev, { ...EMPTY_INSURANCE }]);

  return (
    <div className="flex flex-col gap-6">
      {/* ─── Demographics ─── */}
      <h3 className="text-base font-semibold text-text-primary">
        Demographics
      </h3>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="First Name"
          required
          name="demographics.firstName"
          placeholder="Enter"
          value={d.firstName || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Middle Name"
          name="demographics.middleName"
          placeholder="Enter"
          value={d.middleName || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Last Name"
          required
          name="demographics.lastName"
          placeholder="Enter"
          value={d.lastName || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <SelectDropdown
          label="Sex at Birth"
          required
          name="demographics.sexAtBirth"
          placeholder="Select"
          options={SEX_AT_BIRTH_OPTIONS}
          value={
            SEX_AT_BIRTH_OPTIONS.find((o) => o.value === d.sexAtBirth) || null
          }
          onChange={(opt) =>
            setFieldValue('demographics.sexAtBirth', opt?.value || '')
          }
        />
        <Input
          label="Date of Birth"
          required
          name="demographics.dateOfBirth"
          type="date"
          value={d.dateOfBirth || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <SelectDropdown
          label="Marital Status"
          name="demographics.maritalStatus"
          placeholder="Select"
          options={MARITAL_STATUS_OPTIONS}
          value={
            MARITAL_STATUS_OPTIONS.find((o) => o.value === d.maritalStatus) ||
            null
          }
          onChange={(opt) =>
            setFieldValue('demographics.maritalStatus', opt?.value || '')
          }
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <SelectDropdown
          label="Identified Gender"
          name="demographics.identifiedGender"
          placeholder="Select"
          options={IDENTIFIED_GENDER_OPTIONS}
          value={
            IDENTIFIED_GENDER_OPTIONS.find(
              (o) => o.value === d.identifiedGender,
            ) || null
          }
          onChange={(opt) =>
            setFieldValue('demographics.identifiedGender', opt?.value || '')
          }
        />
        <SelectDropdown
          label="Race / Ethnicity"
          name="demographics.raceEthnicity"
          placeholder="Select"
          options={RACE_ETHNICITY_OPTIONS}
          value={
            RACE_ETHNICITY_OPTIONS.find((o) => o.value === d.raceEthnicity) ||
            null
          }
          onChange={(opt) =>
            setFieldValue('demographics.raceEthnicity', opt?.value || '')
          }
        />
        <SelectDropdown
          label="Preferred Language"
          name="demographics.preferredLanguage"
          placeholder="Select"
          options={LANGUAGE_OPTIONS}
          value={
            LANGUAGE_OPTIONS.find((o) => o.value === d.preferredLanguage) ||
            null
          }
          onChange={(opt) =>
            setFieldValue('demographics.preferredLanguage', opt?.value || '')
          }
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Email Address"
          name="demographics.email"
          type="email"
          placeholder="Enter"
          value={d.email || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <PhoneInput
          label="Primary Contact Number"
          name="demographics.primaryPhone"
          value={d.primaryPhone || ''}
          onChange={(val) =>
            setFieldValue('demographics.primaryPhone', val || '')
          }
          onBlur={handleBlur}
          defaultCountry="US"
        />
        <PhoneInput
          label="Secondary Contact Number"
          name="demographics.secondaryPhone"
          value={d.secondaryPhone || ''}
          onChange={(val) =>
            setFieldValue('demographics.secondaryPhone', val || '')
          }
          onBlur={handleBlur}
          defaultCountry="US"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectDropdown
          label="Preferred Method of Contact"
          name="demographics.preferredContact"
          placeholder="Select"
          options={CONTACT_METHOD_OPTIONS}
          value={
            CONTACT_METHOD_OPTIONS.find(
              (o) => o.value === d.preferredContact,
            ) || null
          }
          onChange={(opt) =>
            setFieldValue('demographics.preferredContact', opt?.value || '')
          }
        />
        <SelectDropdown
          label="Pronouns"
          name="demographics.pronouns"
          placeholder="Select"
          options={PRONOUNS_OPTIONS}
          value={PRONOUNS_OPTIONS.find((o) => o.value === d.pronouns) || null}
          onChange={(opt) =>
            setFieldValue('demographics.pronouns', opt?.value || '')
          }
        />
      </div>

      {/* ─── Address Information ─── */}
      <h3 className="text-base font-semibold text-text-primary">
        Address Information
      </h3>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Address Line 1"
          required
          name="demographics.addressLine1"
          placeholder="Enter Address Line 1"
          value={d.addressLine1 || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Address Line 2"
          name="demographics.addressLine2"
          placeholder="Enter Address Line 2"
          value={d.addressLine2 || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <SelectDropdown
          label="State"
          required
          name="demographics.state"
          placeholder="Select State"
          options={STATE_OPTIONS}
          value={STATE_OPTIONS.find((o) => o.value === d.state) || null}
          onChange={(opt) =>
            setFieldValue('demographics.state', opt?.value || '')
          }
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <SelectDropdown
          label="City"
          required
          name="demographics.city"
          placeholder="Select State"
          options={CITY_OPTIONS}
          value={CITY_OPTIONS.find((o) => o.value === d.city) || null}
          onChange={(opt) =>
            setFieldValue('demographics.city', opt?.value || '')
          }
        />
        <Input
          label="ZIP CODE"
          required
          name="demographics.zipCode"
          placeholder="Enter ZIP CODE"
          value={d.zipCode || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <SelectDropdown
          label="County"
          name="demographics.county"
          placeholder="Select County"
          options={COUNTY_OPTIONS}
          value={COUNTY_OPTIONS.find((o) => o.value === d.county) || null}
          onChange={(opt) =>
            setFieldValue('demographics.county', opt?.value || '')
          }
        />
        <SelectDropdown
          label="Country"
          name="demographics.country"
          placeholder="Select County"
          options={COUNTRY_OPTIONS}
          value={COUNTRY_OPTIONS.find((o) => o.value === d.country) || null}
          onChange={(opt) =>
            setFieldValue('demographics.country', opt?.value || '')
          }
        />
      </div>

      {/* ─── Insurance ─── */}
      <h3 className="text-base font-semibold text-text-primary">Insurance</h3>

      <Checkbox
        label="I don't have Insurance"
        name="demographics.noInsurance"
        checked={!!d.noInsurance}
        onChange={(e) =>
          setFieldValue('demographics.noInsurance', e.target.checked)
        }
        variant="blue"
      />

      {!d.noInsurance &&
        insurances.map((ins, idx) => (
          <div key={idx} className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Insurance Type"
                required
                name={`insurance_${idx}_type`}
                placeholder="Enter"
                value={ins.insuranceType}
                onChange={(e) =>
                  updateInsurance(idx, 'insuranceType', e.target.value)
                }
              />
              <Input
                label="Insurance Name"
                required
                name={`insurance_${idx}_name`}
                placeholder="Enter"
                value={ins.insuranceName}
                onChange={(e) =>
                  updateInsurance(idx, 'insuranceName', e.target.value)
                }
              />
              <SelectDropdown
                label="Relationship to Insured"
                name={`insurance_${idx}_relationship`}
                placeholder="Select"
                options={RELATIONSHIP_TO_INSURED_OPTIONS}
                value={
                  RELATIONSHIP_TO_INSURED_OPTIONS.find(
                    (o) => o.value === ins.relationshipToInsured,
                  ) || null
                }
                onChange={(opt) =>
                  updateInsurance(
                    idx,
                    'relationshipToInsured',
                    opt?.value || '',
                  )
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Policy Holder Name"
                name={`insurance_${idx}_policyHolder`}
                placeholder="Enter"
                value={ins.policyHolderName}
                onChange={(e) =>
                  updateInsurance(idx, 'policyHolderName', e.target.value)
                }
              />
              <Input
                label="Insurance Effective Date"
                name={`insurance_${idx}_effectiveDate`}
                type="date"
                value={ins.insuranceEffectiveDate}
                onChange={(e) =>
                  updateInsurance(idx, 'insuranceEffectiveDate', e.target.value)
                }
              />
              <Input
                label="Policy Number"
                name={`insurance_${idx}_policyNumber`}
                placeholder="Enter"
                value={ins.policyNumber}
                onChange={(e) =>
                  updateInsurance(idx, 'policyNumber', e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Insured Group Plan"
                name={`insurance_${idx}_groupPlan`}
                placeholder="Enter"
                value={ins.insuredGroupPlan}
                onChange={(e) =>
                  updateInsurance(idx, 'insuredGroupPlan', e.target.value)
                }
              />
              <Input
                label="Employer/ School Name"
                name={`insurance_${idx}_employer`}
                placeholder="Enter"
                value={ins.employerSchoolName}
                onChange={(e) =>
                  updateInsurance(idx, 'employerSchoolName', e.target.value)
                }
              />
            </div>

            {/* Insured Address */}
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-text-primary">
                Insured Address
              </h4>
              <Checkbox
                label="Same as Primary Address"
                name={`insurance_${idx}_sameAddress`}
                checked={!!ins.sameAsPrimaryAddress}
                onChange={(e) =>
                  updateInsurance(idx, 'sameAsPrimaryAddress', e.target.checked)
                }
                variant="blue"
              />
            </div>

            {!ins.sameAsPrimaryAddress && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="Address Line 1"
                    name={`insurance_${idx}_addrLine1`}
                    placeholder="Enter Address Line 1"
                    value={ins.insuredAddressLine1}
                    onChange={(e) =>
                      updateInsurance(
                        idx,
                        'insuredAddressLine1',
                        e.target.value,
                      )
                    }
                  />
                  <Input
                    label="Address Line 2"
                    name={`insurance_${idx}_addrLine2`}
                    placeholder="Enter Address Line 1"
                    value={ins.insuredAddressLine2}
                    onChange={(e) =>
                      updateInsurance(
                        idx,
                        'insuredAddressLine2',
                        e.target.value,
                      )
                    }
                  />
                  <SelectDropdown
                    label="State"
                    name={`insurance_${idx}_state`}
                    placeholder="Select State"
                    options={STATE_OPTIONS}
                    value={
                      STATE_OPTIONS.find((o) => o.value === ins.insuredState) ||
                      null
                    }
                    onChange={(opt) =>
                      updateInsurance(idx, 'insuredState', opt?.value || '')
                    }
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <SelectDropdown
                    label="City"
                    name={`insurance_${idx}_city`}
                    placeholder="Select City"
                    options={CITY_OPTIONS}
                    value={
                      CITY_OPTIONS.find((o) => o.value === ins.insuredCity) ||
                      null
                    }
                    onChange={(opt) =>
                      updateInsurance(idx, 'insuredCity', opt?.value || '')
                    }
                  />
                  <Input
                    label="ZIP CODE"
                    name={`insurance_${idx}_zip`}
                    placeholder="Enter ZIP CODE"
                    value={ins.insuredZipCode}
                    onChange={(e) =>
                      updateInsurance(idx, 'insuredZipCode', e.target.value)
                    }
                  />
                  <SelectDropdown
                    label="County"
                    name={`insurance_${idx}_county`}
                    placeholder="Select County"
                    options={COUNTY_OPTIONS}
                    value={
                      COUNTY_OPTIONS.find(
                        (o) => o.value === ins.insuredCounty,
                      ) || null
                    }
                    onChange={(opt) =>
                      updateInsurance(idx, 'insuredCounty', opt?.value || '')
                    }
                  />
                </div>
              </>
            )}

            {/* Upload Insurance Card */}
            <h4 className="text-sm font-semibold text-text-primary">
              Upload Insurance Card
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <UploadBox
                label="Front Side"
                file={ins.insuranceCardFront}
                onFileChange={(f) =>
                  updateInsurance(idx, 'insuranceCardFront', f)
                }
              />
              <UploadBox
                label="Back Side"
                file={ins.insuranceCardBack}
                onFileChange={(f) =>
                  updateInsurance(idx, 'insuranceCardBack', f)
                }
              />
            </div>
          </div>
        ))}

      {!d.noInsurance && (
        <button
          type="button"
          onClick={addInsurance}
          className="flex items-center gap-1 text-sm text-blue-500 font-medium w-fit hover:underline"
        >
          <span className="text-base leading-none font-bold">+</span> Add
          Another Insurance
        </button>
      )}

      {/* ─── Identifiers ─── */}
      <h3 className="text-base font-semibold text-text-primary">Identifiers</h3>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="SSN"
          name="demographics.ssn"
          placeholder="Enter"
          value={d.ssn || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Provider MRN"
          name="demographics.providerMrn"
          placeholder="Enter"
          value={d.providerMrn || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Hospital MRN"
          name="demographics.hospitalMrn"
          placeholder="Enter"
          value={d.hospitalMrn || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Community MPI"
          name="demographics.communityMpi"
          placeholder="Enter"
          value={d.communityMpi || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Other Identifier 1"
          name="demographics.otherIdentifier1"
          placeholder="Enter"
          value={d.otherIdentifier1 || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Other Identifier 2"
          name="demographics.otherIdentifier2"
          placeholder="Enter"
          value={d.otherIdentifier2 || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      {/* ─── Other ─── */}
      <h3 className="text-base font-semibold text-text-primary">Other</h3>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-text-primary">
            1. Do you have Internet access?
          </p>
          <RadioGroup
            name="demographics.hasInternetAccess"
            options={YES_NO}
            value={d.hasInternetAccess || ''}
            onChange={(val) =>
              setFieldValue('demographics.hasInternetAccess', val)
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-text-primary">
            2. Do you have a Smart Phone?
          </p>
          <RadioGroup
            name="demographics.hasSmartPhone"
            options={YES_NO}
            value={d.hasSmartPhone || ''}
            onChange={(val) => setFieldValue('demographics.hasSmartPhone', val)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-text-primary">3. Preferred Contact</p>
          <RadioGroup
            name="demographics.preferredContactMethod"
            options={PREFERRED_CONTACT_RADIO}
            value={d.preferredContactMethod || ''}
            onChange={(val) =>
              setFieldValue('demographics.preferredContactMethod', val)
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-text-primary">
            4. If there are new programs or research opportunities to
            participate in would you like to hear about them?
          </p>
          <RadioGroup
            name="demographics.interestedInPrograms"
            options={YES_NO}
            value={d.interestedInPrograms || ''}
            onChange={(val) =>
              setFieldValue('demographics.interestedInPrograms', val)
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-text-primary">
            5. Would you be interested in working part time as a patient advisor
            to help prioritize ideas to improve healthcare for your clinic and
            community?
          </p>
          <RadioGroup
            name="demographics.interestedInAdvisory"
            options={YES_NO}
            value={d.interestedInAdvisory || ''}
            onChange={(val) =>
              setFieldValue('demographics.interestedInAdvisory', val)
            }
          />
        </div>

        <Checkbox
          label="Information in above section has been confirmed"
          name="demographics.informationConfirmed"
          checked={!!d.informationConfirmed}
          onChange={(e) =>
            setFieldValue('demographics.informationConfirmed', e.target.checked)
          }
          variant="blue"
        />
      </div>
    </div>
  );
}
