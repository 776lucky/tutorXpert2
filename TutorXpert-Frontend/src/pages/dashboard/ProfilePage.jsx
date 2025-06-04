import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input"; // ✅ 加在顶部
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AddressAutoComplete from "@/components/AddressAutoComplete";




const ProfilePage = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isTutor = storedUser?.role === "tutor";

  useEffect(() => {
    if (!storedUser?.id) {
      setFetchError("No user ID found in local storage");
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/profiles/${storedUser.id}`);
        console.log("Fetched profile:", res.data);  // ✅ 添加这行
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);  // ✅ 查看控制台是否报错
        setFetchError("Failed to load profile. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    

    fetchProfile();
  }, [storedUser?.id]);

  useEffect(() => {
    if (profile) {
      setFormData({ ...profile });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]: name === "hourly_rate" ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/profiles/${storedUser.id}`, formData);
      setProfile(formData);
      setIsEditing(false);
      toast({
        title: "Edited successfully!",
        duration: 2000,
        className: "bg-green-500 text-white shadow-md",
      });
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };
  

  const renderStudentProfile = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block mb-1 font-medium">First Name</label>
        <Input name="first_name" value={formData.first_name || ""} onChange={handleChange} className="text-white" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Last Name</label>
        <Input name="last_name" value={formData.last_name || ""} onChange={handleChange} className="text-white" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Education Level</label>
        <Input name="education_level" value={formData.education_level || ""} onChange={handleChange} className="text-white" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Availability</label>
        <Input name="availability" value={formData.availability || ""} onChange={handleChange} className="text-white" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Address</label>
        <Input name="address" value={formData.address || ""} onChange={handleChange} className="text-white" />
      </div>
    </div>
  );


  const renderTutorProfile = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  
      <div>
        <label className="block mb-1 font-medium">First Name</label>
        <Input name="first_name" value={formData.first_name || ""} onChange={handleChange} className="text-white" />
      </div>
  
      <div>
        <label className="block mb-1 font-medium">Last Name</label>
        <Input name="last_name" value={formData.last_name || ""} onChange={handleChange} className="text-white" />
      </div>
  
      <div>
        <label className="block mb-1 font-medium">Phone Number</label>
        <Input name="phone_number" value={formData.phone_number || ""} onChange={handleChange} className="text-white" />
      </div>
  
      <div>
        <label className="block mb-1 font-medium">Education Level</label>
        <select
          name="education_level"
          value={formData.education_level || ""}
          onChange={handleChange}
          className="w-full bg-background text-white border border-input rounded-md px-3 py-2"
        >
          <option value="">Select</option>
          <option value="High School">High School</option>
          <option value="Bachelor">Bachelor</option>
          <option value="Master">Master</option>
          <option value="PhD">PhD</option>
        </select>
      </div>
  
      <div>
        <label className="block mb-1 font-medium">Major</label>
        <Input name="major" value={formData.major || ""} onChange={handleChange} className="text-white" />
      </div>
  
      <div>
        <label className="block mb-1 font-medium">Subjects (comma separated)</label>
        <Input name="subjects" value={formData.subjects || ""} onChange={handleChange} className="text-white" />
      </div>
  
      <div>
        <label className="block mb-1 font-medium">Hourly Rate ($/hr)</label>
        <Input
          type="number"
          name="hourly_rate"
          value={formData.hourly_rate || ""}
          onChange={handleChange}
          className="text-white"
        />
      </div>
  
      <div className="md:col-span-2">
        <label className="block mb-1 font-medium">Address</label>
        <AddressAutoComplete form={formData} setForm={setFormData} />
      </div>
  
      <div>
        <label className="block mb-1 font-medium">Working With Children Check</label>
        <select
          name="working_with_children_check"
          value={formData.working_with_children_check ? "yes" : "no"}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              working_with_children_check: e.target.value === "yes",
            }))
          }
          className="w-full bg-background text-white border border-input rounded-md px-3 py-2"
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
  
      <div>
        <label className="block mb-1 font-medium">Certifications</label>
        <Input name="certifications" value={formData.certifications || ""} onChange={handleChange} className="text-white" />
      </div>
  
      <div>
        <label className="block mb-1 font-medium">Has Experience</label>
        <select
          name="has_experience"
          value={formData.has_experience ? "yes" : "no"}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, has_experience: e.target.value === "yes" }))
          }
          className="w-full bg-background text-white border border-input rounded-md px-3 py-2"
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
  
      {formData.has_experience && (
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Experience Details</label>
          <textarea
            name="experience_details"
            value={formData.experience_details || ""}
            onChange={handleChange}
            className="w-full bg-background text-white border border-input rounded-md px-3 py-2"
          />
        </div>
      )}
    </div>
  );
  






  

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 md:px-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-2xl">My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Loading profile...</p>
            ) : fetchError ? (
              <p className="text-red-500">{fetchError}</p>
            ) : isTutor ? (
              renderTutorProfile()
            ) : (
              renderStudentProfile()
            )}

            {!isLoading && !fetchError && (
              <div className="mt-6 flex gap-4">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave}>Save</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
