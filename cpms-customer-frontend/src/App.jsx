import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import CustomerLayout from "./layouts/CustomerLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import CustomerDashboard from "./pages/customer/CustomerDashboard";
import ProjectDetails from "./pages/customer/ProjectDetails";
import TaskProgress from "./pages/customer/TaskProgress";
import Payments from "./pages/customer/Payments";
import Appointments from "./pages/customer/Appointments";
import Messages from "./pages/customer/Messages";
import Profile from "./pages/customer/Profile";

function App() {
  return (
    <BrowserRouter>
      {/* Toaster */}
      <Toaster position="top-center" />

      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer layout */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<CustomerDashboard />} />
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="project-details" element={<ProjectDetails />} />
          <Route path="taskprogress" element={<TaskProgress />} />
          <Route path="payments" element={<Payments />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
