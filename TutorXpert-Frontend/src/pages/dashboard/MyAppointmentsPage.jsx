
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Video, MessageSquare, DollarSign, UserCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

const MyAppointmentsPage = () => {

  const handleDecision = async (appointmentId, action) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/appointments/${appointmentId}/${action}`
      );
  
      toast({ title: `Appointment ${action}ed successfully` });
  
      // 更新状态
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId
            ? { ...appt, status: action === "accept" ? "accepted" : "rejected" }
            : appt
        )
      );
    } catch (err) {
      console.error(`❌ Failed to ${action} appointment:`, err);
      toast({ title: `Failed to ${action} appointment`, variant: "destructive" });
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const user = JSON.parse(localStorage.getItem("user")) || { userType: "student" };
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/appointments/${user.userType}/${user.id}`
        );

        // 格式转换，适配 UI
        const formatted = res.data.map((appt) => ({
          id: appt.id,
          subject: appt.slot.subject,
          date: new Date(appt.slot.start_time).toLocaleDateString(),
          time: `${new Date(appt.slot.start_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })} - ${new Date(appt.slot.end_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`,
          tutorName: appt.tutor?.full_name,
          studentName: appt.student?.full_name,
          tutor_id: appt.tutor_id,         // ✅ 保留原始字段
          student_id: appt.student_id,     // ✅ 保留原始字段
          price: `$${appt.slot.hourly_rate || appt.fee || 0}`,
          status: appt.status,
          needsPayment: appt.status === "Upcoming" && !appt.is_paid,
          message: appt.message,
        }));

        setAppointments(formatted);
      } catch (err) {
        console.error("❌ Failed to fetch appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 md:px-6 flex justify-center">
      <div className="w-full max-w-3xl">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-10">
          <div className="flex items-center mb-2">
            <CalendarDays className="h-10 w-10 text-primary mr-3 tech-glow" />
            <h1 className="text-4xl md:text-5xl font-bold animated-gradient-text">My Appointments</h1>
          </div>
          <p className="text-lg text-muted-foreground">Manage your scheduled tutoring sessions.</p>
        </motion.div>

        {loading ? (
          <p className="text-center text-muted">Loading...</p>
        ) : appointments.length === 0 ? (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-center py-20 glass-effect rounded-xl shadow-2xl"
          >
            <CalendarDays className="h-20 w-20 mx-auto text-primary/50 mb-6" />
            <h3 className="text-2xl font-semibold mb-3 text-primary">No Appointments Scheduled</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {user.userType === "student"
                ? "Book a session with a tutor to get started."
                : "Your scheduled sessions with students will appear here."}
            </p>
            {user.userType === "student" && (
              <Button asChild size="lg">
                <Link to="/tutors">Find a Tutor</Link>
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {appointments.map((appt) => (
              <Card key={appt.id} className="glass-effect card-hover">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <CardTitle className="text-xl text-primary">{appt.subject}</CardTitle>
                    <Badge
                      variant={
                        appt.status === "accepted"
                          ? "success"
                          : appt.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {appt.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center text-sm">
                    <UserCircle className="h-4 w-4 mr-1.5" />
                    {user.userType === "student"
                      ? `With: ${appt.tutorName || "TBD"}`
                      : `With: ${appt.studentName || "TBD"}`}
                  </CardDescription>
                </CardHeader>
              
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Clock className="h-4 w-4 mr-1.5" /> Date & Time
                    </p>
                    <p className="font-semibold text-foreground">{appt.date} at {appt.time}</p>
                  </div>

                  {appt.message && (
                    <div>
                      <p className="text-sm text-muted-foreground">Message</p>
                      <p className="font-medium">{appt.message}</p>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="gap-2 justify-end border-t border-primary/20 pt-4">
                  {user.userType === "tutor" && appt.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleDecision(appt.id, "accept")}
                      >
                        Accept
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDecision(appt.id, "reject")}>
                        Reject
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/dashboard/messages?tutor_id=${user.userType === "student" ? appt.tutor_id : appt.student_id}`}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message {user.userType === "student" ? "Tutor" : "Student"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </motion.div>
        )}
      </div> 
    </div>   
  );
};

export default MyAppointmentsPage;