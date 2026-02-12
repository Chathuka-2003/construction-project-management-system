import React, { useState } from "react";

import { UserPlus } from "lucide-react";

export default function AddUserform() {
  const [formData, setFormData] = useState({
    username: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    employeeId: "",
    jobTitle: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validation + Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Required fields list
    const requiredFields = [
      "username",
      "emailAddress",
      "password",
      "confirmPassword",
      "firstName",
      "lastName",
      "phoneNumber",
      "employeeId",
      "jobTitle",
    ];

    // Check empty fields
    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error("Please fill all required fields!");
        return;
      }
    }

    // Check password match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // If all valid
    console.log("Submitted User Data:", formData);
    toast.success("User created successfully!");

    // Clear form after success
    setFormData({
      username: "",
      emailAddress: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      employeeId: "",
      jobTitle: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        
        <h2 className="text-2xl font-bold text-orange-600 mb-6 flex items-center gap-2">
          <UserPlus /> Add New User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input name="username" value={formData.username} onChange={handleChange}
            placeholder="Username" className="input" />

          <input name="emailAddress" value={formData.emailAddress} onChange={handleChange}
            placeholder="Email Address" className="input" />

          <input type="password" name="password" value={formData.password} onChange={handleChange}
            placeholder="Password" className="input" />

          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
            placeholder="Confirm Password" className="input" />

          <input name="firstName" value={formData.firstName} onChange={handleChange}
            placeholder="First Name" className="input" />

          <input name="lastName" value={formData.lastName} onChange={handleChange}
            placeholder="Last Name" className="input" />

          <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
            placeholder="Phone Number" className="input" />

          <input name="employeeId" value={formData.employeeId} onChange={handleChange}
            placeholder="Employee ID" className="input" />

          <input name="jobTitle" value={formData.jobTitle} onChange={handleChange}
            placeholder="Job Title" className="input" />

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Create User
          </button>

        </form>
      </div>

      {/* Tailwind reusable input style */}
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
            border-color: #fb923c;
            box-shadow: 0 0 0 1px #fb923c;
          }
        `}
      </style>
    </div>
  );
}
