import { useDispatch, useSelector } from 'react-redux';

import ModalComponent from '@/components/commonComponents/modal/ModalComponent';

import { componentKey, setCloseViewModal } from '../educationSlice';

export default function ViewEducationModal() {
  const dispatch = useDispatch();
  const viewModalOpen = useSelector(
    (state) => state[componentKey]?.viewModalOpen ?? false,
  );
  const viewData = useSelector(
    (state) => state[componentKey]?.viewData ?? null,
  );

  const handleClose = () => {
    dispatch(setCloseViewModal());
  };

  return (
    <ModalComponent
      title={
        <div className="flex items-center gap-3">
          <span>{viewData?.fileName || ''}</span>
          {viewData?.specialty && (
            <span className="text-xs font-medium text-info-600 bg-info-50 px-2 py-0.5 rounded">
              {viewData.specialty}
            </span>
          )}
        </div>
      }
      open={viewModalOpen}
      close={handleClose}
      customClasses="w-full max-w-[966px] mx-4"
      maxChildrenHeight="max-h-[75vh]"
    >
      <div className="flex items-center justify-center min-h-[400px] border border-neutral-200 rounded-lg bg-white">
        <div className="flex flex-col items-center gap-2 text-neutral-400">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className="text-sm">
            {viewData?.fileType || 'Document'} Preview
          </span>
        </div>
      </div>
    </ModalComponent>
  );
}
