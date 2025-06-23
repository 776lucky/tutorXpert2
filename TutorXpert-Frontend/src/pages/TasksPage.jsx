import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Calendar, DollarSign, BookOpen, Zap, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
// import mockTasks from "@/data/mockTasks";
import TaskMapView from "@/components/TaskMapView";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";



const getDistanceFromLatLng = (lat1, lng1, lat2, lng2) => {
  const toRad = x => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};



const TasksPage = () => {
  const [bidAmount, setBidAmount] = useState("");
  const [showBidDialog, setShowBidDialog] = useState(false);


  const { user } = useAuth();  // user.id 即为当前 tutor 的 ID
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);  // ✅ 用于存储点击的任务详情
  const { id } = useParams();
  const { toast } = useToast();
  const [appliedTaskIds, setAppliedTaskIds] = useState(new Set()); // 记录已申请任务
  
  const fetchTasksByBounds = async (bounds) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tasks/search`, {
        params: bounds,
      });
      setTasks(res.data);
      setFilteredTasks(res.data);
    } catch (err) {
      console.error("❌ Map filter task fetch error", err);
    }
  };

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [distanceFilter, setDistanceFilter] = useState("");
  const [userPosition, setUserPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const taskRefs = useRef({});


  const handleApply = async (task) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/task_applications`, {
        task_id: task.id,
        tutor_id: user.id,
        bid_amount: parseFloat(bidAmount),
      });
      toast({
        title: "Application Submitted",
        description: `You have applied for "${task.title}" with a bid of $${bidAmount}.`,
      });
      setAppliedTaskIds((prev) => new Set(prev).add(task.id));
      setShowBidDialog(false);
      setBidAmount("");
    } catch (err) {
      if (err.response?.status === 400) {
        toast({
          title: "Already Applied",
          description: "You have already applied for this task.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong while applying.",
          variant: "destructive",
        });
      }
    }
  };
  
  


  const handleViewTaskDetails = async (taskId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tasks/${taskId}`);
      setSelectedTask(res.data);
      setIsDialogOpen(true);
    } catch (err) {
      console.error("Failed to fetch task info", err);
      toast({
        title: "Error",
        description: "Failed to load task details.",
        variant: "destructive",
      });
    }
  };

  // 用于实现 页面加载时就知道哪些任务已经被当前 tutor 申请过 
  useEffect(() => {
    if (!user?.id) return;  // ✅ 等 user 加载完成后再发请求
  
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/my_applications?tutor_id=${user.id}`)
      .then(res => {
        const appliedIds = new Set(res.data.map(app => app.task_id));
        setAppliedTaskIds(appliedIds);
      })
      .catch(err => {
        console.error("Failed to fetch applied tasks", err);
        toast({
          title: "Error",
          description: "Unable to load your applied tasks.",
          variant: "destructive",
        });
      });
  }, [user]);  // ✅ 添加 user 作为依赖项

  useEffect(() => {
    if (id) {
      handleViewTaskDetails(id);  // 自动打开弹窗
    }
  }, [id]);

  
  useEffect(() => {
    setTimeout(() => {
      // setTasks(mockTasks);
      // setFilteredTasks(mockTasks);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterTasks();
  }, [searchTerm, subjectFilter, budgetFilter, distanceFilter, tasks, userPosition]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.lat, pos.coords.lng];
          setUserPosition(coords);
        },
        (err) => {
          console.warn("Geolocation error:", err);
          toast({
            title: "Location Access Denied",
            description: "We couldn't access your location. The map may be less personalized.",
            variant: "destructive",
          });
        },
        { timeout: 10000 }
      );
    }
  }, [toast]);

  const filterTasks = () => {
    let tempFiltered = [...tasks];
    if (searchTerm) {
      tempFiltered = tempFiltered.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (subjectFilter) {
      tempFiltered = tempFiltered.filter(t => t.subject.toLowerCase() === subjectFilter.toLowerCase());
    }
    if (budgetFilter) {
      const [min, max] = budgetFilter.split("-").map(Number);
      tempFiltered = tempFiltered.filter(t => {
        const [pMin, pMax] = t.budget.split("-").map(Number);
        return pMax >= min && (max ? pMin <= max : true);
      });
    }
    if (distanceFilter && userPosition) {
      const maxDistance = parseFloat(distanceFilter);
      tempFiltered = tempFiltered.filter(t => {
        return getDistanceFromLatLng(userPosition[0], userPosition[1], t.lat, t.lng) <= maxDistance;
      });
    }
    setFilteredTasks(tempFiltered);
  };


  

  const handleSearch = e => setSearchTerm(e.target.value);
  const handleSubjectFilter = setSubjectFilter;
  const handleBudgetFilter = setBudgetFilter;
  const handleDistanceFilter = setDistanceFilter;

  const scrollToCard = (taskId) => {
    const target = taskRefs.current[taskId];
    if (target) {
      const scrollY = window.scrollY;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      window.scrollTo({ top: scrollY });
      target.classList.add("ring", "ring-primary");
      setTimeout(() => target.classList.remove("ring", "ring-primary"), 2000);
    }
  };

  const allSubjects = [...new Set(tasks.map(t => t.subject))].sort();

  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animated-gradient-text">Explore Student Tasks</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Browse exciting student-led tasks looking for skilled collaborators. Help shape innovative outcomes.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link to="/projects/new"><PlusCircle className="mr-2 h-5 w-5" /> Post Your Task</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" className="glass-effect p-6 mb-10 rounded-xl shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div>
              <Label htmlFor="search" className="mb-2 block text-primary">Search Tasks</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
                <Input id="search" placeholder="Search by title, skills, or subject..." className="pl-10 border border-blue-500 text-blue-300 placeholder:text-blue-400 focus:ring-blue-500 focus:border-blue-500" value={searchTerm} onChange={handleSearch} />
              </div>
            </div>
            <div>
              <Label htmlFor="subject" className="mb-2 block text-primary">Filter by Subject</Label>
              <Select onValueChange={handleSubjectFilter} value={subjectFilter}>
                <SelectTrigger id="subject" className="border border-blue-500 text-blue-300 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Choose a subject area" />
                </SelectTrigger>
                <SelectContent className="bg-background border-blue-500 text-blue-300">
                  <SelectItem value="">All Subjects</SelectItem>
                  {allSubjects.map((s, i) => <SelectItem key={i} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="budget" className="mb-2 block text-primary">Budget</Label>
              <Select onValueChange={handleBudgetFilter} value={budgetFilter}>
                <SelectTrigger id="budget" className="border border-blue-500 text-blue-300 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent className="bg-background border-blue-500 text-blue-300">
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="0-100">$0 - $100</SelectItem>
                  <SelectItem value="100-200">$100 - $200</SelectItem>
                  <SelectItem value="200-300">$200 - $300</SelectItem>
                  <SelectItem value="300-999999">$300+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="distance" className="mb-2 block text-primary">Max Distance (km)</Label>
              <Select onValueChange={handleDistanceFilter} value={distanceFilter}>
                <SelectTrigger id="distance" className="border border-blue-500 text-blue-300 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent className="bg-background border-blue-500 text-blue-300">
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="5">Within 5 km</SelectItem>
                  <SelectItem value="10">Within 10 km</SelectItem>
                  <SelectItem value="20">Within 20 km</SelectItem>
                  <SelectItem value="50">Within 50 km</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6 h-[700px]">
          <motion.div className="w-full md:w-[400px] overflow-y-auto space-y-6 pr-2">
            {filteredTasks.map(task => (
              <motion.div
                key={task.id}
                ref={el => taskRefs.current[task.id] = el}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Card className="h-full flex flex-col bg-background/70 backdrop-blur-lg border border-blue-400/30 shadow-lg rounded-2xl hover:shadow-2xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-primary">{task.title}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          Posted by {task.postedBy} • {task.postedDate}
                        </p>
                      </div>
                      <Badge variant={task.status === "Open" ? "success" : "secondary"}>{task.status}</Badge>
                    </div>
                    <Badge className="bg-blue-900/40 text-blue-300 border border-blue-400/30 rounded-full px-3 py-1 mt-2 w-fit">
                      {task.subject}
                    </Badge>
                  </CardHeader>
                  <CardContent className="py-2 flex-grow">
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">{task.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <DollarSign className="h-4 w-4 text-blue-400 mr-2" />
                        <span>${task.budget}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 text-blue-400 mr-2" />
                        <span>{task.deadline}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <BookOpen className="h-4 w-4 text-blue-400 mr-2" />
                        <span>{task.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      asChild  // ✅ 与 TutorsPage 相同写法
                    >
                      <Link to={`/projects/${task.id}`}>View Details</Link>
                    </Button>
                    <Button className="flex-1" asChild disabled={appliedTaskIds.has(task.id)}>
                      <Link to={`/projects/apply/${task.id}`}>
                        {appliedTaskIds.has(task.id) ? "Applied" : "Apply Now"}
                        <Zap className="ml-2 h-4 w-4 text-blue-400" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="relative flex-1 rounded-xl overflow-hidden shadow-2xl">
            <TaskMapView
              tasks={filteredTasks}
              onTaskClick={scrollToCard}
              userPosition={userPosition}
              onBoundsChange={fetchTasksByBounds}
            />
          </div>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-background border border-blue-500 text-foreground">
          {selectedTask ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-primary text-2xl">
                  {selectedTask.title}
                </DialogTitle>
              </DialogHeader>
              <div className="py-2 space-y-2">
                <p><strong>Subject:</strong> {selectedTask.subject}</p>
                <p><strong>Description:</strong> {selectedTask.description}</p>
                <p><strong>Budget:</strong> {selectedTask.budget}</p>
                <p><strong>Deadline:</strong> {selectedTask.deadline}</p>
                <p><strong>Address:</strong> {selectedTask.address}</p>
              </div>
              <DialogFooter className="pt-4">
                <Button onClick={() => {
                  setSelectedTask(task);
                  setShowBidDialog(true);
                }}>
                  Apply
                </Button>
              </DialogFooter>
            </>
          ) : (
            <p>Loading task details...</p>
          )}
        </DialogContent>
      </Dialog>
      {showBidDialog && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Apply to "{selectedTask.title}"
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Bid Amount ($)</label>
                <input
                  type="number"
                  className="w-full mt-1 px-3 py-2 border rounded"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Message</label>
                <textarea
                  rows={4}
                  className="w-full mt-1 px-3 py-2 border rounded"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setShowBidDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitApplication}>
                  Submit Application
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
