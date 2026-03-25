import Input from "@/components/commonComponents/input/Input";
import SelectDropdown from "@/components/commonComponents/selectDropdown/SelectDropdown";
import { COUNTRY_OPTIONS, STATE_OPTIONS } from "../../../constant";

const YES_NO_CHOOSE = ["Yes", "No", "I choose not to answer this question"];

const HOUSING_OPTIONS = [
  "I have housing",
  "I do not have housing (staying with others, in a hotel, in a shelter, living outside on the street, on a beach, in a car, or in a park)",
  "I choose not to answer this question",
];

export default function FamilyAndHome({ values, handleChange, setFieldValue }) {
  const fh = values?.familyAndHome || {};

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">Family &amp; Home</h3>

      {/* 1. Family members */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          1. How many family members, including yourself, do you currently live with?
        </p>
        <Input
          name="familyAndHome.familyMembers"
          placeholder="e.g. 2"
          value={fh.familyMembers || ""}
          onChange={handleChange}
        />
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="familyAndHome.familyMembersDecline"
            value="decline"
            checked={fh.familyMembersDecline === "decline"}
            onChange={handleChange}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm">I choose not to answer this question</span>
        </label>
      </div>

      {/* 2. Housing situation */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          2. What is your housing situation today?
        </p>
        {HOUSING_OPTIONS.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="familyAndHome.housing"
              value={opt}
              checked={fh.housing === opt}
              onChange={handleChange}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>

      {/* 3. Worried about losing housing */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          3. Are you worried about losing your housing?
        </p>
        {YES_NO_CHOOSE.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="familyAndHome.worriedHousing"
              value={opt}
              checked={fh.worriedHousing === opt}
              onChange={handleChange}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>

      {/* 4. Address */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          4. What address do you live at?
        </p>
        <div className="grid grid-cols-2 gap-4">
          <SelectDropdown
            label="Country"
            name="familyAndHome.country"
            placeholder="Select Country"
            options={COUNTRY_OPTIONS}
            value={fh.country || null}
            onChangeCb={(val) => setFieldValue("familyAndHome.country", val)}
          />
          <SelectDropdown
            label="State"
            name="familyAndHome.state"
            placeholder="Select State"
            options={STATE_OPTIONS}
            value={fh.state || null}
            onChangeCb={(val) => setFieldValue("familyAndHome.state", val)}
          />
          <Input
            label="City"
            name="familyAndHome.city"
            placeholder="Enter City"
            value={fh.city || ""}
            onChange={handleChange}
          />
          <Input
            label="ZIP CODE Code"
            name="familyAndHome.zipCode"
            placeholder="Enter Zip Code Code"
            value={fh.zipCode || ""}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}
