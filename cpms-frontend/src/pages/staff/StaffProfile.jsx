// src/pages/staff/StaffProfile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { api, getAuth } from "../../services/authService";
import { Camera, KeyRound, Pencil, ShieldCheck, Loader2 } from "lucide-react";

function normalizeRole(r) {
  return String(r || "").replace("ROLE_", "").toUpperCase();
}

function roleTitle(role) {
  const r = normalizeRole(role);
  if (r === "SUPERADMIN") return "Super Administrator";
  if (r === "ADMIN") return "Administrator";
  if (r === "MANAGER") return "Project Manager";
  if (r === "ENGINEER") return "Engineer";
  if (r === "WORKER") return "Worker";
  if (r === "OTHER_STAFF" || r === "STAFF") return "Staff";
  return r ? r[0] + r.slice(1).toLowerCase() : "User";
}

function roleBadgeClass(role) {
  const r = normalizeRole(role);
  if (r === "ENGINEER") return "bg-cyan-500/20 text-cyan-200 ring-cyan-500/30";
  if (r === "WORKER") return "bg-amber-500/20 text-amber-200 ring-amber-500/30";
  if (r === "MANAGER") return "bg-purple-500/20 text-purple-200 ring-purple-500/30";
  return "bg-white/10 text-white/70 ring-white/20";
}

function extractAxiosError(e) {
  if (!e?.response) return "Network error. Check backend running + CORS.";
  const s = e.response.status;
  if (s === 401) return "Unauthorized (401). Login again.";
  if (s === 403) return "Forbidden (403). Your role has no access.";
  return e.response.data?.message || e.response.data || `Request failed (${s}).`;
}

export default function StaffProfile() {
  const auth = getAuth(); // {token, role, email, userId, name}
  const storedRole = auth.role;

  const [profileImage, setProfileImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const [err, setErr] = useState("");
  const [okMsg, setOkMsg] = useState("");

  // ✅ UI state should match backend fields
  const [staffData, setStaffData] = useState({
    name: auth.name || "Staff User",
    email: auth.email || "staff@company.com",
    contactNumber: "",
    address: "",
    gender: "MALE",
    salary: 0,
  });

  // keep backend user (role/status etc)
  const [backendUser, setBackendUser] = useState(null);

  const [showEditForm, setShowEditForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const avatarUrl = useMemo(() => {
    const n = encodeURIComponent(staffData.name || "Staff");
    return `https://ui-avatars.com/api/?name=${n}&background=10B981&color=fff`;
  }, [staffData.name]);

  async function fetchStaff() {
    setErr("");
    setOkMsg("");

    const { userId } = getAuth();
    if (!userId) {
      setErr(`User id not found in localStorage ("userId"). Re-login to store userId.`);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/api/users/${userId}`);
      // your backend returns UserResponseDTO directly (no .data wrapper)
      const u = res.data?.data ?? res.data;

      setBackendUser(u);

      setStaffData({
        name: u?.name || "",
        email: u?.email || "",
        contactNumber: u?.contactNumber || "",
        address: u?.address || "",
        gender: u?.gender || "MALE",
        salary: u?.salary ?? 0,
      });

      // cache for fast load
      if (u?.name) localStorage.setItem("name", u.name);
      if (u?.email) localStorage.setItem("email", u.email);
    } catch (e) {
      setErr(extractAxiosError(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStaff();
  }, []);

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setStaffData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setErr("");
    setOkMsg("");

    const { userId } = getAuth();
    if (!userId) return setErr("User id missing. Re-login.");
    if (!backendUser) return setErr("User not loaded. Click Refresh.");

    if (!staffData.name?.trim()) return setErr("Name is required.");
    if (!staffData.email?.trim()) return setErr("Email is required.");
    if (!staffData.contactNumber?.trim()) return setErr("Contact number is required.");
    if (!staffData.address?.trim()) return setErr("Address is required.");
    if (!staffData.gender) return setErr("Gender is required.");

    // salary can be null in some rows, normalize
    const salaryNumber = Number(staffData.salary ?? 0);
    if (Number.isNaN(salaryNumber) || salaryNumber < 0) return setErr("Salary must be 0 or positive.");

    setSavingProfile(true);
    try {
      // ✅ MUST match UserUpdateDTO (NO password field here)
      const payload = {
        name: staffData.name.trim(),
        email: staffData.email.trim(),
        role: backendUser.role, // keep existing role
        contactNumber: staffData.contactNumber.trim(),
        address: staffData.address.trim(),
        gender: staffData.gender,
        salary: salaryNumber,
        status: backendUser.status, // keep existing status
      };

      const res = await api.put(`/api/users/${userId}`, payload);
      const updated = res.data?.data ?? res.data;

      setBackendUser(updated);
      setShowEditForm(false);
      setOkMsg("Profile updated successfully.");

      localStorage.setItem("name", payload.name);
      localStorage.setItem("email", payload.email);

      // refresh view with updated backend data
      await fetchStaff();
    } catch (e2) {
      setErr(extractAxiosError(e2));
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setOkMsg("");

    const { userId } = getAuth();
    if (!userId) return setErr("User id missing. Re-login.");

    if (!passwordData.currentPassword) return setErr("Current password is required.");
    if (!passwordData.newPassword) return setErr("New password is required.");
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setErr("New password and confirm password do not match.");
    }

    setSavingPw(true);
    try {
      // ✅ matches UserPasswordChangeDTO
      await api.patch(`/api/users/${userId}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      setShowPasswordForm(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setOkMsg("Password updated successfully.");
    } catch (e2) {
      // backend throws "Current password is incorrect" -> 400
      setErr(extractAxiosError(e2));
    } finally {
      setSavingPw(false);
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-[380px] w-[680px] rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <div className="relative max-w-4xl">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-white">Staff Profile</h1>
            <p className="text-sm text-white/60">Manage your profile and security settings</p>
          </div>

          <button
            onClick={fetchStaff}
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white/85 font-semibold hover:bg-white/10 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            Refresh
          </button>
        </div>

        {err && (
          <div className="mb-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            <div className="font-bold">Error</div>
            <div className="text-rose-100/80 mt-1 break-words">{err}</div>
          </div>
        )}

        {okMsg && (
          <div className="mb-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            <div className="font-bold">Success</div>
            <div className="text-emerald-100/80 mt-1 break-words">{okMsg}</div>
          </div>
        )}

        <div className="bg-white/5 rounded-xl border border-white/10 backdrop-blur-xl p-6 space-y-6 ring-1 ring-white/10 shadow-lg shadow-black/20">
          {/* Header */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={profileImage || avatarUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border border-white/20"
              />
              <label className="absolute -bottom-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs px-2 py-1 rounded cursor-pointer font-semibold">
                <span className="inline-flex items-center gap-2">
                  <Camera size={14} /> Change
                </span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-medium text-white">{staffData.name}</h2>
                <span className={`inline-flex px-3 py-1 rounded-xl text-xs font-bold ring-1 ${roleBadgeClass(storedRole)}`}>
                  {normalizeRole(storedRole) || "STAFF"}
                </span>
              </div>

              <p className="mt-1 text-sm text-white/60 inline-flex items-center gap-2">
                <ShieldCheck size={14} className="text-cyan-300" />
                {roleTitle(storedRole)}
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-white/60">Email</p>
              <p className="font-medium text-white">{staffData.email}</p>
            </div>

            <div>
              <p className="text-white/60">Contact Number</p>
              <p className="font-medium text-white">{staffData.contactNumber || "-"}</p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-white/60">Address</p>
              <p className="font-medium text-white break-words">{staffData.address || "-"}</p>
            </div>

            <div>
              <p className="text-white/60">Gender</p>
              <p className="font-medium text-white">{backendUser?.gender || staffData.gender}</p>
            </div>

            <div>
              <p className="text-white/60">Account Status</p>
              <p className="font-medium text-emerald-400">{backendUser?.status ? String(backendUser.status) : "ACTIVE"}</p>
            </div>

            <div>
              <p className="text-white/60">Role</p>
              <p className="font-medium text-white">{normalizeRole(storedRole) || backendUser?.role || "STAFF"}</p>
            </div>

            <div>
              <p className="text-white/60">Salary</p>
              <p className="font-medium text-white">{backendUser?.salary ?? staffData.salary ?? 0}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowEditForm((v) => !v);
                setShowPasswordForm(false);
                setErr("");
                setOkMsg("");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-sm font-semibold hover:opacity-95"
              type="button"
            >
              <Pencil size={16} />
              Edit Profile
            </button>

            <button
              onClick={() => {
                setShowPasswordForm((v) => !v);
                setShowEditForm(false);
                setErr("");
                setOkMsg("");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white/80 rounded-lg text-sm font-semibold border border-white/20 hover:bg-white/15"
              type="button"
            >
              <KeyRound size={16} />
              Change Password
            </button>
          </div>

          {/* Edit Form */}
          {showEditForm && (
            <form
              onSubmit={handleProfileSave}
              className="border border-white/10 rounded-lg p-4 space-y-4 bg-white/5 backdrop-blur-xl ring-1 ring-white/10"
            >
              <h3 className="font-medium text-white">Edit Profile</h3>

              <input
                type="text"
                name="name"
                value={staffData.name}
                onChange={handleProfileChange}
                placeholder="Name"
                className="w-full border border-white/20 rounded px-3 py-2 text-sm bg-white/5 text-white placeholder-white/40 outline-none focus:border-white/40 focus:bg-white/10"
              />

              <input
                type="email"
                name="email"
                value={staffData.email}
                onChange={handleProfileChange}
                placeholder="Email"
                className="w-full border border-white/20 rounded px-3 py-2 text-sm bg-white/5 text-white placeholder-white/40 outline-none focus:border-white/40 focus:bg-white/10"
              />

              <input
                type="text"
                name="contactNumber"
                value={staffData.contactNumber}
                onChange={handleProfileChange}
                placeholder="Contact Number (10 digits)"
                className="w-full border border-white/20 rounded px-3 py-2 text-sm bg-white/5 text-white placeholder-white/40 outline-none focus:border-white/40 focus:bg-white/10"
              />

              <input
                type="text"
                name="address"
                value={staffData.address}
                onChange={handleProfileChange}
                placeholder="Address"
                className="w-full border border-white/20 rounded px-3 py-2 text-sm bg-white/5 text-white placeholder-white/40 outline-none focus:border-white/40 focus:bg-white/10"
              />

              <select
                name="gender"
                value={staffData.gender}
                onChange={handleProfileChange}
                className="w-full border border-white/20 rounded px-3 py-2 text-sm bg-slate-950 text-white outline-none focus:border-white/40"
              >
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                <option value="OTHER">OTHER</option>
              </select>

              <input
                type="number"
                name="salary"
                value={staffData.salary ?? 0}
                onChange={handleProfileChange}
                placeholder="Salary"
                className="w-full border border-white/20 rounded px-3 py-2 text-sm bg-white/5 text-white placeholder-white/40 outline-none focus:border-white/40 focus:bg-white/10"
                min={0}
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded text-sm font-semibold hover:opacity-95 disabled:opacity-60"
                >
                  {savingProfile && <Loader2 className="animate-spin" size={16} />}
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="px-4 py-2 bg-white/10 text-white/80 rounded text-sm font-semibold border border-white/20 hover:bg-white/15"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Password Form */}
          {showPasswordForm && (
            <form
              onSubmit={handlePasswordSubmit}
              className="border border-white/10 rounded-lg p-4 space-y-4 bg-white/5 backdrop-blur-xl ring-1 ring-white/10"
            >
              <h3 className="font-medium text-white">Change Password</h3>

              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Current Password"
                className="w-full border border-white/20 rounded px-3 py-2 text-sm bg-white/5 text-white placeholder-white/40 outline-none focus:border-white/40 focus:bg-white/10"
              />

              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="New Password"
                className="w-full border border-white/20 rounded px-3 py-2 text-sm bg-white/5 text-white placeholder-white/40 outline-none focus:border-white/40 focus:bg-white/10"
              />

              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm New Password"
                className="w-full border border-white/20 rounded px-3 py-2 text-sm bg-white/5 text-white placeholder-white/40 outline-none focus:border-white/40 focus:bg-white/10"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={savingPw}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded text-sm font-semibold hover:opacity-95 disabled:opacity-60"
                >
                  {savingPw && <Loader2 className="animate-spin" size={16} />}
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="px-4 py-2 bg-white/10 text-white/80 rounded text-sm font-semibold border border-white/20 hover:bg-white/15"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
