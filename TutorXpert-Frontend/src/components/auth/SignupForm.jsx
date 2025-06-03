import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddressAutoComplete from "@/components/AddressAutoComplete";
import { useNavigate } from "react-router-dom";



const SignupForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "tutor",
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
    lat: null,
    lng: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/register`, form);
      alert("Signup successful!");
      navigate("/dashboard");  // ✅ 注册成功后跳转
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* 1. role select */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Sign Up As</label>
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full border rounded px-3 py-2 bg-background text-foreground"
        >
          <option value="tutor">Tutor</option>
          <option value="student">Student</option>
        </select>
      </div>



      {/* 2. personal information */}
      <Input
        placeholder="First Name"
        value={form.first_name}
        onChange={(e) => setForm({ ...form, first_name: e.target.value })}
      />
      <Input
        placeholder="Last Name"
        value={form.last_name}
        onChange={(e) => setForm({ ...form, last_name: e.target.value })}
      />
      <Input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <Input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <Input
        placeholder="Phone Number"
        value={form.phone_number}
        onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
      />

  
      {/* 3. Address auto-filled */}
      <AddressAutoComplete form={form} setForm={setForm} />


      {/* 4. submit button */}
      <Button type="submit" className="w-full">Sign Up</Button>
    </form>
  );
};

export default SignupForm;
