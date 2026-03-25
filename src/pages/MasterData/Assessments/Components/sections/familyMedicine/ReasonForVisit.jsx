import Input from "@/components/commonComponents/input/Input";
import TextArea from "@/components/commonComponents/textArea/index";

export default function ReasonForVisit({ values, handleChange, handleBlur }) {
  const r = values?.reasonForVisit || {};

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-text-primary">1. What brings you in today?</p>
          <Input
            name="reasonForVisit.bringsYouIn"
            placeholder="Type here"
            value={r.bringsYouIn || ""}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-text-primary">2. What matters most to you in your health and life?</p>
          <Input
            name="reasonForVisit.mattersToYou"
            placeholder="Type here"
            value={r.mattersToYou || ""}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-text-primary">3. Top 3 health goals for the next 6–12 months:</p>
          <TextArea
            name="reasonForVisit.healthGoals"
            placeholder="Type here..."
            value={r.healthGoals || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}
