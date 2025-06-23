import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const TutorApplyProjectPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const tutorId = user.id;

  const [task, setTask] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/tasks/${taskId}`)
      .then(res => setTask(res.data))
      .catch(err => console.error("Failed to fetch task", err));
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/task_applications`, {
        task_id: parseInt(taskId),
        tutor_id: tutorId,
        bid_amount: parseFloat(bidAmount),
        message,
      });
      toast({
        title: "Application submitted successfully",
        description: `You bid $${bidAmount} for "${task.title}"`,
      });
      navigate("/dashboard"); // 或跳回项目列表页
    } catch (err) {
      toast({
        title: "Submission failed",
        description: "You might have already applied or something went wrong.",
        variant: "destructive",
      });
    }
  };

  if (!task) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{task.title}</h1>
      <div className="space-y-2 text-sm text-muted-foreground">
        <p><strong>Subject:</strong> {task.subject}</p>
        <p><strong>Description:</strong> {task.description}</p>
        <p><strong>Address:</strong> {task.address}</p>
        <p><strong>Budget:</strong> ${task.budget}</p>
        <p><strong>Deadline:</strong> {task.deadline}</p>
        <p><strong>Posted by:</strong> {task.student?.profile?.first_name || "Unknown"}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <Input
          type="number"
          placeholder="Your Bid Amount"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          required
        />
        <Textarea
          placeholder="Your message to the student"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">Submit Application</Button>
      </form>
    </div>
  );
};

export default TutorApplyProjectPage;
