import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
const AppointmentDialog = ({ open, onClose, tutor }) => {
  const { toast } = useToast();
  const [slots, setSlots] = useState([]);
  const [slotId, setSlotId] = useState("");
  const [message, setMessage] = useState("");

  const studentId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    if (tutor?.id && open) {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/availability/tutor/${tutor.id}`)
        .then((res) => {
          console.log("API Response for tutor", tutor.id, ":", res.data);
          setSlots(res.data);
          if (res.data.length === 0) {
            toast({
              title: "No Availability",
              description: "This tutor has no available time slots. Please try another tutor.",
              variant: "destructive",
            });
            onClose();
          }
        })
        .catch((err) => {
          console.error("❌ Failed to load slots for tutor", tutor.id, ":", err.response?.data || err.message);
          toast({
            title: "Error",
            description: "Could not load available time slots.",
            variant: "destructive",
          });
          onClose();
        });
    }
  }, [tutor, open, onClose, toast]);

  const handleSubmit = async () => {
    if (!slotId) {
      toast({
        title: "Select a time",
        description: "Please select a time slot",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/appointments/`, {
        student_id: studentId,
        tutor_id: tutor.id,
        slot_id: parseInt(slotId),
        message,
      });

      toast({
        title: "Request sent",
        description: "Appointment request submitted!",
      });
      setSlotId("");
      setMessage("");
      onClose();
    } catch (err) {
      console.error("❌ Appointment creation failed", err);
      toast({
        title: "Failed",
        description: err.response?.data?.detail || "Could not submit appointment.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby="appointment-description">
        <DialogHeader>
          <DialogTitle>
            Book Appointment with {tutor?.name || "Unknown Tutor"}
          </DialogTitle>
          <DialogDescription id="appointment-description">
            Select a time slot and write a short message to request tutoring.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Available Time Slot</Label>
            <Select value={slotId} onValueChange={setSlotId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {slots.length === 0 ? (
                  <div className="px-3 py-2 text-muted-foreground text-sm">
                    No available slots for this tutor. Please try another tutor or check back later.
                  </div>
                ) : (
                  slots.map((slot) => (
                    <SelectItem key={slot.id} value={slot.id.toString()}>
                      {slot.subject} – {slot.start_time} → {slot.end_time}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Message</Label>
            <Textarea
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={slots.length === 0}>
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;