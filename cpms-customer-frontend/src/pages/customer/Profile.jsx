import { useState } from "react";
import toast from "react-hot-toast";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  const [profile, setProfile] = useState({
    name: "Michael Roberts",
    email: "michael.roberts@email.com",
    phone: "+94 77 987 6543",
    company: "Roberts Construction LLC",
    address: "456 Business Street, Colombo 03, Sri Lanka",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const saveProfile = () => {
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const changePassword = () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      toast.error("Please fill all password fields");
      return;
    }

    if (passwords.newPass !== passwords.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    toast.success("Password changed successfully!");
    setPasswords({ current: "", newPass: "", confirm: "" });
    setShowPasswordModal(false);
  };

  const toggle2FA = () => {
    setTwoFA(!twoFA);
    toast.success(twoFA ? "2FA Disabled" : "2FA Enabled");
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
          <p className="text-sm text-gray-500">
            Manage your personal information and settings
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm text-white bg-teal-600 rounded-lg"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm text-white bg-gray-500 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={saveProfile}
              className="px-4 py-2 text-sm text-white bg-teal-600 rounded-lg"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* TOP SECTION */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* PROFILE CARD */}
        <div className="bg-[#8b8f97] rounded-xl p-6 text-center text-white">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-3 text-2xl font-bold bg-teal-600 rounded-full">
            MR
          </div>
          <h2 className="text-lg font-semibold">{profile.name}</h2>
          <p className="text-sm text-gray-200">Customer</p>
        </div>

        {/* PERSONAL INFO */}
        <div className="md:col-span-2 bg-[#8b8f97] rounded-xl p-6 text-white">
          <h3 className="mb-4 text-lg font-semibold">Personal Information</h3>

          <div className="space-y-3">
            <ProfileInput
              label="Full Name"
              name="name"
              value={profile.name}
              editing={isEditing}
              onChange={handleProfileChange}
            />
            <ProfileInput
              label="Email Address"
              name="email"
              value={profile.email}
              editing={isEditing}
              onChange={handleProfileChange}
            />
            <ProfileInput
              label="Phone Number"
              name="phone"
              value={profile.phone}
              editing={isEditing}
              onChange={handleProfileChange}
            />
            <ProfileInput
              label="Company Name"
              name="company"
              value={profile.company}
              editing={isEditing}
              onChange={handleProfileChange}
            />
            <ProfileInput
              label="Address"
              name="address"
              value={profile.address}
              editing={isEditing}
              onChange={handleProfileChange}
            />
          </div>
        </div>
      </div>

      {/* SECURITY SETTINGS */}
      <div className="bg-[#8b8f97] rounded-xl p-6 text-white">
        <h3 className="mb-4 text-lg font-semibold">Security Settings</h3>

        <div className="space-y-4">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-4 py-2 text-sm bg-gray-600 rounded"
          >
            Change Password
          </button>

          <button
            onClick={toggle2FA}
            className={`px-4 py-2 text-sm rounded ${
              twoFA ? "bg-green-600" : "bg-gray-600"
            }`}
          >
            {twoFA ? "Disable 2FA" : "Enable 2FA"}
          </button>
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#5c534d] text-white w-[400px] p-6 rounded-xl">
            <h3 className="mb-4 text-lg font-semibold">Change Password</h3>

            <input
              type="password"
              placeholder="Current Password"
              className="w-full mb-2 px-3 py-2 rounded bg-[#6b625b]"
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full mb-2 px-3 py-2 rounded bg-[#6b625b]"
              onChange={(e) =>
                setPasswords({ ...passwords, newPass: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full mb-4 px-3 py-2 rounded bg-[#6b625b]"
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowPasswordModal(false)}>
                Cancel
              </button>
              <button
                onClick={changePassword}
                className="px-4 py-2 bg-teal-600 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

/* ---------- SMALL COMPONENT ---------- */

const ProfileInput = ({ label, value, name, editing, onChange }) => (
  <div>
    <label className="text-xs text-gray-200">{label}</label>
    {editing ? (
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-1 bg-[#4f5661] px-3 py-2 rounded-md text-sm text-white"
      />
    ) : (
      <div className="w-full mt-1 bg-[#4f5661] px-3 py-2 rounded-md text-sm">
        {value}
      </div>
    )}
  </div>
);
