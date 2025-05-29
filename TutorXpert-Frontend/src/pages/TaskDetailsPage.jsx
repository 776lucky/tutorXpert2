// src/pages/TaskDetailsPage.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const TaskDetailsPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [task, setTask] = useState(null);
  console.log("📦 TaskDetailsPage loaded. ID:", id);
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tasks/${id}`);
        setTask(res.data);
      } catch (err) {
        console.error("❌ Failed to load task:", err);
        toast({
          title: "Error",
          description: "Failed to load task details.",
          variant: "destructive",
        });
      }
    };

    fetchTask();
  }, [id, toast]);

  if (!task) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto my-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{task.title}</CardTitle>
          <p className="text-muted-foreground mt-2">Subject: {task.subject}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <p><strong>Description:</strong> {task.description}</p>
          <p><strong>Budget:</strong> {task.budget}</p>
          <p><strong>Deadline:</strong> {task.deadline}</p>
          <p><strong>Address:</strong> {task.address}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDetailsPage;
