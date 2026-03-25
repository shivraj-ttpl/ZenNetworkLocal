import Checkbox from "@/components/commonComponents/checkbox/Checkbox";
import Input from "@/components/commonComponents/input/Input";

const UNABLE_TO_GET_OPTIONS = [
  { key: "food", label: "Food" },
  { key: "clothing", label: "Clothing" },
  { key: "utilities", label: "Utilities" },
  { key: "childCare", label: "Child Care" },
  { key: "medicineHealthCare", label: "Medicine or Any Health Care (Medical, Dental, Mental Health, Vision)" },
  { key: "phone", label: "Phone" },
];

const TRANSPORTATION_OPTIONS = [
  "Yes, it has kept me from medical appointments",
  "Yes, it has kept me from non-medical meetings, appointments, work, or from getting things that I need",
  "No",
  "I choose not to answer this question",
];

const EDUCATION_OPTIONS = [
  "Less than high school degree",
  "High school diploma or GED",
  "More than high school",
  "I choose not to answer this question",
];

const WORK_OPTIONS = [
  "Unemployed",
  "Part-time or temporary work",
  "Full-time work",
];

const INSURANCE_OPTIONS = [
  { key: "noneUninsured", label: "None/uninsured" },
  { key: "medicaid", label: "Medicaid" },
  { key: "chipMedicaid", label: "CHIP Medicaid" },
  { key: "medicare", label: "Medicare" },
  { key: "otherPublicNotChip", label: "Other public insurance (not CHIP)" },
  { key: "otherPublicChip", label: "Other public insurance (CHIP)" },
  { key: "privateInsurance", label: "Private Insurance" },
];

export default function MoneyAndResources({ values, handleChange, setFieldValue }) {
  const mr = values?.moneyAndResources || {};

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">Money &amp; Resources</h3>

      {/* 1. Education */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          1. What is the highest level of school that you have finished?
        </p>
        {EDUCATION_OPTIONS.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="moneyAndResources.education"
              value={opt}
              checked={mr.education === opt}
              onChange={handleChange}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>

      {/* 2. Work situation */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          2. What is your current work situation?
        </p>
        {WORK_OPTIONS.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="moneyAndResources.work"
              value={opt}
              checked={mr.work === opt}
              onChange={handleChange}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="radio"
            name="moneyAndResources.work"
            value="otherwiseUnemployed"
            checked={mr.work === "otherwiseUnemployed"}
            onChange={handleChange}
            className="w-4 h-4 accent-primary mt-0.5"
          />
          <span className="text-sm">
            Otherwise unemployed but not seeking work (ex: student, retired, disabled, unpaid
            primary care giver) Please write:
          </span>
        </label>
        {mr.work === "otherwiseUnemployed" && (
          <div className="ml-6">
            <Input
              name="moneyAndResources.workOtherSpecify"
              placeholder="Type here"
              value={mr.workOtherSpecify || ""}
              onChange={handleChange}
            />
          </div>
        )}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="moneyAndResources.work"
            value="chooseNotToAnswer"
            checked={mr.work === "chooseNotToAnswer"}
            onChange={handleChange}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm">I choose not to answer this question</span>
        </label>
      </div>

      {/* 3. Insurance */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          3. What is your main insurance?
        </p>
        {INSURANCE_OPTIONS.map((opt) => (
          <Checkbox
            key={opt.key}
            name={`moneyAndResources.insurance.${opt.key}`}
            label={opt.label}
            checked={!!mr.insurance?.[opt.key]}
            onChange={() =>
              setFieldValue(`moneyAndResources.insurance.${opt.key}`, !mr.insurance?.[opt.key])
            }
          />
        ))}
      </div>

      {/* 4. Income */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          4. During the past year, what was the total combined income for you and the family
          members you live with? This information will help us determine if you are eligible for
          any benefits.
        </p>
        <Input
          name="moneyAndResources.income"
          placeholder=""
          value={mr.income || ""}
          onChange={handleChange}
        />
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="moneyAndResources.incomeDecline"
            value="decline"
            checked={mr.incomeDecline === "decline"}
            onChange={handleChange}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm">I choose not to answer this question</span>
        </label>
      </div>

      {/* 5. Unable to get necessities */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          5. In the past year, have you or any family members you live with been unable to get
          any of the following when it was really needed? Check all that apply.
        </p>
        {UNABLE_TO_GET_OPTIONS.map((opt) => (
          <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="moneyAndResources.unableToGet"
              value={opt.key}
              checked={mr.unableToGet === opt.key}
              onChange={handleChange}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">{opt.label}</span>
          </label>
        ))}
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="radio"
            name="moneyAndResources.unableToGet"
            value="other"
            checked={mr.unableToGet === "other"}
            onChange={handleChange}
            className="w-4 h-4 accent-primary mt-0.5"
          />
          <span className="text-sm">Other (please write):</span>
        </label>
        {mr.unableToGet === "other" && (
          <div className="ml-6">
            <Input
              name="moneyAndResources.unableToGetOther"
              placeholder=""
              value={mr.unableToGetOther || ""}
              onChange={handleChange}
            />
          </div>
        )}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="moneyAndResources.unableToGet"
            value="chooseNotToAnswer"
            checked={mr.unableToGet === "chooseNotToAnswer"}
            onChange={handleChange}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm">I choose not to answer this question</span>
        </label>
      </div>

      {/* 6. Transportation */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          6. Has lack of transportation kept you from medical appointments, meetings, work, or
          from getting things needed for daily living? Check all that apply.
        </p>
        {TRANSPORTATION_OPTIONS.map((opt) => (
          <label key={opt} className="flex items-start gap-2 cursor-pointer">
            <input
              type="radio"
              name="moneyAndResources.transportation"
              value={opt}
              checked={mr.transportation === opt}
              onChange={handleChange}
              className="w-4 h-4 accent-primary mt-0.5"
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
