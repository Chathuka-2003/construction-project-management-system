// src/pages/customer/Profile.jsx
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { changePassword, getUserById, updateUser } from "../../api/userApi";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  // ✅ get logged user id from localStorage
  const userId = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      const u = JSON.parse(raw);
      return u?.id || u?.userId || u?.customerId || null;
    } catch {
      return null;
    }
  }, []);

  /**
   * ✅ IMPORTANT (backend UserUpdateDTO requires salary)
   * - We DO NOT show salary in UI
   * - We ALWAYS send salary as 0 (or existing salary if backend returns it)
   *   If backend doesn't return salary, we default to 0.
   */
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    contactNumber: "",
    address: "",

    role: "CUSTOMER",
    gender: "OTHER",
    status: "ACTIVE",

    // hidden field (not shown)
    salary: 0,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  // ✅ load profile from backend
  useEffect(() => {
    if (!userId) {
      toast.error("User id not found in localStorage");
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const data = await getUserById(userId);

        setProfile({
          name: data?.name || "",
          email: data?.email || "",
          contactNumber: data?.contactNumber || "",
          address: data?.address || "",

          role: data?.role || "CUSTOMER",
          gender: data?.gender || "OTHER",
          status: data?.status || "ACTIVE",

          // ✅ hidden salary (default 0)
          salary: data?.salary ?? 0,
        });

        // update localStorage user (optional)
        try {
          const existing = JSON.parse(localStorage.getItem("user") || "null") || {};
          localStorage.setItem("user", JSON.stringify({ ...existing, ...data }));
        } catch {}
      } catch (e) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const saveProfile = async () => {
    if (!userId) return;

    // basic frontend validation
    if (!profile.name.trim()) return toast.error("Name is required");
    if (!profile.email.trim()) return toast.error("Email is required");
    if (!profile.contactNumber.trim()) return toast.error("Contact number is required");
    if (!/^[0-9]{10}$/.test(profile.contactNumber.trim()))
      return toast.error("Contact number must be 10 digits");
    if (!profile.address.trim()) return toast.error("Address is required");

    // backend requires these too
    if (!profile.role) return toast.error("Role is missing");
    if (!profile.gender) return toast.error("Gender is missing");
    if (!profile.status) return toast.error("Status is missing");

    setSaving(true);
    try {
      // ✅ MUST send all required fields for UserUpdateDTO
      // ✅ salary not shown → always send default 0
      const updated = await updateUser(userId, {
        name: profile.name,
        email: profile.email,
        role: profile.role,
        contactNumber: profile.contactNumber,
        address: profile.address,
        gender: profile.gender,
        status: profile.status,
        salary: 0, // ✅ ALWAYS 0
      });

      setProfile((p) => ({
        ...p,
        name: updated?.name ?? p.name,
        email: updated?.email ?? p.email,
        contactNumber: updated?.contactNumber ?? p.contactNumber,
        address: updated?.address ?? p.address,
        role: updated?.role ?? p.role,
        gender: updated?.gender ?? p.gender,
        status: updated?.status ?? p.status,
        salary: updated?.salary ?? 0,
      }));

      // update localStorage user
      try {
        const existing = JSON.parse(localStorage.getItem("user") || "null") || {};
        localStorage.setItem("user", JSON.stringify({ ...existing, ...updated }));
      } catch {}

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (e) {
      toast.error(e?.response?.data || "Profile update failed (400)");
    } finally {
      setSaving(false);
    }
  };

  const doChangePassword = async () => {
    if (!userId) return;

    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      toast.error("Please fill all password fields");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setPwSaving(true);
    try {
      const msg = await changePassword(userId, {
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
        confirmPassword: passwords.confirm,
      });

      toast.success(typeof msg === "string" ? msg : "Password changed successfully!");
      setPasswords({ current: "", newPass: "", confirm: "" });
      setShowPasswordModal(false);
    } catch (e) {
      toast.error(e?.response?.data || "Password change failed");
    } finally {
      setPwSaving(false);
    }
  };

  const toggle2FA = () => {
    setTwoFA((v) => !v);
    toast.success(!twoFA ? "2FA Enabled" : "2FA Disabled");
  };

  const initials = useMemo(() => {
    const parts = (profile.name || "").trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }, [profile.name]);

  if (loading) {
    return <div className="text-sm text-gray-600">Loading profile…</div>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
          <p className="text-sm text-gray-500">Manage your personal information and settings</p>
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
              disabled={saving}
              className="px-4 py-2 text-sm text-white bg-teal-600 rounded-lg disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* TOP SECTION */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* PROFILE CARD */}
        <div className="bg-[#8b8f97] rounded-xl p-6 text-center text-white">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-3 text-2xl font-bold bg-teal-600 rounded-full">
            {initials}
          </div>
          <h2 className="text-lg font-semibold">{profile.name || "—"}</h2>
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
              name="contactNumber"
              value={profile.contactNumber}
              editing={isEditing}
              onChange={handleProfileChange}
              placeholder="0771234567"
            />

            <ProfileInput
              label="Address"
              name="address"
              value={profile.address}
              editing={isEditing}
              onChange={handleProfileChange}
            />

            {/* ✅ Backend-required fields (read-only) */}
            <ProfileInput label="Role" name="role" value={profile.role} editing={false} />
            <ProfileInput label="Gender" name="gender" value={profile.gender} editing={false} />
            <ProfileInput label="Status" name="status" value={profile.status} editing={false} />
          </div>

          <p className="mt-3 text-xs text-gray-200/90">
            Note: Role / Gender / Status are system fields and are not editable here.
          </p>
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
            className={`px-4 py-2 text-sm rounded ${twoFA ? "bg-green-600" : "bg-gray-600"}`}
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
              value={passwords.current}
              onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full mb-2 px-3 py-2 rounded bg-[#6b625b]"
              value={passwords.newPass}
              onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full mb-4 px-3 py-2 rounded bg-[#6b625b]"
              value={passwords.confirm}
              onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowPasswordModal(false)} disabled={pwSaving}>
                Cancel
              </button>
              <button
                onClick={doChangePassword}
                disabled={pwSaving}
                className="px-4 py-2 bg-teal-600 rounded disabled:opacity-60"
              >
                {pwSaving ? "Saving…" : "Save"}
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
const ProfileInput = ({ label, value, name, editing, onChange, placeholder }) => (
  <div>
    <label className="text-xs text-gray-200">{label}</label>
    {editing ? (
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full mt-1 bg-[#4f5661] px-3 py-2 rounded-md text-sm text-white placeholder:text-gray-300/70"
      />
    ) : (
      <div className="w-full mt-1 bg-[#4f5661] px-3 py-2 rounded-md text-sm">
        {value || "—"}
      </div>
    )}
  </div>
);
