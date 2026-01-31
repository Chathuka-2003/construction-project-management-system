// src/components/common/MainLayout.jsx
import React from "react";
import AdminLayout from "../../layouts/AdminLayout";
import StaffLayout from "../../layouts/StaffLayout";

export default function MainLayout({ role, children }) {
  // Render only the layout for the current role
  if (role === "admin") {
    return <AdminLayout>{children}</AdminLayout>;
  }
  return <StaffLayout>{children}</StaffLayout>;
}
