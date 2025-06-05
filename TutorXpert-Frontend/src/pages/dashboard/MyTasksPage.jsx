import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { List, Eye, Trash2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

const MyTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    if (!user?.id || !user?.token) return;
  
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/tasks/my_tasks`, {
        headers: {
          Authorization: `Bearer ${user.token}`,  // ✅ 加 token
        },
      })
      .then((res) => setTasks(res.data))
      .catch(() =>
        toast({
          title: "Failed to fetch tasks",
          description: "Please try again later.",
          variant: "destructive",
        })
      );
  }, [user]);
  

  const handleDelete = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      toast({
        title: "Task deleted",
        description: "The task was deleted successfully.",
      });
    } catch {
      toast({
        title: "Delete failed",
        description: "Unable to delete task.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 md:px-8">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-8">
        <div className="flex items-center mb-2">
          <List className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-3xl font-bold">My Posted Tasks</h1>
        </div>
        <p className="text-muted-foreground">View and manage tasks you've posted.</p>
      </motion.div>

      {tasks.length === 0 ? (
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center py-20 glass-effect rounded-xl shadow-2xl"
        >
          <List className="h-20 w-20 mx-auto text-primary/50 mb-6" />
          <h3 className="text-2xl font-semibold mb-3 text-primary">No Tasks Posted</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            You haven’t posted any tasks yet. Post a task to connect with nearby tutors.
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {tasks.map((task) => (
            <Card key={task.id} className="glass-effect card-hover">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <CardTitle className="text-xl text-primary">{task.title}</CardTitle>
                  <Badge variant="outline">{task.status || "Open"}</Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">{task.subject}</div>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="text-lg font-semibold">${task.budget}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Deadline</p>
                  <p className="text-lg font-semibold">{task.deadline || "—"}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t border-border pt-4">
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/tasks/${task.id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Link>
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(task.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MyTasksPage;
