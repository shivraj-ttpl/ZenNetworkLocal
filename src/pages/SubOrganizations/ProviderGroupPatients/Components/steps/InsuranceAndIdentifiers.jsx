import { FieldArray } from "formik";
import Input from "@/components/commonComponents/input/Input";
import SelectDropdown from "@/components/commonComponents/selectDropdown/SelectDropdown";
import Checkbox from "@/components/commonComponents/checkbox/Checkbox";
import FileUpload from "@/components/commonComponents/upload/FileUpload";
import Icon from "@/components/icons/Icon";
import {
  FORM_FIELDS_NAMES,
  INSURANCE_TYPE_OPTIONS,
  INSURANCE_NAME_OPTIONS,
  RELATIONSHIP_TO_INSURED_OPTIONS,
  STATE_OPTIONS,
  COUNTY_OPTIONS,
  COUNTRY_OPTIONS,
} from "../../constant";

const emptyInsurance = {
  [FORM_FIELDS_NAMES.INS_NO_INSURANCE]: false,
  [FORM_FIELDS_NAMES.INS_MARK_PRIMARY]: false,
  [FORM_FIELDS_NAMES.INS_TYPE]: null,
  [FORM_FIELDS_NAMES.INS_NAME]: null,
  [FORM_FIELDS_NAMES.INS_RELATIONSHIP]: null,
  [FORM_FIELDS_NAMES.INS_POLICY_HOLDER]: "",
  [FORM_FIELDS_NAMES.INS_EFFECTIVE_DATE]: "",
  [FORM_FIELDS_NAMES.INS_POLICY_NUMBER]: "",
  [FORM_FIELDS_NAMES.INS_GROUP_PLAN]: "",
  [FORM_FIELDS_NAMES.INS_EMPLOYER]: "",
};

export { emptyInsurance };

export default function InsuranceAndIdentifiers({ values, errors, touched, handleChange, handleBlur, setFieldValue }) {
  const handleSameAsPrimary = (checked) => {
    setFieldValue(FORM_FIELDS_NAMES.INS_SAME_AS_PRIMARY, checked);
    if (checked) {
      setFieldValue(FORM_FIELDS_NAMES.INS_ADDRESS_LINE_1, values[FORM_FIELDS_NAMES.ADDRESS_LINE_1] || "");
      setFieldValue(FORM_FIELDS_NAMES.INS_ADDRESS_LINE_2, values[FORM_FIELDS_NAMES.ADDRESS_LINE_2] || "");
      setFieldValue(FORM_FIELDS_NAMES.INS_STATE, values[FORM_FIELDS_NAMES.STATE]);
      setFieldValue(FORM_FIELDS_NAMES.INS_CITY, values[FORM_FIELDS_NAMES.CITY]);
      setFieldValue(FORM_FIELDS_NAMES.INS_ZIP_CODE, values[FORM_FIELDS_NAMES.ZIP_CODE] || "");
      setFieldValue(FORM_FIELDS_NAMES.INS_COUNTY, values[FORM_FIELDS_NAMES.COUNTY]);
      setFieldValue(FORM_FIELDS_NAMES.INS_COUNTRY, values[FORM_FIELDS_NAMES.COUNTRY]);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Insurance */}
      <h4 className="text-base font-semibold text-text-primary">Insurance</h4>

      <FieldArray name={FORM_FIELDS_NAMES.INSURANCES}>
        {({ push, remove }) => (
          <div className="flex flex-col gap-5">
            {values[FORM_FIELDS_NAMES.INSURANCES]?.map((insurance, index) => {
              const prefix = `${FORM_FIELDS_NAMES.INSURANCES}[${index}]`;
              return (
                <div key={index} className="flex flex-col gap-4 border border-border-light rounded-lg p-4 relative">
                  {values[FORM_FIELDS_NAMES.INSURANCES].length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-error-500 cursor-pointer"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  )}

                  <div className="flex items-center justify-between">
                    <Checkbox
                      label="I don't have Insurance"
                      checked={insurance[FORM_FIELDS_NAMES.INS_NO_INSURANCE]}
                      onChange={(e) => setFieldValue(`${prefix}.${FORM_FIELDS_NAMES.INS_NO_INSURANCE}`, e.target.checked)}
                      variant="teal"
                      size="sm"
                    />
                    <Checkbox
                      label="Mark as Primary Insurance"
                      checked={insurance[FORM_FIELDS_NAMES.INS_MARK_PRIMARY]}
                      onChange={(e) => setFieldValue(`${prefix}.${FORM_FIELDS_NAMES.INS_MARK_PRIMARY}`, e.target.checked)}
                      variant="teal"
                      size="sm"
                    />
                  </div>

                  {!insurance[FORM_FIELDS_NAMES.INS_NO_INSURANCE] && (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        <SelectDropdown
                          label="Insurance Type"
                          name={`${prefix}.${FORM_FIELDS_NAMES.INS_TYPE}`}
                          placeholder="Select Insurance Type"
                          options={INSURANCE_TYPE_OPTIONS}
                          value={insurance[FORM_FIELDS_NAMES.INS_TYPE]}
                          onChange={(selected) => setFieldValue(`${prefix}.${FORM_FIELDS_NAMES.INS_TYPE}`, selected)}
                          isRequired
                        />
                        <SelectDropdown
                          label="Insurance Name"
                          name={`${prefix}.${FORM_FIELDS_NAMES.INS_NAME}`}
                          placeholder="Select Insurance Name"
                          options={INSURANCE_NAME_OPTIONS}
                          value={insurance[FORM_FIELDS_NAMES.INS_NAME]}
                          onChange={(selected) => setFieldValue(`${prefix}.${FORM_FIELDS_NAMES.INS_NAME}`, selected)}
                          isRequired
                        />
                        <SelectDropdown
                          label="Relationship to Insured"
                          name={`${prefix}.${FORM_FIELDS_NAMES.INS_RELATIONSHIP}`}
                          placeholder="Select Relationship to Insured"
                          options={RELATIONSHIP_TO_INSURED_OPTIONS}
                          value={insurance[FORM_FIELDS_NAMES.INS_RELATIONSHIP]}
                          onChange={(selected) => setFieldValue(`${prefix}.${FORM_FIELDS_NAMES.INS_RELATIONSHIP}`, selected)}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <Input
                          label="Policy Holder Name"
                          name={`${prefix}.${FORM_FIELDS_NAMES.INS_POLICY_HOLDER}`}
                          placeholder="Enter Policy Holder Name"
                          value={insurance[FORM_FIELDS_NAMES.INS_POLICY_HOLDER]}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <Input
                          label="Insurance Effective Date"
                          name={`${prefix}.${FORM_FIELDS_NAMES.INS_EFFECTIVE_DATE}`}
                          placeholder="MM/DD/YYYY"
                          type="date"
                          value={insurance[FORM_FIELDS_NAMES.INS_EFFECTIVE_DATE]}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <Input
                          label="Policy Number"
                          name={`${prefix}.${FORM_FIELDS_NAMES.INS_POLICY_NUMBER}`}
                          placeholder="Enter Policy Number"
                          value={insurance[FORM_FIELDS_NAMES.INS_POLICY_NUMBER]}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Insured Group Plan"
                          name={`${prefix}.${FORM_FIELDS_NAMES.INS_GROUP_PLAN}`}
                          placeholder="Enter Insured Group Plan"
                          value={insurance[FORM_FIELDS_NAMES.INS_GROUP_PLAN]}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <Input
                          label="Employer/ School Name"
                          name={`${prefix}.${FORM_FIELDS_NAMES.INS_EMPLOYER}`}
                          placeholder="Enter Employer/ School Name"
                          value={insurance[FORM_FIELDS_NAMES.INS_EMPLOYER]}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => push({ ...emptyInsurance })}
              className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 cursor-pointer w-fit"
            >
              <Icon name="Plus" size={16} />
              Add Another Insurance
            </button>
          </div>
        )}
      </FieldArray>

      {/* Insured Address */}
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold text-text-primary">Insured Address</h4>
        <Checkbox
          label="Same as Primary Address"
          checked={values[FORM_FIELDS_NAMES.INS_SAME_AS_PRIMARY]}
          onChange={(e) => handleSameAsPrimary(e.target.checked)}
          variant="teal"
          size="sm"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Address Line 1"
          name={FORM_FIELDS_NAMES.INS_ADDRESS_LINE_1}
          placeholder="Enter Address Line 1"
          value={values[FORM_FIELDS_NAMES.INS_ADDRESS_LINE_1]}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={values[FORM_FIELDS_NAMES.INS_SAME_AS_PRIMARY]}
        />
        <Input
          label="Address Line 2"
          name={FORM_FIELDS_NAMES.INS_ADDRESS_LINE_2}
          placeholder="Enter Address Line 2"
          value={values[FORM_FIELDS_NAMES.INS_ADDRESS_LINE_2]}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={values[FORM_FIELDS_NAMES.INS_SAME_AS_PRIMARY]}
        />
        <SelectDropdown
          label="State"
          name={FORM_FIELDS_NAMES.INS_STATE}
          placeholder="Select State"
          options={STATE_OPTIONS}
          value={values[FORM_FIELDS_NAMES.INS_STATE]}
          onChange={(selected) => setFieldValue(FORM_FIELDS_NAMES.INS_STATE, selected)}
          isDisabled={values[FORM_FIELDS_NAMES.INS_SAME_AS_PRIMARY]}
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <SelectDropdown
          label="City"
          name={FORM_FIELDS_NAMES.INS_CITY}
          placeholder="Select City"
          options={STATE_OPTIONS}
          value={values[FORM_FIELDS_NAMES.INS_CITY]}
          onChange={(selected) => setFieldValue(FORM_FIELDS_NAMES.INS_CITY, selected)}
          isDisabled={values[FORM_FIELDS_NAMES.INS_SAME_AS_PRIMARY]}
        />
        <Input
          label="ZIP CODE"
          name={FORM_FIELDS_NAMES.INS_ZIP_CODE}
          placeholder="Enter ZIP CODE"
          value={values[FORM_FIELDS_NAMES.INS_ZIP_CODE]}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={values[FORM_FIELDS_NAMES.INS_SAME_AS_PRIMARY]}
        />
        <SelectDropdown
          label="County"
          name={FORM_FIELDS_NAMES.INS_COUNTY}
          placeholder="Select County"
          options={COUNTY_OPTIONS}
          value={values[FORM_FIELDS_NAMES.INS_COUNTY]}
          onChange={(selected) => setFieldValue(FORM_FIELDS_NAMES.INS_COUNTY, selected)}
          isDisabled={values[FORM_FIELDS_NAMES.INS_SAME_AS_PRIMARY]}
        />
        <SelectDropdown
          label="Country"
          name={FORM_FIELDS_NAMES.INS_COUNTRY}
          placeholder="Select Country"
          options={COUNTRY_OPTIONS}
          value={values[FORM_FIELDS_NAMES.INS_COUNTRY]}
          onChange={(selected) => setFieldValue(FORM_FIELDS_NAMES.INS_COUNTRY, selected)}
          isDisabled={values[FORM_FIELDS_NAMES.INS_SAME_AS_PRIMARY]}
        />
      </div>

      {/* Upload Insurance Card */}
      <h4 className="text-base font-semibold text-text-primary">Upload Insurance Card</h4>

      <div className="grid grid-cols-2 gap-4">
        <FileUpload
          name={FORM_FIELDS_NAMES.INS_CARD_FRONT}
          label="Front Side"
          allowedFileTypes={[".png", ".jpg", ".pdf"]}
          maxFileSize={5}
          onFileSelect={(file) => setFieldValue(FORM_FIELDS_NAMES.INS_CARD_FRONT, file)}
          description="png, .jpg, .pdf, up to 5MB"
        />
        <FileUpload
          name={FORM_FIELDS_NAMES.INS_CARD_BACK}
          label="Back Side"
          allowedFileTypes={[".png", ".jpg", ".pdf"]}
          maxFileSize={5}
          onFileSelect={(file) => setFieldValue(FORM_FIELDS_NAMES.INS_CARD_BACK, file)}
          description="png, .jpg, .pdf, up to 5MB"
        />
      </div>

      {/* Identifiers */}
      <h4 className="text-base font-semibold text-text-primary">Identifiers</h4>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="SSN"
          name={FORM_FIELDS_NAMES.SSN}
          placeholder="XXX-XX-XXXX"
          value={values[FORM_FIELDS_NAMES.SSN]}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Provider MRN"
          name={FORM_FIELDS_NAMES.PROVIDER_MRN}
          placeholder="Enter Provider MRN"
          value={values[FORM_FIELDS_NAMES.PROVIDER_MRN]}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Hospital MRN"
          name={FORM_FIELDS_NAMES.HOSPITAL_MRN}
          placeholder="Enter Hospital MRN"
          value={values[FORM_FIELDS_NAMES.HOSPITAL_MRN]}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Community MPI"
          name={FORM_FIELDS_NAMES.COMMUNITY_MPI}
          placeholder="Enter Community MPI"
          value={values[FORM_FIELDS_NAMES.COMMUNITY_MPI]}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Other Identifier 1"
          name={FORM_FIELDS_NAMES.OTHER_IDENTIFIER_1}
          placeholder="Enter Other Identifier 1"
          value={values[FORM_FIELDS_NAMES.OTHER_IDENTIFIER_1]}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Other Identifier 2"
          name={FORM_FIELDS_NAMES.OTHER_IDENTIFIER_2}
          placeholder="Enter Other Identifier 2"
          value={values[FORM_FIELDS_NAMES.OTHER_IDENTIFIER_2]}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
}
