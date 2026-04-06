import { useDispatch, useSelector } from 'react-redux';

import Avatar from '@/components/commonComponents/avatar/Avatar';
import ModalComponent from '@/components/commonComponents/modal/ModalComponent';

import { componentKey, setCloseViewModal } from '../providerGroupUsersSlice';

const EMPTY_STATE = {};

export default function ViewUserModal() {
  const dispatch = useDispatch();
  const { viewModalOpen = false, viewData = null } = useSelector(
    (state) => state[componentKey] ?? EMPTY_STATE,
  );

  const handleClose = () => {
    dispatch(setCloseViewModal());
  };

  const fullName =
    `${viewData?.firstName || ''} ${viewData?.lastName || ''}`.trim() || '—';
  const role =
    viewData?.providerGroups?.[0]?.roleTitle || viewData?.userType || '—';
  const contact = viewData?.contactNumber
    ? `${viewData.countryCode || ''} ${viewData.contactNumber}`
    : '—';
  const email = viewData?.email || '—';
  const address = viewData?.address
    ? [
        viewData.address.addressLine1,
        viewData.address.addressLine2,
        viewData.address.city,
        viewData.address.state,
        viewData.address.country,
        viewData.address.zipCode,
      ]
        .filter(Boolean)
        .join(', ')
    : '—';
  const status = viewData?.status === 'ACTIVE' ? 'Active' : 'Inactive';

  const infoRows = [
    { label: 'Full Name', value: fullName },
    { label: 'Role', value: role },
    { label: 'Contact', value: contact },
    { label: 'Email Address', value: email, isLink: true },
    { label: 'Address', value: address },
  ];

  const title = (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm sm:text-base font-medium">
        {fullName || 'Users Profile'}
      </span>
      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-[#287F7C] bg-neutral-100">
        <span className="w-1.5 h-1.5 rounded-full bg-[#287F7C]" />
        {status}
      </span>
    </div>
  );

  return (
    <ModalComponent
      title={title}
      open={viewModalOpen}
      close={handleClose}
      customClasses="w-[95%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[30%] max-w-[600px]"
      maxChildrenHeight="max-h-[70vh] md:max-h-[80vh]"
    >
      <div className="flex flex-col md:flex-row gap-5">
        <div className="shrink-0 flex justify-center md:block">
          <Avatar name={fullName} size="6xl" variant="square" />
        </div>

        <div className="flex-1 flex flex-col gap-2.5">
          {infoRows.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-2 text-sm py-0.5"
            >
              <span className="text-neutral-500 min-w-30 sm:min-w-32.5 shrink-0">
                {item.label}
              </span>
              <span className="text-neutral-400">:</span>
              {item.isLink ? (
                <a
                  href={`mailto:${item.value}`}
                  className="text-primary-700 hover:underline break-all"
                >
                  {item.value}
                </a>
              ) : (
                <span className="text-text-primary wrap-break-word">
                  {item.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </ModalComponent>
  );
}
