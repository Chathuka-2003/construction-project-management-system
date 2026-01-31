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

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-6">Admin Profile</h1>

      <div className="bg-white rounded-xl shadow border p-6 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-6">
          <img
            src={
              profileImage ||
              "https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff"
            }
            className="w-20 h-20 rounded-full border"
          />
          <div>
            <h2 className="text-xl font-medium">{adminData.name}</h2>
            <p className="text-sm text-gray-500">System Administrator</p>
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{adminData.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Department</p>
            <p className="font-medium">{adminData.department}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
