import Input from "@/components/commonComponents/input/Input";
import PhoneInput from "@/components/commonComponents/phoneInput";
import SelectDropdown from "@/components/commonComponents/selectDropdown/SelectDropdown";

const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const PRONOUNS_OPTIONS = [
  { label: "He/Him", value: "heHim" },
  { label: "She/Her", value: "sheHer" },
  { label: "They/Them", value: "theyThem" },
  { label: "Other", value: "other" },
];

const LANGUAGE_OPTIONS = [
  { label: "English", value: "english" },
  { label: "Spanish", value: "spanish" },
  { label: "Chinese", value: "chinese" },
  { label: "French", value: "french" },
  { label: "Other", value: "other" },
];

const INSURANCE_OPTIONS = [
  { label: "Medicare", value: "medicare" },
  { label: "Medicaid", value: "medicaid" },
  { label: "Private", value: "private" },
  { label: "Self-Pay", value: "selfPay" },
  { label: "Other", value: "other" },
];

export default function Demographics({ values, handleChange, handleBlur, setFieldValue }) {
  const d = values?.demographics || {};

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">Demographics</h3>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Name"
          name="demographics.name"
          placeholder="Enter Name"
          value={d.name || ""}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Due Date"
          name="demographics.dueDate"
          type="date"
          placeholder="Select Date"
          value={d.dueDate || ""}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectDropdown
          label="Sex at Birth"
          name="demographics.gender"
          placeholder="Select Gender"
          options={GENDER_OPTIONS}
          value={GENDER_OPTIONS.find((o) => o.value === d.gender) || null}
          onChange={(opt) => setFieldValue("demographics.gender", opt?.value || "")}
        />
        <SelectDropdown
          label="Pronouns"
          name="demographics.pronouns"
          placeholder="Select Pronouns"
          options={PRONOUNS_OPTIONS}
          value={PRONOUNS_OPTIONS.find((o) => o.value === d.pronouns) || null}
          onChange={(opt) => setFieldValue("demographics.pronouns", opt?.value || "")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <PhoneInput
          label="Contact Number"
          name="demographics.phone"
          value={d.phone || ""}
          onChange={(val) => setFieldValue("demographics.phone", val || "")}
          onBlur={handleBlur}
          defaultCountry="US"
        />
        <Input
          label="Email Address"
          name="demographics.email"
          type="email"
          placeholder="Enter Email Address"
          value={d.email || ""}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectDropdown
          label="Preferred Language"
          name="demographics.language"
          placeholder="Select Language"
          options={LANGUAGE_OPTIONS}
          value={LANGUAGE_OPTIONS.find((o) => o.value === d.language) || null}
          onChange={(opt) => setFieldValue("demographics.language", opt?.value || "")}
        />
        <SelectDropdown
          label="Insurance"
          name="demographics.insurance"
          placeholder="Select Insurance"
          options={INSURANCE_OPTIONS}
          value={INSURANCE_OPTIONS.find((o) => o.value === d.insurance) || null}
          onChange={(opt) => setFieldValue("demographics.insurance", opt?.value || "")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Insurance Plan"
          name="demographics.insurancePlan"
          placeholder="Enter Insurance Plan"
          value={d.insurancePlan || ""}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Insurance ID"
          name="demographics.insuranceId"
          placeholder="Enter Insurance ID"
          value={d.insuranceId || ""}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      {/* Insurance Section */}
      <h3 className="text-base font-semibold text-text-primary">Insurance</h3>

      <SelectDropdown
        label="Insurance"
        name="demographics.secondaryInsurance"
        placeholder="Select Insurance"
        options={INSURANCE_OPTIONS}
        value={INSURANCE_OPTIONS.find((o) => o.value === d.secondaryInsurance) || null}
        onChange={(opt) => setFieldValue("demographics.secondaryInsurance", opt?.value || "")}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Insurance Plan"
          name="demographics.secondaryInsurancePlan"
          placeholder="Enter Insurance Plan"
          value={d.secondaryInsurancePlan || ""}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Insurance ID"
          name="demographics.secondaryInsuranceId"
          placeholder="Enter Insurance ID"
          value={d.secondaryInsuranceId || ""}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      {/* Primary Address Section */}
      <h3 className="text-base font-semibold text-text-primary">Primary Address</h3>

      <Input
        label="Address Line 1"
        name="demographics.addressLine1"
        placeholder="Enter"
        value={d.addressLine1 || ""}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <Input
        label="Address Line 2"
        name="demographics.addressLine2"
        placeholder="Enter"
        value={d.addressLine2 || ""}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="City"
          name="demographics.city"
          placeholder="Enter City"
          value={d.city || ""}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="State"
          name="demographics.state"
          placeholder="Enter State"
          value={d.state || ""}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Zip Code"
          name="demographics.zipCode"
          placeholder="Enter Zip Code"
          value={d.zipCode || ""}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
}
