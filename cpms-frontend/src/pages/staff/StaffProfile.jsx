import { useEffect, useState } from "react";
import { useStore } from "../../components/store/AppStore.jsx";

export default function StaffProfile() {
  const { data, updateProfile } = useStore();

  // profile from store
  const profile = data.profile || {};

  // UI state
  const [showEditForm, setShowEditForm] = useState(false);

  // local editable form
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    residence: "",
    contact: "",
    birth: "",
    photoDataUrl: "",
  });

  // sync store -> form (when store changes)
  useEffect(() => {
    setForm({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      email: profile.email || "",
      residence: profile.residence || "",
      contact: profile.contact || "",
      birth: profile.birth || "",
      photoDataUrl: profile.photoDataUrl || "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    profile.firstName,
    profile.lastName,
    profile.email,
    profile.residence,
    profile.contact,
    profile.birth,
    profile.photoDataUrl,
  ]);

  // convert image -> dataURL so it persists in localStorage
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      setForm((f) => ({ ...f, photoDataUrl: dataUrl }));
      // save immediately to store
      updateProfile({ photoDataUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    // basic checks
    if (!form.firstName.trim()) return alert("First name is required");
    if (!form.email.trim()) return alert("Email is required");

    updateProfile({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      residence: form.residence.trim(),
      contact: form.contact.trim(),
      birth: form.birth,
      photoDataUrl: form.photoDataUrl || "",
    });

    setShowEditForm(false);
  };

  const fullName = `${form.firstName} ${form.lastName}`.trim() || "Staff User";

  // fallback avatar (if no photo)
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    fullName
  )}&background=10B981&color=fff`;

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-extrabold mb-6">Staff Profile</h1>

      <div className="bg-white rounded-[14px] shadow border p-6 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={form.photoDataUrl || fallbackAvatar}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border"
            />

            <label className="absolute -bottom-2 -right-2 bg-green-600 text-white text-xs px-2 py-1 rounded cursor-pointer font-bold">
              Change
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <h2 className="text-xl font-extrabold">{fullName}</h2>
            <p className="text-sm text-gray-500">
              {profile.role || "Staff"}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <Info label="Email" value={form.email || "—"} />
          <Info label="Residence" value={form.residence || "—"} />
          <Info label="Contact" value={form.contact || "—"} />
          <Info label="Birth Date" value={form.birth || "—"} />
          <Info label="Role" value={profile.role || "Staff"} />
          <Info label="Account Status" value="Active" valueClass="text-green-600" />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setShowEditForm((s) => !s)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold"
            type="button"
          >
            {showEditForm ? "Close Edit" : "Edit Profile"}
          </button>

          <button
            onClick={() => {
              // reset form to store values
              setForm({
                firstName: profile.firstName || "",
                lastName: profile.lastName || "",
                email: profile.email || "",
                residence: profile.residence || "",
                contact: profile.contact || "",
                birth: profile.birth || "",
                photoDataUrl: profile.photoDataUrl || "",
              });
              setShowEditForm(false);
            }}
            className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-bold"
            type="button"
          >
            Reset
          </button>
        </div>

        {/* Edit Form */}
        {showEditForm && (
          <form
            onSubmit={handleSave}
            className="border rounded-lg p-4 space-y-4 bg-gray-50"
          >
            <h3 className="font-extrabold">Edit Profile</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="w-full border rounded px-3 py-2 text-sm"
              />

              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border rounded px-3 py-2 text-sm"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                name="residence"
                value={form.residence}
                onChange={handleChange}
                placeholder="Residence"
                className="w-full border rounded px-3 py-2 text-sm"
              />

              <input
                type="text"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="Contact"
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>

            <input
              type="date"
              name="birth"
              value={form.birth}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowEditForm(false)}
                className="px-4 py-2 bg-gray-300 rounded text-sm font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded text-sm font-bold"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Info({ label, value, valueClass = "" }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className={`font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}
