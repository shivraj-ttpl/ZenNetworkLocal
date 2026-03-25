import Input from "@/components/commonComponents/input/Input";

export default function CurrentStateQuestions({ values, handleChange, handleBlur }) {
  return (
    <div className="flex flex-col gap-6">
      {/* a. Life Goals */}
      <div className="flex flex-col">
        <SectionHeader title="a. Life Goals - What Life Goals are Most Important to you" />

        <div className="flex flex-col gap-5 pt-5">
          <RadioQuestion
            number={1}
            label="Live as long as possible"
            name="lifeGoals.liveAsLong"
            value={values?.lifeGoals?.liveAsLong}
            onChange={handleChange}
          />
          <RadioQuestion
            number={2}
            label="Have a good quality of life"
            name="lifeGoals.goodQuality"
            value={values?.lifeGoals?.goodQuality}
            onChange={handleChange}
          />
          <RadioQuestion
            number={3}
            label="Live the way I want even if it cuts my life short"
            name="lifeGoals.liveMyWay"
            value={values?.lifeGoals?.liveMyWay}
            onChange={handleChange}
          />
          <RadioQuestion
            number={4}
            label="Being there for my family and friends"
            name="lifeGoals.beingThere"
            value={values?.lifeGoals?.beingThere}
            onChange={handleChange}
          />
          <RadioQuestion
            number={5}
            label="Avoid Diabetes Complications like Blindness, Stroke, Heart Attack, Kidney Failure and Amputation"
            name="lifeGoals.avoidComplications"
            value={values?.lifeGoals?.avoidComplications}
            onChange={handleChange}
          />

          {/* 6. Other */}
          <div className="flex flex-col gap-3">
            <RadioQuestion
              number={6}
              label="Other"
              name="lifeGoals.other"
              value={values?.lifeGoals?.other}
              onChange={handleChange}
            />
            <div className="ml-6">
              <p className="text-sm text-text-secondary mb-1.5">If yes,</p>
              <Input
                name="lifeGoals.otherSpecify"
                placeholder="Specify"
                value={values?.lifeGoals?.otherSpecify || ""}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </div>
        </div>
      </div>

      {/* b. Care Gap Questions */}
      <div className="flex flex-col">
        <SectionHeader title="b. Care Gap Questions" />

        <div className="flex flex-col gap-5 pt-5">
          {/* Q1 */}
          <div className="flex flex-col gap-3">
            <RadioQuestion
              number={1}
              label="Have you had a Hemoglobin A1C in the past 3 months?"
              name="careGapQuestions.hemoglobinA1C"
              value={values?.careGapQuestions?.hemoglobinA1C}
              onChange={handleChange}
              options={["Yes", "No", "Don't Know"]}
            />
            <div className="ml-6">
              <p className="text-sm text-text-secondary mb-1.5">What was your last HbA1C?</p>
              <Input
                name="careGapQuestions.lastHbA1C"
                placeholder="Specify"
                value={values?.careGapQuestions?.lastHbA1C || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className="max-w-md"
              />
            </div>
          </div>

          {/* Q2 */}
          <div className="flex flex-col gap-3">
            <RadioQuestion
              number={2}
              label="Have you had a urine albumin/creatinine ratio and an eGFR in the past year?"
              name="careGapQuestions.urineAlbumin"
              value={values?.careGapQuestions?.urineAlbumin}
              onChange={handleChange}
              options={["Yes", "No", "Don't Know"]}
            />
            <div className="ml-6">
              <RadioQuestion
                label="Was it in normal range?"
                name="careGapQuestions.urineAlbuminNormal"
                value={values?.careGapQuestions?.urineAlbuminNormal}
                onChange={handleChange}
                options={["Yes", "No", "Don't Know"]}
              />
            </div>
            <div className="ml-6">
              <RadioQuestion
                label="If no Are you taking medications to delay kidney failure?"
                name="careGapQuestions.kidneyMedication"
                value={values?.careGapQuestions?.kidneyMedication}
                onChange={handleChange}
                options={["Yes", "No", "Don't Know"]}
              />
            </div>
          </div>

          {/* Q3 */}
          <div className="flex flex-col gap-3">
            <RadioQuestion
              number={3}
              label="Have you had your cholesterol/lipids checked in the past year?"
              name="careGapQuestions.cholesterol"
              value={values?.careGapQuestions?.cholesterol}
              onChange={handleChange}
              options={["Yes", "No", "Don't Know"]}
            />
            <div className="ml-6">
              <p className="text-sm text-text-secondary mb-1.5">What was your last LDL?</p>
              <Input
                name="careGapQuestions.lastLDL"
                placeholder="Specify"
                value={values?.careGapQuestions?.lastLDL || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className="max-w-md"
              />
            </div>
          </div>

          {/* Q4 */}
          <div className="flex flex-col gap-3">
            <RadioQuestion
              number={4}
              label="Have you had a retinal eye exam in the past year?"
              name="careGapQuestions.retinalExam"
              value={values?.careGapQuestions?.retinalExam}
              onChange={handleChange}
              options={["Yes", "No", "Don't Know"]}
            />
            <div className="ml-6">
              <RadioQuestion
                label="Did you have retinopathy"
                name="careGapQuestions.retinopathy"
                value={values?.careGapQuestions?.retinopathy}
                onChange={handleChange}
                options={["Yes", "No", "Don't Know"]}
              />
            </div>
          </div>

          {/* Q5 */}
          <RadioQuestion
            number={5}
            label="Are you taking a Statin medication to prevent Cardiovascular disease?"
            name="careGapQuestions.statinMedication"
            value={values?.careGapQuestions?.statinMedication}
            onChange={handleChange}
            options={["Yes", "No", "Don't Know"]}
          />

          {/* Q6 */}
          <div className="flex flex-col gap-3">
            <RadioQuestion
              number={6}
              label="Have you had a foot exam in the past year to check for Neuropathy"
              name="careGapQuestions.footExam"
              value={values?.careGapQuestions?.footExam}
              onChange={handleChange}
              options={["Yes", "No", "Don't Know"]}
            />
            <div className="ml-6">
              <RadioQuestion
                label="Do you have numbness in your feet?"
                name="careGapQuestions.footNumbness"
                value={values?.careGapQuestions?.footNumbness}
                onChange={handleChange}
                options={["Yes", "No", "Don't Know"]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <div className="bg-neutral-100 px-4 py-2.5 -mx-6">
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
    </div>
  );
}

function RadioQuestion({ number, label, name, value, onChange, options = ["Yes", "No"] }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-text-primary">
        {number ? `${number}. ` : ""}{label}
      </p>
      <div className="grid ml-2" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={onChange}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm text-text-primary">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
