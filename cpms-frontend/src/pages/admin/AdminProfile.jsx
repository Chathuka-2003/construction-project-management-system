// src/pages/admin/AdminProfile.jsx
import React, { useState } from "react";

export default function AdminProfile() {
  const [profileImage, setProfileImage] = useState(null);

  const [adminData, setAdminData] = useState({
    name: "Admin User",
    email: "admin@company.com",
    department: "System Administration",
  });

  const [showEditForm, setShowEditForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handlers
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setShowEditForm(false);
    console.log("Updated profile:", adminData);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("Password changed");
    setShowPasswordForm(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Admin Profile</h1>

      <div className="bg-white rounded-xl shadow border p-6 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={
                profileImage ||
                "https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff"
              }
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border"
            />
            <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded cursor-pointer">
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
            <h2 className="text-xl font-medium">{adminData.name}</h2>
            <p className="text-sm text-gray-500">System Administrator</p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{adminData.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Department</p>
            <p className="font-medium">{adminData.department}</p>
          </div>
          <div>
            <p className="text-gray-500">Role</p>
            <p className="font-medium">Admin</p>
          </div>
          <div>
            <p className="text-gray-500">Account Status</p>
            <p className="font-medium text-green-600">Active</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowEditForm(!showEditForm);
              setShowPasswordForm(false);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            Edit Profile
          </button>

          <button
            onClick={() => {
              setShowPasswordForm(!showPasswordForm);
              setShowEditForm(false);
            }}
            className="px-4 py-2 bg-gray-200 rounded-lg text-sm"
          >
            Change Password
          </button>
        </div>

        {/* Edit Profile Form */}
        {showEditForm && (
          <form
            onSubmit={handleProfileSave}
            className="border rounded-lg p-4 space-y-4 bg-gray-50"
          >
            <h3 className="font-medium">Edit Profile</h3>

            <input
              type="text"
              name="name"
              value={adminData.name}
              onChange={handleProfileChange}
              placeholder="Name"
              className="w-full border rounded px-3 py-2 text-sm"
            />

            <input
              type="email"
              name="email"
              value={adminData.email}
              onChange={handleProfileChange}
              placeholder="Email"
              className="w-full border rounded px-3 py-2 text-sm"
            />

            <input
              type="text"
              name="department"
              value={adminData.department}
              onChange={handleProfileChange}
              placeholder="Department"
              className="w-full border rounded px-3 py-2 text-sm"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowEditForm(false)}
                className="px-4 py-2 bg-gray-300 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Change Password Form */}
        {showPasswordForm && (
          <form
            onSubmit={handlePasswordSubmit}
            className="border rounded-lg p-4 space-y-4 bg-gray-50"
          >
            <h3 className="font-medium">Change Password</h3>

            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Current Password"
              className="w-full border rounded px-3 py-2 text-sm"
            />

            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="New Password"
              className="w-full border rounded px-3 py-2 text-sm"
            />

            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm New Password"
              className="w-full border rounded px-3 py-2 text-sm"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
              >
                Update Password
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className="px-4 py-2 bg-gray-300 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
