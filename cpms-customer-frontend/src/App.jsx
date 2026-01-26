import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import CustomerLayout from "./layouts/CustomerLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import CustomerDashboard from "./pages/customer/CustomerDashboard";
import ProjectDetails from "./pages/customer/ProjectDetails";
import Payments from "./pages/customer/Payments";
import Appointments from "./pages/customer/Appointments";
import Messages from "./pages/customer/Messages";
import Profile from "./pages/customer/Profile";
import TaskProgress from "./pages/customer/TaskProgress";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer Routes */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<CustomerDashboard />} />
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="Project-details" element={<ProjectDetails />} />
          <Route path="payments" element={<Payments />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
          <Route path="taskprogress" element={<TaskProgress />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
