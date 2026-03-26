import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Icon from "@/components/icons/Icon";
import Button from "@/components/commonComponents/button/Button";
import Checkbox from "@/components/commonComponents/checkbox/Checkbox";
import { configurationData } from "@/data/subOrganizationsData";

export default function ProviderGroupConfiguration() {
  const { setToolbar } = useOutletContext();

  useEffect(() => {
    setToolbar(null);
    return () => setToolbar(null);
  }, [setToolbar]);

  return (
    <div className="px-5 pb-5">
      <div className="grid grid-cols-2 gap-6">
        <div className="border border-border-light rounded-lg p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Caller ID Verification</h3>
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg mb-4">
            <span className="text-sm text-text-primary">Caller ID : {configurationData.callerIdVerification.callerId}</span>
            <button type="button" className="text-error-500 hover:text-error-700 cursor-pointer">
              <Icon name="Trash2" size={16} />
            </button>
          </div>
          <div className="space-y-3">
            <label className="text-sm text-text-primary font-medium">Caller ID</label>
            <input
              type="text"
              placeholder="Enter Caller ID"
              className="w-full h-10 px-4 rounded-lg border border-border bg-surface text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-neutral-800 placeholder-text-placeholder"
            />
            <Checkbox label="Verify ID" variant="blue" size="sm" />
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="primaryBlue" size="sm">Create Caller ID</Button>
          </div>
        </div>

        <div className="border border-border-light rounded-lg p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Sender Email Address Verification</h3>
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg mb-4">
            <span className="text-sm text-text-primary">Caller ID : {configurationData.senderEmailVerification.callerId}</span>
            <button type="button" className="text-error-500 hover:text-error-700 cursor-pointer">
              <Icon name="Trash2" size={16} />
            </button>
          </div>
          <div className="space-y-3">
            <label className="text-sm text-text-primary font-medium">Email Address</label>
            <input
              type="text"
              placeholder="Enter Email Address"
              className="w-full h-10 px-4 rounded-lg border border-border bg-surface text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-neutral-800 placeholder-text-placeholder"
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="primaryBlue" size="sm">Verify</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
