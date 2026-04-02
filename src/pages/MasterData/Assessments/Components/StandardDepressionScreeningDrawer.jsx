import { Formik, Form } from 'formik';
import Drawer from '@/components/commonComponents/drawer/Drawer';
import Button from '@/components/commonComponents/button/Button';

const OPTIONS = [
  { label: 'Not at all', value: '0' },
  { label: 'Several Days', value: '1' },
  { label: 'More than half the days', value: '2' },
  { label: 'Nearly every day', value: '3' },
];

const QUESTIONS = [
  { key: 'q1', text: '1. Little interest or pleasure in doing things?' },
  { key: 'q2', text: '2. Feeling down, depressed, or hopeless?' },
  { key: 'q3', text: '3. Trouble falling or staying asleep, or sleeping too much?' },
  { key: 'q4', text: '4. Feeling tired or having little energy?' },
  { key: 'q5', text: '5. Poor appetite or overeating?' },
  {
    key: 'q6',
    text: '6. Feeling bad about yourself — or that you are a failure or have let yourself or your family down?',
  },
  {
    key: 'q7',
    text: '7. Trouble concentrating on things, such as reading the newspaper or watching television?',
  },
  {
    key: 'q8',
    text: '8. Moving or speaking so slowly that other people could have noticed? Or so fidgety or restless that you have been moving a lot more than usual?',
  },
  {
    key: 'q9',
    text: '9. Thoughts that you would be better off dead, or of hurting yourself in some way?',
  },
];

const INITIAL_VALUES = {
  q1: '', q2: '', q3: '', q4: '', q5: '',
  q6: '', q7: '', q8: '', q9: '',
};

export default function StandardDepressionScreeningDrawer({ open, onClose, onPrevious }) {
  return (
    <Drawer
      title="Standard Depression Screening"
      open={open}
      close={onClose}
      width="max-w-[940px] w-[940px]"
      footerButton={
        <div className="flex justify-end w-full px-2 pb-2">
          <Button variant="primaryBlue" size="sm" type="button" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <Formik initialValues={INITIAL_VALUES} onSubmit={() => {}}>
        {({ values, setFieldValue }) => (
          <Form className="flex flex-col gap-4 py-4">
            <p className="text-sm text-text-primary">
              Over the last 2 weeks, how often have you been bothered by any of the following
              problems?
            </p>

            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50 text-left border-b border-border">
                    <th className="px-4 py-3 font-medium text-text-secondary w-14">Sr. No</th>
                    <th className="px-4 py-3 font-medium text-text-secondary">Questions</th>
                    {OPTIONS.map((opt) => (
                      <th
                        key={opt.value}
                        className="px-3 py-3 font-medium text-text-secondary text-center w-24"
                      >
                        {opt.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {QUESTIONS.map((q, idx) => (
                    <tr key={q.key} className="border-t border-border">
                      <td className="px-4 py-4 text-text-secondary text-center align-top">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="px-4 py-4 text-text-primary align-top">{q.text}</td>
                      {OPTIONS.map((opt) => (
                        <td key={opt.value} className="px-3 py-4 text-center align-top">
                          <input
                            type="radio"
                            name={q.key}
                            value={opt.value}
                            checked={values[q.key] === opt.value}
                            onChange={() => setFieldValue(q.key, opt.value)}
                            className="accent-primary w-4 h-4 cursor-pointer"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}
