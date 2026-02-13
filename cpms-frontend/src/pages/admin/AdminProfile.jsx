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
  if (r === "SUPERADMIN") return "bg-purple-500/20 text-purple-200 ring-purple-500/30";
  if (r === "ADMIN") return "bg-cyan-500/20 text-cyan-200 ring-cyan-500/30";
  if (r === "MANAGER") return "bg-amber-500/20 text-amber-200 ring-amber-500/30";
  return "bg-white/10 text-white/70 ring-white/20";
}

function extractAxiosError(e) {
  if (!e?.response) return "Network error. Check backend running + CORS.";
  const s = e.response.status;

  // Spring sometimes returns string, sometimes {message:...}
  const body = e.response.data;
  const serverMsg =
    (typeof body === "string" && body) ||
    body?.message ||
    body?.error ||
    body?.errors?.[0]?.defaultMessage ||
    "";

  if (s === 401) return `Unauthorized (401). Login again. ${serverMsg}`.trim();
  if (s === 403) return `Forbidden (403). ${serverMsg}`.trim();
  if (s === 400) return (serverMsg || "Bad Request (400). Check inputs.");
  return serverMsg || `Request failed (${s}).`;
}

export default function AdminProfile() {
  const auth = getAuth();
  const storedRole = auth.role;

  const [profileImage, setProfileImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const [err, setErr] = useState("");
  const [okMsg, setOkMsg] = useState("");

  // UI fields you can edit
  const [adminData, setAdminData] = useState({
    name: auth.name || "Admin User",
    email: auth.email || "admin@company.com",
    contactNumber: "",
    address: "",
    gender: "MALE", // default UI value, will be replaced by backend fetch
  });

  // full backend user
  const [backendUser, setBackendUser] = useState(null);

  const [showEditForm, setShowEditForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const avatarUrl = useMemo(() => {
    const n = encodeURIComponent(adminData.name || "Admin");
    return `https://ui-avatars.com/api/?name=${n}&background=0b1220&color=ffffff`;
  }, [adminData.name]);

  async function fetchAdmin() {
    setErr("");
    setOkMsg("");

    const { userId } = getAuth();
    if (!userId) {
      setErr(`userId not found in localStorage. Re-login first.`);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/api/users/${userId}`);
      const u = res.data?.data ?? res.data;

      setBackendUser(u);

      setAdminData({
        name: u?.name ?? "Admin User",
        email: u?.email ?? "admin@company.com",
        contactNumber: u?.contactNumber ?? "",
        address: u?.address ?? "",
        gender: u?.gender ?? "MALE",
      });

      if (u?.name) localStorage.setItem("name", u.name);
      if (u?.email) localStorage.setItem("email", u.email);
    } catch (e) {
      setErr(extractAxiosError(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAdmin();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Uses PUT /api/users/{id} (UserUpdateDTO)
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setErr("");
    setOkMsg("");

    const { userId } = getAuth();
    if (!userId) return setErr("userId missing. Re-login.");
    if (!backendUser) return setErr("User not loaded. Click Refresh.");

    if (!adminData.name.trim()) return setErr("Name is required.");
    if (!adminData.email.trim()) return setErr("Email is required.");
    if (!/^\d{10}$/.test(adminData.contactNumber.trim())) {
      return setErr("Contact number must be 10 digits.");
    }
    if (!adminData.address.trim()) return setErr("Address is required.");

    setSavingProfile(true);
    try {
      const payload = {
        // ✅ UserUpdateDTO fields
        name: adminData.name.trim(),
        email: adminData.email.trim(),
        role: backendUser.role,          // keep same role
        contactNumber: adminData.contactNumber.trim(),
        address: adminData.address.trim(),
        gender: adminData.gender,        // MALE/FEMALE/OTHER
        salary: backendUser.salary,      // keep same salary
        status: backendUser.status,      // keep same status
      };

      const res = await api.put(`/api/users/${userId}`, payload);
      const updated = res.data?.data ?? res.data;

      setBackendUser(updated);
      setShowEditForm(false);
      setOkMsg("Profile updated successfully.");

      localStorage.setItem("name", payload.name);
      localStorage.setItem("email", payload.email);
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
    if (!userId) return setErr("userId missing. Re-login.");

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
      setErr(extractAxiosError(e2));
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 h-[500px] w-[950px] rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <main className="relative p-6 md:p-10 w-full">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Admin Profile</h1>
              <p className="mt-2 text-sm text-white/65">Manage your profile and security settings</p>
            </div>

            <button
              onClick={fetchAdmin}
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

          <div className="rounded-3xl bg-white/5 p-6 md:p-8 ring-1 ring-white/10 backdrop-blur-xl shadow-lg shadow-black/20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <img
                    src={profileImage || avatarUrl}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover ring-2 ring-white/10"
                  />
                  <label className="absolute -bottom-2 -right-2 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-white/90 hover:bg-white/15 cursor-pointer transition">
                    <Camera size={14} />
                    Change
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl md:text-2xl font-extrabold">{adminData.name}</h2>
                    <span className={`inline-flex px-3 py-1 rounded-xl text-xs font-bold ring-1 ${roleBadgeClass(storedRole)}`}>
                      {normalizeRole(storedRole) || normalizeRole(backendUser?.role) || "ADMIN"}
                    </span>
                  </div>

                  <div className="mt-1 inline-flex items-center gap-2 text-xs text-white/60">
                    <ShieldCheck size={14} className="text-cyan-300" />
                    {roleTitle(storedRole || backendUser?.role)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowEditForm((v) => !v);
                    setShowPasswordForm(false);
                    setErr("");
                    setOkMsg("");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-white font-semibold shadow-lg shadow-blue-600/25 hover:opacity-95 transition"
                  type="button"
                >
                  <Pencil size={18} />
                  Edit Profile
                </button>

                <button
                  onClick={() => {
                    setShowPasswordForm((v) => !v);
                    setShowEditForm(false);
                    setErr("");
                    setOkMsg("");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white/85 font-semibold hover:bg-white/10 transition"
                  type="button"
                >
                  <KeyRound size={18} />
                  Change Password
                </button>
              </div>
            </div>

            {/* Info grid (NO department) */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold text-white/50">Email</p>
                <p className="mt-1 font-semibold text-white/90">{adminData.email}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold text-white/50">Contact Number</p>
                <p className="mt-1 font-semibold text-white/90">{adminData.contactNumber || "-"}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
                <p className="text-xs font-bold text-white/50">Address</p>
                <p className="mt-1 font-semibold text-white/90 break-words">{adminData.address || "-"}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold text-white/50">Gender</p>
                <p className="mt-1 font-semibold text-white/90">{adminData.gender || "-"}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold text-white/50">Account Status</p>
                <span className="mt-2 inline-flex px-3 py-1 rounded-xl text-xs font-bold ring-1 bg-emerald-500/20 text-emerald-200 ring-emerald-500/30">
                  {backendUser?.status ? String(backendUser.status) : "ACTIVE"}
                </span>
              </div>
            </div>

            {/* Edit Profile Form */}
            {showEditForm && (
              <form onSubmit={handleProfileSave} className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10">
                <h3 className="text-lg font-extrabold">Edit Profile</h3>
                <p className="text-sm text-white/60 mt-1">Update your information.</p>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-white/60 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={adminData.name}
                      onChange={handleProfileChange}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-cyan-500/40"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-white/60 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={adminData.email}
                      onChange={handleProfileChange}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-cyan-500/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-2">Contact Number</label>
                    <input
                      type="text"
                      name="contactNumber"
                      value={adminData.contactNumber}
                      onChange={handleProfileChange}
                      placeholder="10 digits"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-cyan-500/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={adminData.gender}
                      onChange={handleProfileChange}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-500/40"
                    >
                      <option value="MALE">MALE</option>
                      <option value="FEMALE">FEMALE</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-white/60 mb-2">Address</label>
                    <textarea
                      name="address"
                      value={adminData.address}
                      onChange={handleProfileChange}
                      rows={3}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-cyan-500/40"
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="px-6 py-2.5 rounded-2xl border border-white/10 bg-white/5 text-white/80 font-semibold hover:bg-white/10 transition"
                    disabled={savingProfile}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20 hover:opacity-95 transition disabled:opacity-60"
                    disabled={savingProfile}
                  >
                    {savingProfile && <Loader2 className="animate-spin" size={16} />}
                    Save
                  </button>
                </div>
              </form>
            )}

            {/* Change Password Form */}
            {showPasswordForm && (
              <form onSubmit={handlePasswordSubmit} className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10">
                <h3 className="text-lg font-extrabold">Change Password</h3>

                <div className="mt-5 space-y-4">
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Current Password"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-cyan-500/40"
                  />
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="New Password"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-cyan-500/40"
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm New Password"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-cyan-500/40"
                  />
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="px-6 py-2.5 rounded-2xl border border-white/10 bg-white/5 text-white/80 font-semibold hover:bg-white/10 transition"
                    disabled={savingPw}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20 hover:opacity-95 transition disabled:opacity-60"
                    disabled={savingPw}
                  >
                    {savingPw && <Loader2 className="animate-spin" size={16} />}
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
