import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const MyTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id || !user?.token) return;

    axios.get(`${import.meta.env.VITE_API_BASE_URL}/tasks/my_tasks`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }).then((res) => setTasks(res.data));
  }, [user]);

  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/tasks/${taskId}`);
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  return (
    <div className="p-6 min-h-screen text-foreground bg-background">
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="text-2xl font-bold mb-6"
      >
        My Posted Tasks
      </motion.h1>

      {tasks.length === 0 ? (
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-muted-foreground"
        >
          No tasks posted.
        </motion.p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task, idx) => (
            <motion.div
              key={task.id}
              className="border rounded-lg p-4 bg-card shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <h2 className="font-semibold text-lg text-primary">{task.title}</h2>
              <p className="text-sm text-muted-foreground">Subject: {task.subject}</p>
              <p className="text-sm text-muted-foreground">Budget: ${task.budget}</p>
              <p className="text-sm text-muted-foreground">
                Deadline: {task.deadline || "N/A"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => navigate(`/projects/${task.id}`)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => navigate(`/tasks/${task.id}/applications`)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View Applications
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasksPage;
