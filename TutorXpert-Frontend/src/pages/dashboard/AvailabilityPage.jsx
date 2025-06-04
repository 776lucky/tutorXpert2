import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { format } from "date-fns";


const AvailabilityPage = () => {
  const { toast } = useToast();
  const [loadingToastId, setLoadingToastId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [slots, setSlots] = useState([]);

  const [form, setForm] = useState({
    tutor_id: user?.id,
    subject: "",
    start_time: null,
    end_time: null,
  });

  const handleSubmit = async () => {
    if (!form.start_time || !form.end_time || !form.subject) {
      toast({
        title: "Missing Fields",
        description: "Please complete all fields",
        variant: "destructive",
      });
      return;
    }

    const toastId = Math.random().toString();
    setLoadingToastId(toastId);

    toast({
      id: toastId,
      title: "Submitting...",
      description: "Your slots are being created.",
    });

    const payload = [{
      tutor_id: form.tutor_id,
      subject: form.subject,
      start_time: format(form.start_time, "yyyy-MM-dd'T'HH:mm"),
      end_time: format(form.end_time, "yyyy-MM-dd'T'HH:mm"),
    }];

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/availability/`, payload);

      toast({
        id: toastId,
        title: "Slot added successfully!",
        description: "Time slot has been created.",
      });

      setForm({ ...form, subject: "", start_time: null, end_time: null });
    } catch (err) {
      toast({
        id: toastId,
        title: "Error",
        description: err.response?.data?.detail || "Failed to create slot.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (slotId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/availability/${slotId}`);
      toast({
        title: "Deleted",
        description: "Slot removed successfully",
      });
      setSlots((prev) => prev.filter((slot) => slot.id !== slotId));
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.detail || "Failed to delete slot.",
        variant: "destructive",
      });
    }
  };
  

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser?.id) return;
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/availability/tutor/${currentUser.id}`)
      .then((res) => setSlots(res.data))
      .catch((err) => console.error("Failed to load slots", err));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-12 flex flex-col items-center space-y-10">
      <div className="w-full max-w-md space-y-6 bg-card p-6 rounded-xl shadow-lg border border-primary/20">
        <h2 className="text-2xl font-bold text-primary mb-2">Set Available Time Slot</h2>

        <div className="space-y-2">
          <Label className="text-sm text-foreground">Subject</Label>
          <Input
            name="subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="bg-input border border-primary/30 focus:ring-primary focus:border-primary text-foreground"
            placeholder="e.g. Math"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-foreground">Start Time</Label>
          <DatePicker
            selected={form.start_time}
            onChange={(date) => setForm({ ...form, start_time: date })}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            placeholderText="Select start time"
            className="w-full px-3 py-2 rounded-md border border-primary/30 bg-card text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-foreground">End Time</Label>
          <DatePicker
            selected={form.end_time}
            onChange={(date) => setForm({ ...form, end_time: date })}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            placeholderText="Select end time"
            className="w-full px-3 py-2 rounded-md border border-primary/30 bg-card text-foreground"
          />
        </div>

        <Button onClick={handleSubmit} className="w-full mt-2">
          Submit
        </Button>
      </div>

      {/* 👇 显示已有 slots */}
      <div className="w-full max-w-md space-y-4">
        <h3 className="text-xl font-semibold">Your Available Time Slots</h3>
        {slots.length === 0 ? (
          <p className="text-muted">No slots yet.</p>
        ) : (
          slots.map((slot) => (
            <div key={slot.id} className="border p-4 rounded shadow-sm space-y-1">
              <p><strong>Subject:</strong> {slot.subject}</p>
              <p><strong>Start:</strong> {new Date(slot.start_time).toLocaleString()}</p>
              <p><strong>End:</strong> {new Date(slot.end_time).toLocaleString()}</p>
              <p><strong>Status:</strong> {slot.is_booked ? "Booked" : "Available"}</p>
              <Button
                variant="destructive"
                size="sm"
                className="mt-2"
                onClick={() => handleDelete(slot.id)}
              >
                Delete
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AvailabilityPage;