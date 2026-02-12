import React from "react";
import AdminLayout from "../../layouts/AdminLayout";
import StaffLayout from "../../layouts/StaffLayout";

export default function MainLayout({ role }) {
  if (role === "admin") return <AdminLayout />;
  return <StaffLayout />;
}
