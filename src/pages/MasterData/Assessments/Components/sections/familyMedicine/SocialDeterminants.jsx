import Input from '@/components/commonComponents/input/Input';

export default function SocialDeterminants({ values, handleChange, handleBlur, setFieldValue }) {
  const sd = values?.socialDeterminants || {};

  const radio = (key, opt) => (
    <label key={opt} className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="radio"
        name={`socialDeterminants.${key}`}
        value={opt}
        checked={sd[key] === opt}
        onChange={() => setFieldValue(`socialDeterminants.${key}`, opt)}
        className="accent-primary w-4 h-4 shrink-0"
      />
      <span className="text-sm text-text-primary">{opt}</span>
    </label>
  );

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-semibold text-text-primary">Social Determinants of Health (PRAPARE)</h3>

      {/* Q1 */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-text-primary">1. Current housing</p>
        <div className="grid grid-cols-4 gap-3">
          {['Have housing', 'No housing', 'Prefer not to answer'].map((opt) => radio('currentHousing', opt))}
        </div>
      </div>

      {/* Q2 */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-text-primary">2. Worried about losing housing?</p>
        <div className="grid grid-cols-4 gap-3">
          {['Yes', 'No', 'Prefer not to answer'].map((opt) => radio('worriedHousing', opt))}
        </div>
      </div>

      {/* Q3 — multi-select */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-text-primary">3. In past year, lacked</p>
        <div className="grid grid-cols-4 gap-3">
          {['Food', 'Utilities', 'Clothing', 'Childcare', 'Medicine', 'Phone', 'Other', 'None'].map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                name="socialDeterminants.lacked"
                value={opt}
                checked={sd.lacked === opt}
                onChange={() => setFieldValue('socialDeterminants.lacked', opt)}
                className="accent-primary w-4 h-4 shrink-0"
              />
              <span className="text-sm text-text-primary">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Q4 */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-text-primary">4. Transportation kept from work or healthcare?</p>
        <div className="grid grid-cols-4 gap-3">
          {['Yes', 'No', 'Prefer not to answer'].map((opt) => radio('transportation', opt))}
        </div>
      </div>

      {/* Q5 */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-text-primary">5. Feel safe where you live?</p>
        <div className="grid grid-cols-4 gap-3">
          {['Yes', 'No', 'Sometimes', 'Prefer not to answer'].map((opt) => radio('feelSafe', opt))}
        </div>
      </div>

      {/* Q6 */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-text-primary">6. How often do you talk to people you care about?</p>
        <div className="grid grid-cols-4 gap-3">
          {['<1/wk', '1–2x/wk', '3–5x/wk', 'Nearly daily'].map((opt) => radio('talkToPeople', opt))}
        </div>
      </div>

      {/* Q7 — Work situation with Job Title inline */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-text-primary">7. Work situation:</p>
        <div className="grid grid-cols-4 gap-3">
          {['Full-time', 'Part-time', 'Unemployed (looking)', 'Unemployed (not looking)'].map((opt) =>
            radio('workSituation', opt),
          )}
        </div>
        <div className="grid grid-cols-4 gap-3 items-center">
          {['Retired', 'Unable to work'].map((opt) => radio('workSituation', opt))}
          <div className="col-span-2 flex items-center gap-2">
            <span className="text-sm text-text-primary whitespace-nowrap">Job Title :</span>
            <input
              name="socialDeterminants.jobTitle"
              placeholder="Enter"
              value={sd.jobTitle || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              className="flex-1 h-9 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-800 placeholder-neutral-400 outline-none"
            />
          </div>
        </div>
        {/* Sub-question */}
        <div className="flex flex-col gap-2 mt-1">
          <p className="text-sm text-text-primary">Do you work outdoors?</p>
          <div className="flex items-center gap-6">
            {['Yes', 'No'].map((opt) => radio('workOutdoors', opt))}
          </div>
        </div>
      </div>

      {/* Q8 */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-text-primary">8. Education:</p>
        <div className="grid grid-cols-5 gap-3">
          {['<HS', 'HS/GED', 'Some college', "Bachelor's", 'Graduate'].map((opt) => radio('education', opt))}
        </div>
      </div>

      {/* Q9 */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-text-primary">9. Household income</p>
        <div className="grid grid-cols-5 gap-3">
          {['<$10k', '$10-19k', '$20-29k', '$30-49k', '≥$50k'].map((opt) => radio('householdIncome', opt))}
        </div>
        <div className="flex items-center gap-2">
          {radio('householdIncome', 'Prefer not to answer')}
        </div>
      </div>

      {/* Q10 — text input */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-text-primary">10. How many falls have you had in the past year?</p>
        <input
          name="socialDeterminants.falls"
          placeholder="Enter"
          value={sd.falls || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          className="h-10 px-4 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-800 placeholder-neutral-400 outline-none max-w-sm"
        />
      </div>

      {/* Q11 */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-text-primary">11. Want help meeting any of the above needs?</p>
        <div className="flex items-center gap-6">
          {['Yes', 'No'].map((opt) => radio('wantHelp', opt))}
        </div>
      </div>

      {/* Q12 */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-text-primary">12. Urgent needs today?</p>
        <div className="flex items-center gap-6">
          {['If yes, describe', 'No'].map((opt) => radio('urgentNeeds', opt))}
        </div>
        {sd.urgentNeeds === 'If yes, describe' && (
          <Input
            name="socialDeterminants.urgentNeedsDescribe"
            placeholder="Enter"
            value={sd.urgentNeedsDescribe || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className="max-w-sm"
          />
        )}
      </div>
    </div>
  );
}
