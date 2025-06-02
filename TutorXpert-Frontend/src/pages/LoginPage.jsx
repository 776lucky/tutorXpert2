import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";



const LoginPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard"; // 默认跳转到 dashboard

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
  
    try {
      const params = new URLSearchParams();
      params.append("username", formData.email);
      params.append("password", formData.password);
  
      const response = await axios.post(`${baseUrl}/login`, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
  
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
        className: "bg-card border-primary/50 text-foreground"
      });
  
      const user = response.data.user;
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify({
        id: user.id,
        email: user.email,
        role: user.role?.toLowerCase() || "student",
        isLoggedIn: true
      }));
      localStorage.setItem("user_id", user.id.toString());
  
      navigate(from);
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "The email or password is incorrect. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card/30 text-foreground flex items-center justify-center px-4">
      <motion.div className="w-full max-w-md" variants={fadeIn} initial="hidden" animate="visible">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold animated-gradient-text">
            Welcome Back
          </h1>
          <p className="mt-2 text-muted-foreground">Log in to your GlowUpTutors account</p>
        </div>

        <Card className="shadow-xl bg-card/80 backdrop-blur-xl">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="animated-gradient-text">
                Log In
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                    Logging in...
                  </div>
                ) : (
                  <span className="animated-gradient-text">Log In</span>
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Don’t have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
