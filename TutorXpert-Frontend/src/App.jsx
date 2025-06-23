import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import TutorsPage from "@/pages/TutorsPage";
import TutorProfilePage from "@/pages/TutorProfilePage";
import TasksPage from "@/pages/TasksPage";
import TaskDetailsPage from "@/pages/TaskDetailsPage";
import NewTaskPage from "@/pages/NewTaskPage";
import HowItWorksPage from "@/pages/HowItWorksPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import AboutUsPage from "@/pages/AboutUsPage";
import ContactPage from "@/pages/ContactPage";
import PricingPage from "@/pages/PricingPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import MyFavouritesPage from "@/pages/dashboard/MyFavouritesPage";
import MyMessagesPage from "@/pages/dashboard/MyMessagesPage";
// import PaymentMethodsPage from "@/pages/dashboard/PaymentMethodsPage";
import MyBidsPage from "@/pages/dashboard/MyBidsPage";
import MyListingsPage from "@/pages/dashboard/MyListingsPage";
import MyAppointmentsPage from "@/pages/dashboard/MyAppointmentsPage";
// import PayPage from "@/pages/PayPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import NotFoundPage from "@/pages/NotFoundPage";
import ProfilePage from "@/pages/dashboard/ProfilePage";
import ScrollToTop from "@/components/ScrollToTop";
import axios from "axios";
import AvailabilityPage from "@/pages/dashboard/AvailabilityPage";
import TestDialog from "@/pages/TestDialog"; // 确保路径正确
import NewAppointmentPage from "@/pages/NewAppointmentPage";
import MyTasksPage from "@/pages/dashboard/MyTasksPage"
import TaskApplicationsPage from "@/pages/TaskApplicationsPage";
import TutorApplyProjectPage from "@/pages/TutorApplyProjectPage";

// ✅ 设置全局请求拦截器，自动附加 Authorization token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/tutors" element={<TutorsPage />} />
            <Route path="/tutors/:id" element={<TutorProfilePage />} />
            <Route path="/projects" element={<TasksPage />} />
            <Route path="/projects/:id" element={<TaskDetailsPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/test-dialog" element={<TestDialog />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/favourites" element={<MyFavouritesPage />} />
              <Route path="/dashboard/messages" element={<MyMessagesPage />} />
              {/* <Route path="/dashboard/payment-methods" element={<PaymentMethodsPage />} /> */}
              <Route path="/dashboard/bids" element={<MyBidsPage />} />
              <Route path="/dashboard/listings" element={<MyListingsPage />} />
              <Route path="/dashboard/appointments" element={<MyAppointmentsPage />} />
              <Route path="/dashboard/profile" element={<ProfilePage />} />
              <Route path="/projects/new" element={<NewTaskPage />} />
              <Route path="/dashboard/availability" element={<AvailabilityPage />} />
              <Route path="/appointments/new/:tutor_id" element={<NewAppointmentPage />} />
              <Route path="/dashboard/my-tasks" element={<MyTasksPage />} />
              <Route path="/tasks/:taskId/applications" element={<TaskApplicationsPage />} />
              <Route path="/projects/apply/:taskId" element={<TutorApplyProjectPage />} />

              {/* <Route path="/pay/:appointmentId" element={<PayPage />} /> */}
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
};

export default App;
