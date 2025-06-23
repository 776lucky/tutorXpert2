import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { format } from "date-fns";
import { motion } from "framer-motion";

const AvailabilityPage = () => {
  const { toast } = useToast();
  const [loadingToastId, setLoadingToastId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [slots, setSlots] = useState([]);
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };
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
      // 刷新 slot 列表
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/availability/tutor/${user.id}`);
      setSlots(res.data);
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
    <div className="min-h-screen bg-background text-foreground px-4 py-12 flex justify-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full max-w-xl flex flex-col items-center gap-16"
      >

      {/* 设置可预约时间段 */}
      <div className="w-full max-w-xl space-y-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-primary">📅 Set Available Time Slot</h2>
          <p className="text-muted-foreground text-sm">Specify the subject and time slot you are available for tutoring.</p>
        </div>

        <div className="space-y-5 bg-card p-6 rounded-2xl shadow-xl border border-primary/30">

          {/* Subject */}
          <div className="space-y-1">
            <Label className="text-sm text-foreground">Subject</Label>
            <Input
              name="subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="bg-background border border-primary/30 focus:ring-primary focus:border-primary text-foreground transition"
              placeholder="e.g. Math"
            />
          </div>

          {/* Start Time */}
          <div className="space-y-1">
            <Label className="text-sm text-foreground">Start Time</Label>
            <DatePicker
              selected={form.start_time}
              onChange={(date) => setForm({ ...form, start_time: date })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              placeholderText="Select start time"
              className="w-full px-3 py-2 rounded-md border border-primary/30 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
          </div>

          {/* End Time */}
          <div className="space-y-1">
            <Label className="text-sm text-foreground">End Time</Label>
            <DatePicker
              selected={form.end_time}
              onChange={(date) => setForm({ ...form, end_time: date })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              placeholderText="Select end time"
              className="w-full px-3 py-2 rounded-md border border-primary/30 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
          </div>

          <Button onClick={handleSubmit} className="w-full mt-2">
            Submit
          </Button>
        </div>
      </div>

      <hr className="w-full max-w-xl border-t border-muted/40" />

      {/* 当前已有时间段 */}
      <div className="w-full max-w-xl space-y-6">
        <h3 className="text-2xl font-semibold text-primary">🕒 Your Available Slots</h3>

        {slots.length === 0 ? (
          <p className="text-muted-foreground">No slots yet.</p>
        ) : (
          <div className="space-y-4">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="w-full bg-card border border-border rounded-xl p-5 shadow-md hover:shadow-lg transition-all"
              >
                <div className="text-sm space-y-2 text-foreground">
                  <div>
                    <p className="font-semibold">Subject</p>
                    <p>{slot.subject}</p>
                  </div>

                  <div>
                    <p className="font-semibold">Start</p>
                    <p>{new Date(slot.start_time).toLocaleString()}</p>
                  </div>

                  <div>
                    <p className="font-semibold">End</p>
                    <p>{new Date(slot.end_time).toLocaleString()}</p>
                  </div>

                  <div>
                    <p className="font-semibold">Status: <span className="text-orange-500 font-medium">{slot.is_booked ? "Booked" : "Available"}</span></p>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-muted text-muted-foreground hover:bg-muted/30 hover:text-destructive transition"
                    onClick={() => handleDelete(slot.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </motion.div>
    </div>
  );
};

export default AvailabilityPage;
