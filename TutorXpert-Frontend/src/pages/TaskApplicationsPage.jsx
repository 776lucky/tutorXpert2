import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const TaskApplicationsPage = () => {
  const { taskId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tasks/${taskId}/applications`);
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to load applications", err);
      setError("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (appId, decision) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/tasks/applications/${appId}/decision`, {
        decision,
      });
      toast({
        title: "Success",
        description: `Application ${decision}ed successfully.`,
      });
      fetchApplications(); // 刷新状态
    } catch (err) {
      toast({
        title: "Error",
        description: "Operation failed.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Applications for Task #{taskId}</h2>
      {applications.length === 0 ? (
        <p>No tutor has applied yet.</p>
      ) : (
        applications.map((app) => (
          <Card key={app.id} className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">
                {app.tutor?.profile?.first_name} {app.tutor?.profile?.last_name}
                {" — "}
                {app.tutor?.profile?.hourly_rate
                  ? `$${app.tutor.profile.hourly_rate}/hr`
                  : "No rate listed"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Subjects:</strong> {app.tutor?.profile?.subjects?.join(", ")}</p>
              <p><strong>Address:</strong> {app.tutor?.profile?.address}</p>
              <p><strong>Message:</strong> {app.message}</p>
              <p><strong>Status:</strong> <span className="capitalize">{app.status}</span></p>
              {app.status === "pending" && (
                <div className="flex gap-3 pt-2">
                  <Button onClick={() => handleDecision(app.id, "accept")}>Accept</Button>
                  <Button variant="secondary" onClick={() => handleDecision(app.id, "reject")}>
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default TaskApplicationsPage;
