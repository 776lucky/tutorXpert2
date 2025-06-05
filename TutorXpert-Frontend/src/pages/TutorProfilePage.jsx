import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";


const TutorProfilePage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/profiles/${id}`)
      .then(res => setProfile(res.data))
      .catch(() => setError("Failed to load profile"));
  }, [id]);

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!profile) {
    return <div className="p-6 text-muted-foreground">Loading...</div>;
  }

  const display = (val) => val || "—";

  return (
    <div className="p-6 max-w-4xl mx-auto text-foreground bg-background min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">{profile.first_name} {profile.last_name}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><strong>Phone:</strong> {display(profile.phone_number)}</div>
          <div><strong>Education:</strong> {display(profile.education_level)}</div>
          <div><strong>Major:</strong> {display(profile.major)}</div>
          <div><strong>Hourly Rate:</strong> {profile.hourly_rate ? `$${profile.hourly_rate}/hour` : "—"}</div>
          <div><strong>Working With Children Check:</strong> {profile.working_with_children_check ? "Yes" : "No"}</div>
          <div><strong>Has Experience:</strong> {profile.has_experience ? "Yes" : "No"}</div>
          <div><strong>Address:</strong> {display(profile.address)}</div>
          <div><strong>Certifications:</strong> {display(profile.certifications)}</div>

          {profile.subjects && (
            <div className="md:col-span-2">
              <strong>Subjects:</strong>{" "}
              {(Array.isArray(profile.subjects)
                ? profile.subjects
                : typeof profile.subjects === "string"
                  ? profile.subjects.split(",")
                  : []
              ).map((s, idx) => (
                <Badge key={idx} className="mr-2 mt-1 inline-block">{s.trim()}</Badge>
              ))}
            </div>
          )}

          {profile.has_experience && (
            <div className="md:col-span-2">
              <strong>Experience:</strong>
              <p className="mt-1">{display(profile.experience_details)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <Button
          onClick={async () => {
            try {
              await axios.post(`${import.meta.env.VITE_API_BASE_URL}/messages/`, {
                sender_id: user.id,
                receiver_id: parseInt(id),
                text: "Hi, I’d like to learn more about your tutoring!"
              });
              navigate(`/dashboard/messages?tutor_id=${id}`);
            } catch (err) {
              console.error("❌ Failed to send message", err);
              alert("Failed to send message");
            }
          }}
        >
          Send a Message
        </Button>
      </div>


    </div>
  );
};

export default TutorProfilePage;
