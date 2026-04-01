import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Input from '@/components/commonComponents/input/Input';
import { useFlexCleanup } from '@/hooks/useFlexCleanup';
import { DEFAULT_LABEL_FIELDS } from '@/pages/Settings/SettingsLabels/constant';

import { componentKey, registerReducer } from './subOrgLabelsSlice';
import { subOrgLabelsActions, registerSaga } from './subOrgLabelsSaga';

const { fetchLabels } = subOrgLabelsActions;
const EMPTY_STATE = {};

export default function SubOrgLabels() {
  const { subOrgId } = useParams();
  const dispatch = useDispatch();

  const { labelsList = [] } = useSelector(
    (state) => state[componentKey] ?? EMPTY_STATE,
  );
  useEffect(() => {
    registerReducer();
    registerSaga();
  }, []);

  useFlexCleanup(componentKey);

  useEffect(() => {
    if (subOrgId) {
      dispatch(fetchLabels({ subOrgId }));
    }
  }, [dispatch, subOrgId]);

  const labelsMap = useMemo(() => {
    const map = {};
    labelsList.forEach((label) => {
      map[label.fieldName] = label;
    });
    return map;
  }, [labelsList]);

  return (
    <div className="pb-5">
      <div className="flex items-center p-4 border-y border-border-light mb-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary">
            Manage System Labels
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Labels configured for this sub-organization. Contact your
            organization admin to make changes.
          </p>
        </div>
      </div>

      <div className="border border-border rounded-lg h-[calc(100vh-340px)] mx-4 overflow-y-auto">
        <div className="grid grid-cols-2 bg-neutral-50 rounded-t-lg">
          <div className="px-4 py-3 text-sm font-semibold text-text-primary">
            Field Name
          </div>
          <div className="px-4 py-3 text-sm font-semibold text-text-primary">
            Label
          </div>
        </div>

        {DEFAULT_LABEL_FIELDS.map((fieldName) => {
          const apiLabel = labelsMap[fieldName];
          return (
            <div
              key={fieldName}
              className="grid grid-cols-2 border-t border-border"
            >
              <div className="px-4 py-3 text-sm font-medium text-text-primary flex items-center">
                {fieldName}
              </div>
              <div className="px-4 py-3 flex items-center">
                <Input
                  name={`label-${fieldName}`}
                  value={
                    apiLabel?.customLabel || apiLabel?.defaultLabel || fieldName
                  }
                  disabled
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
