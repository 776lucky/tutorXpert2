import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input"; // ✅ 加在顶部
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/profiles/${storedUser.id}`, formData);
      setProfile(formData);
      setIsEditing(false);
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
        <strong>First Name:</strong>
        {isEditing ? (
          <input name="first_name" value={formData.first_name || ""} onChange={handleChange} />
        ) : (
          profile.first_name
        )}
      </div>
      <div>
        <strong>Last Name:</strong>
        {isEditing ? (
          <input name="last_name" value={formData.last_name || ""} onChange={handleChange} />
        ) : (
          profile.last_name
        )}
      </div>
      <div>
        <strong>Phone:</strong>
        {isEditing ? (
          <input name="phone_number" value={formData.phone_number || ""} onChange={handleChange} />
        ) : (
          profile.phone_number || "N/A"
        )}
      </div>
      <div>
        <strong>Education Level:</strong>
        {isEditing ? (
          <input name="education_level" value={formData.education_level || ""} onChange={handleChange} />
        ) : (
          profile.education_level || "N/A"
        )}
      </div>
      <div>
        <strong>Major:</strong>
        {isEditing ? (
          <input name="major" value={formData.major || ""} onChange={handleChange} />
        ) : (
          profile.major || "N/A"
        )}
      </div>
      <div>
        <strong>Subjects:</strong>
        {isEditing ? (
          <input name="subjects" value={formData.subjects || ""} onChange={handleChange} />
        ) : (
          profile.subjects || "N/A"
        )}
      </div>
      <div>
        <strong>Availability:</strong>
        {isEditing ? (
          <input name="availability" value={formData.availability || ""} onChange={handleChange} />
        ) : (
          profile.availability || "N/A"
        )}
      </div>
      <div>
        <strong>Address:</strong>
        {isEditing ? (
          <input name="address" value={formData.address || ""} onChange={handleChange} />
        ) : (
          profile.address || "N/A"
        )}
      </div>
      <div>
        <strong>Experience:</strong>
        {isEditing ? (
          <select name="has_experience" value={formData.has_experience ? "yes" : "no"} onChange={(e) =>
            setFormData((prev) => ({ ...prev, has_experience: e.target.value === "yes" }))
          }>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        ) : (
          profile.has_experience ? "Yes" : "No"
        )}
      </div>
      {formData.has_experience && (
        <div className="md:col-span-2">
          <strong>Experience Details:</strong>
          {isEditing ? (
            <textarea name="experience_details" value={formData.experience_details || ""} onChange={handleChange} />
          ) : (
            profile.experience_details || "N/A"
          )}
        </div>
      )}
      <div>
        <strong>Working With Children Check:</strong>
        {isEditing ? (
          <input name="working_with_children_check" value={formData.working_with_children_check || ""} onChange={handleChange} />
        ) : (
          profile.working_with_children_check || "N/A"
        )}
      </div>
      <div>
        <strong>Certifications:</strong>
        {isEditing ? (
          <input name="certifications" value={formData.certifications || ""} onChange={handleChange} />
        ) : (
          profile.certifications || "N/A"
        )}
      </div>
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
