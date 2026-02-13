import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import CustomerLayout from "./layouts/CustomerLayout";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
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
      <Toaster position="top-center" />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<CustomerDashboard />} />
          <Route path="dashboard" element={<CustomerDashboard />} />

          <Route path="project-details" element={<ProjectDetails />} />
          <Route path="project-details/:id" element={<ProjectDetails />} />

          <Route path="taskprogress" element={<TaskProgress />} />
          <Route path="taskprogress/:projectId" element={<TaskProgress />} />

          <Route path="payments" element={<Payments />} />
          <Route path="appointments" element={<Appointments />} />

          <Route path="messages" element={<Messages/>} />

          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
