import React, { useState } from "react";
import toast from "react-hot-toast";
import { HardHat } from "lucide-react";

export default function AddWorkerform() {
  const [formData, setFormData] = useState({
    workerName: "",
    workerId: "",
    phoneNumber: "",
    address: "",
    jobRole: "",
    dailyRate: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validation + Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      "workerName",
      "workerId",
      "phoneNumber",
      "address",
      "email",
      "password",
      "jobRole",
      "dailyRate",
      "gender",
    ];

    // Check empty fields
    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error("Please fill all required fields!");
        return;
      }
    }

    // If valid
    console.log("Submitted Worker Data:", formData);
    toast.success("Worker added successfully!");

    // Clear form
    setFormData({
      workerName: "",
     email:"",
     password:"",
      phoneNumber: "",
      address: "",
      jobRole: "",
      dailyRate: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        
        <h2 className="text-2xl font-bold text-amber-600 mb-6 flex items-center gap-2">
          <HardHat /> Add New Worker
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input name="workerName" value={formData.workerName} onChange={handleChange}
            placeholder="Worker Name" className="input" />
             <input name="address" value={formData.address} onChange={handleChange}
            placeholder="Address" className="input" />

          

          <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
            placeholder="Phone Number" className="input" />

          <input name="address" value={formData.address} onChange={handleChange}
            placeholder="Address" className="input" />

             <input name="email" value={formData.email} onChange={handleChange}
            placeholder="Email" className="input" />

             <input name="password" value={formData.address} onChange={handleChange}
            placeholder="Address" className="input" />

          <input name="jobRole" value={formData.jobRole} onChange={handleChange}
            placeholder="Job Role (e.g. Electrician)" className="input" />

          <input name="dailyRate" value={formData.dailyRate} onChange={handleChange}
            placeholder="Daily Rate (LKR)" className="input" />

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Add Worker
          </button>

        </form>
      </div>

      {/* Shared input styling */}
      <style>
        {`
          .input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
            outline: none;
          }
          .input:focus {
            border-color: #f59e0b;
            box-shadow: 0 0 0 1px #f59e0b;
          }
        `}
      </style>
    </div>
  );
}
