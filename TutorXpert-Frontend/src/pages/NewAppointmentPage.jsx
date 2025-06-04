// src/pages/NewAppointmentPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const NewAppointmentPage = () => {
  const { tutor_id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [slots, setSlots] = useState([]);
  const [slotId, setSlotId] = useState("");
  const [message, setMessage] = useState("");
  const studentId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    if (tutor_id) {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/availability/tutor/${tutor_id}`)
        .then((res) => {
          setSlots(res.data);  // ✅ 不做过滤，后续再判断 is_booked
        })
        .catch((err) => {
          console.error("❌ Failed to load tutor slots:", err);
          toast({
            title: "Error",
            description: "Failed to load available time slots.",
            variant: "destructive",
          });
        });
    }
  }, [tutor_id]);
  

  const handleSubmit = async () => {
    if (!slotId) {
      toast({
        title: "Select a time",
        description: "Please select a slot",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/appointments/`, {
        student_id: studentId,
        tutor_id: parseInt(tutor_id),
        slot_id: parseInt(slotId),
        message,
      });

      toast({
        title: "Request Sent",
        description: "Appointment submitted successfully.",
      });
      navigate("/dashboard/appointments"); // ✅ redirect after success
    } catch (err) {
      console.error("❌ Failed to create appointment:", err);
      toast({
        title: "Submission failed",
        description: err.response?.data?.detail || "Unknown error.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 space-y-6">
      <h1 className="text-3xl font-bold">Book Appointment</h1>

      <div className="space-y-4">
        <div>
          <Label>Select Time Slot</Label>
          <Select value={slotId} onValueChange={setSlotId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a time slot" />
            </SelectTrigger>
            <SelectContent>
            {slots.map((s) => (
                <SelectItem
                key={s.id}
                value={s.id.toString()}
                disabled={s.is_booked} // 禁用已预约的 slot
                className={s.is_booked ? "opacity-50 pointer-events-none" : ""}
                >
                {s.subject} – {s.start_time} → {s.end_time}
                {s.is_booked && " (Booked)"}
                </SelectItem>
            ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Message</Label>
          <Textarea
            placeholder="Write a note..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="pt-4 flex gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!slotId}>
            Submit Request
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewAppointmentPage;
