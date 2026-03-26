import { useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Icon from "@/components/icons/Icon";
import Button from "@/components/commonComponents/button/Button";
import Avatar from "@/components/commonComponents/avatar/Avatar";
import { getSubOrgProfile } from "@/data/subOrganizationsData";
import { componentKey, setOpenEditDrawer, registerReducer } from "./subOrgProfileSlice";
import EditProfileDrawer from "./Components/EditProfileDrawer";

export default function SubOrgProfile() {
  const { subOrgId } = useParams();
  const profile = getSubOrgProfile(subOrgId);
  const { setToolbar } = useOutletContext();
  const dispatch = useDispatch();


  const { drawerOpen, editData } = useSelector((state) => state[componentKey] ?? {});

  const handleEditProfile = () => {
    dispatch(setOpenEditDrawer(profile));
  };

  useEffect(() => {
    setToolbar(
      <Button variant="primaryBlue" size="sm" onClick={handleEditProfile}>
        <Icon name="Pencil" size={14} />
        Edit Profile
      </Button>
    );
    return () => setToolbar(null);
  }, [setToolbar]);

  return (
    <div className="px-5 pb-5">
      <div className="border border-border-light rounded-lg p-5">
        <div className="flex items-start gap-4 mb-6">
          <Avatar name={profile.name} size="xl" variant="square"/>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-text-primary">{profile.name}</h2>
                <p className="text-sm text-neutral-500">{profile.organization}</p>
                <div className="flex items-center gap-1 mt-1 text-sm text-neutral-500">
                  <Icon name="MapPin" size={14} className="text-neutral-400" />
                  {profile.address}
                </div>
              </div>
              <span className="flex items-center p-2 rounded-2xl gap-1.5 text-sm font-medium text-[#287F7C] bg-neutral-250">
                <span className="w-2 h-2 rounded-full bg-[#287F7C]" />
                {profile.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { icon: "users-round", label: "Provider Group", value: profile.stats.providerGroup },
            { icon: "Stethoscope", label: "Total Providers", value: profile.stats.totalProviders },
            { icon: "user-round-check", label: "Total Patient", value: profile.stats.totalPatient },
            { icon: "users-round", label: "Active Users", value: profile.stats.activeUsers },
          ].map((stat) => (
            <div key={stat.label} className="border border-border-light rounded-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                <Icon name={stat.icon} size={18} className="text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">{stat.label}</p>
                <p className="text-lg font-semibold text-text-primary">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4 border-b border-border-light pb-2">Contact Information</h3>
            <div className="space-y-3">
              {[
                { label: "Contact Number", value: profile.contactInfo.contactNumber },
                { label: "Created On", value: profile.contactInfo.createdOn },
                { label: "Email Address", value: profile.contactInfo.emailAddress, isLink: true },
                { label: "Website", value: profile.contactInfo.website, isLink: true },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2 text-sm">
                  <span className="text-neutral-500 min-w-32">{item.label}</span>
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
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4 border-b border-border-light pb-2">Administrative Contact</h3>
            <div className="space-y-3">
              {[
                { label: "Administrator", value: profile.adminContact.administrator },
                { label: "Contact Number", value: profile.adminContact.contactNumber },
                { label: "Email Address", value: profile.adminContact.emailAddress, isLink: true },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2 text-sm">
                  <span className="text-neutral-500 min-w-32">{item.label}</span>
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

      <EditProfileDrawer open={drawerOpen} editData={editData} />
    </div>
  );
}
