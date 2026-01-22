// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CMSLoginForm from "./pages/auth/Login"; // your Login.jsx
import AdminOverview from "./pages/admin/AdminOverview";//AdminOverview
import StaffOverview from "./pages/staff/StaffOverview"; //staff dashboard




function App() {
  return (
    <Router>
      <Routes>
        {/* Only login page for now */}
        <Route path="/" element={<CMSLoginForm />} />
        <Route path="/admin" element={<AdminOverview />}/>
        <Route path="/staff" element={<StaffOverview/>}/>

      </Routes>
    </Router>
  );
}

export default App;


