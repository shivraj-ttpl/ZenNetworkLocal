import Input from '@/components/commonComponents/input/Input';

const YES_NO = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

function RadioYesNo({ name, value, onChange }) {
  return (
    <div className="flex items-center gap-6 mt-1">
      {YES_NO.map((opt) => (
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

export default function LifestyleBehaviorQuestions({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
}) {
  const l = values?.lifestyleBehaviorQuestions || {};

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-base font-semibold text-text-primary">
        Lifestyle Behavior Questions
      </h3>

      {/* Row 1: Height, Weight, BMI, Ideal Weight */}
      <div className="grid grid-cols-4 gap-4">
        <Input
          label="Height"
          name="lifestyleBehaviorQuestions.height"
          placeholder="Enter"
          value={l.height || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Weight"
          name="lifestyleBehaviorQuestions.weight"
          placeholder="Enter"
          value={l.weight || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="BMI"
          name="lifestyleBehaviorQuestions.bmi"
          placeholder="Enter"
          value={l.bmi || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="What is your ideal weight?"
          name="lifestyleBehaviorQuestions.idealWeight"
          placeholder="Enter"
          value={l.idealWeight || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      {/* Row 2: Caffeine | Sleep */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Average number of Caffeine drinks/day"
          name="lifestyleBehaviorQuestions.caffeineDrinks"
          placeholder="Enter"
          value={l.caffeineDrinks || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Average number of hours of sleep each night"
          name="lifestyleBehaviorQuestions.sleepHours"
          placeholder="Enter"
          value={l.sleepHours || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      {/* Row 3: Water intake (cups + ounces) | Alcohol */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-normal text-text-primary">
            Average water intake (cups/day)
          </label>
          <div className="flex items-center gap-2">
            <input
              name="lifestyleBehaviorQuestions.waterCups"
              placeholder="Enter"
              value={l.waterCups || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-32 h-10 px-4 rounded-lg border border-neutral-300 bg-surface text-sm text-neutral-800 placeholder-text-placeholder outline-none"
            />
            <span className="text-sm text-text-secondary">cups</span>
            <input
              name="lifestyleBehaviorQuestions.waterOunces"
              placeholder="Enter"
              value={l.waterOunces || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-32 h-10 px-4 rounded-lg border border-neutral-300 bg-surface text-sm text-neutral-800 placeholder-text-placeholder outline-none"
            />
            <span className="text-sm text-text-secondary">Ounces</span>
          </div>
        </div>
        <Input
          label="Average number of drinks with alcohol a day"
          name="lifestyleBehaviorQuestions.alcoholDrinks"
          placeholder="Enter"
          value={l.alcoholDrinks || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      {/* Row 4: Fruits/Veggies | White food */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Average fruits and vegetable servings a day"
          name="lifestyleBehaviorQuestions.fruitsVegetables"
          placeholder="Enter"
          value={l.fruitsVegetables || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Average servings of white food (bread, pasta, white rice) a day"
          name="lifestyleBehaviorQuestions.whiteFoodServings"
          placeholder="Enter"
          value={l.whiteFoodServings || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      {/* Row 5: Sugar | Processed food */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Average servings of food or drinks with sugar a day (Pastries, Candy, sodas, juice)"
          name="lifestyleBehaviorQuestions.sugarServings"
          placeholder="Enter"
          value={l.sugarServings || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Average servings of processed or fast foods a day"
          name="lifestyleBehaviorQuestions.processedFoods"
          placeholder="Enter"
          value={l.processedFoods || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      {/* Row 6: Protein | Weigh food */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Average number of grams of protein a day"
          name="lifestyleBehaviorQuestions.proteinGrams"
          placeholder="Enter"
          value={l.proteinGrams || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-normal text-text-primary">
            Do you weigh your food ?
          </label>
          <RadioYesNo
            name="lifestyleBehaviorQuestions.weighFood"
            value={l.weighFood || ''}
            onChange={(val) =>
              setFieldValue('lifestyleBehaviorQuestions.weighFood', val)
            }
          />
        </div>
      </div>

      {/* Row 7: Log food | Cardio */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-normal text-text-primary">
            Do you log your food?
          </label>
          <RadioYesNo
            name="lifestyleBehaviorQuestions.logFood"
            value={l.logFood || ''}
            onChange={(val) =>
              setFieldValue('lifestyleBehaviorQuestions.logFood', val)
            }
          />
        </div>
        <Input
          label="Average number of minutes of cardiovascular exercise each week."
          name="lifestyleBehaviorQuestions.cardioMinutes"
          placeholder="Enter"
          value={l.cardioMinutes || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      {/* Row 8: Strength | Stretching */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Average number of minutes of strength training exercise each week"
          name="lifestyleBehaviorQuestions.strengthMinutes"
          placeholder="Enter"
          value={l.strengthMinutes || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Average minutes of stretching each week"
          name="lifestyleBehaviorQuestions.stretchingMinutes"
          placeholder="Enter"
          value={l.stretchingMinutes || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      {/* Row 9: Self-care | Screen time */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Average number of times a week for self-care/stress management activities"
          name="lifestyleBehaviorQuestions.selfCareFrequency"
          placeholder="Enter"
          value={l.selfCareFrequency || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Daily screen time (hrs)"
          name="lifestyleBehaviorQuestions.screenTime"
          placeholder="Enter"
          value={l.screenTime || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      {/* Row 10: Main stress | Interested in coaching */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Main source of stress:"
          name="lifestyleBehaviorQuestions.mainStress"
          placeholder="Enter"
          value={l.mainStress || ''}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-normal text-text-primary">
            Interested in Lifestyle/wellness coaching/nutrition/exercise
            program?
          </label>
          <RadioYesNo
            name="lifestyleBehaviorQuestions.interestedCoaching"
            value={l.interestedCoaching || ''}
            onChange={(val) =>
              setFieldValue(
                'lifestyleBehaviorQuestions.interestedCoaching',
                val,
              )
            }
          />
        </div>
      </div>

      {/* Row 11: Stress reduction counseling */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-normal text-text-primary">
          Interested in stress reduction counseling?
        </label>
        <RadioYesNo
          name="lifestyleBehaviorQuestions.interestedCounseling"
          value={l.interestedCounseling || ''}
          onChange={(val) =>
            setFieldValue(
              'lifestyleBehaviorQuestions.interestedCounseling',
              val,
            )
          }
        />
      </div>
    </div>
  );
}
