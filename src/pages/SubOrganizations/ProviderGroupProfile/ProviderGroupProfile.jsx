import { useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Icon from "@/components/icons/Icon";
import Button from "@/components/commonComponents/button/Button";
import Avatar from "@/components/commonComponents/avatar/Avatar";
import { getProviderGroupProfile } from "@/data/subOrganizationsData";
import { componentKey, setOpenEditDrawer } from "../ProviderGroupList/providerGroupListSlice";
import AddProviderGroupDrawer from "../ProviderGroupList/Components/AddProviderGroupDrawer";

export default function ProviderGroupProfile() {
  const { providerGroupId } = useParams();
  const profile = getProviderGroupProfile(providerGroupId);
  const { setToolbar } = useOutletContext();
  const dispatch = useDispatch();

  const { drawerOpen, drawerMode, editData } = useSelector((state) => state[componentKey] ?? {});

  const handleEditProfile = () => {
    dispatch(setOpenEditDrawer(profile));
  };

  useEffect(() => {
    setToolbar(
      <Button variant="primaryBlue" size="sm" onClick={handleEditProfile}>
        <Icon name="Pencil" size={14} />
        Edit Provider Group
      </Button>
    );
    return () => setToolbar(null);
  }, [setToolbar]);

  return (
    <div className="px-5 pb-5">
      <div className="border border-border-light rounded-lg p-5">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <Avatar name={profile.name} size="xl" variant="square"/>
            <div className="space-y-2.5">
              {[
                { label: "Provider Group Name", value: profile.name },
                { label: "Email Address", value: profile.email, isLink: true },
                { label: "Contact", value: profile.contact },
                { label: "Specialties", value: profile.specialties.join(", ") },
                { label: "Website", value: profile.website, isLink: true },
                { label: "Timezone", value: profile.timezone },
                { label: "Bio", value: profile.bio },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2 text-sm">
                  <span className="text-neutral-500 min-w-36">{item.label}</span>
                  <span className="text-neutral-500">:</span>
                  {item.isLink ? (
                    <a href="#" className="text-primary-700 hover:underline">{item.value}</a>
                  ) : (
                    <span className="text-text-primary">{item.value}</span>
                  )}
                </div>
              ))}
            </div>
            <span className="flex items-center p-2 rounded-2xl gap-1.5 text-sm font-medium text-[#287F7C] bg-neutral-250">
                <span className="w-2 h-2 rounded-full bg-[#287F7C]" />
                Active
              </span>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-4 border-b border-border-light pb-2">Address Information</h3>
              <div className="space-y-3">
                {[
                  { label: "Address", value: profile.addressInfo.address },
                  { label: "Billing Address", value: profile.addressInfo.billingAddress },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-2 text-sm">
                    <span className="text-neutral-500 min-w-32">{item.label}</span>
                    <span className="text-neutral-500">:</span>
                    <span className="text-text-primary">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-4 border-b border-border-light pb-2">Administrative Contact</h3>
              <div className="space-y-3">
                {[
                  { label: "Administrator Name", value: profile.adminContact.administratorName },
                  { label: "Email Address", value: profile.adminContact.emailAddress, isLink: true },
                  { label: "Contact Number", value: profile.adminContact.contactNumber },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-2 text-sm">
                    <span className="text-neutral-500 min-w-36">{item.label}</span>
                    <span className="text-neutral-500">:</span>
                    {item.isLink ? (
                      <a href="#" className="text-primary-700 hover:underline">{item.value}</a>
                    ) : (
                      <span className="text-text-primary">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddProviderGroupDrawer open={drawerOpen} drawerMode={drawerMode} editData={editData} />
    </div>
  );
}
