import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Inbox, UserCircle, Search, Paperclip, Smile } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useSearchParams } from "react-router-dom";


const MyMessagesPage = () => {
  const [searchParams] = useSearchParams();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const tutorIdFromQuery = searchParams.get("tutor_id");
  const currentUserId = Number(JSON.parse(localStorage.getItem("user") || "{}").id);
  if (!currentUserId || currentUserId === 0) {
    console.error("❌ 当前用户未登录，user_id 无效！");
    return null; // 或显示登录提示
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/messages/conversations/${currentUserId}`);
        setConversations(res.data);
      } catch (err) {
        console.error("Failed to load conversations", err);
      }
    };
  
    fetchConversations();
  }, [currentUserId]);
  


  
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations]);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!tutorIdFromQuery || conversations.length === 0) return;
    const tutorId = Number(tutorIdFromQuery);
    const existing = conversations.find(c => c.id === tutorId);
    if (existing) {
      setSelectedConversation(existing);
    } else {
      setSelectedConversation({
        id: tutorId,
        name: `Tutor ${tutorId}`,
        last_message: "",
        unread: 0,
        timestamp: "Now",
      });
    }
  }, [tutorIdFromQuery, conversations]);
  

  useEffect(() => {
    if (!selectedConversation) return;
  
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/messages/history/${currentUserId}/${selectedConversation.id}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
  
    fetchMessages();
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/messages/`, {
        sender_id: currentUserId,
        receiver_id: selectedConversation.id,
        text: newMessage,
      });
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };
  
  const getInitials = (name) => {
    if (!name) return "??";
    const names = name.split(" ");
    return names.length === 1
      ? names[0].substring(0, 2).toUpperCase()
      : names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
  };


  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 md:px-8">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-8">
        <div className="flex items-center mb-2">
          <Inbox className="h-10 w-10 text-primary mr-3 tech-glow" />
          <h1 className="text-4xl md:text-5xl font-bold animated-gradient-text">My Messages</h1>
        </div>
        <p className="text-lg text-muted-foreground">Communicate securely with students and tutors.</p>
      </motion.div>

      <motion.div 
        variants={fadeIn} 
        initial="hidden" 
        animate="visible"
        className="flex flex-col md:flex-row gap-6 h-[calc(100vh-200px)]"
      >
        {/* Conversation List */}
        <Card className="w-full md:w-1/3 glass-effect flex flex-col">
          <CardHeader className="pb-2 border-b border-primary/20">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
                <Input placeholder="Search messages..." className="pl-10 bg-input border-primary/30 focus:border-primary focus:ring-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-grow overflow-y-auto custom-scrollbar">
            {conversations.map(conv => (
              <div
                key={conv.id}
                className={`flex items-center p-4 cursor-pointer border-b border-primary/10 hover:bg-primary/5 transition-colors ${selectedConversation?.id === conv.id ? 'bg-primary/10' : ''}`}
                onClick={() => setSelectedConversation(conv)}
              >
                <Avatar className="h-12 w-12 mr-3 border-2 border-transparent group-hover:border-primary">
                   <AvatarImage src={`https://avatar.vercel.sh/${conv.name.replace(" ","")}.png`} alt={conv.name} />
                  <AvatarFallback className="bg-muted text-muted-foreground font-semibold">{getInitials(conv.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-foreground text-sm">{conv.name}</h3>
                    <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground truncate w-4/5">{conv.last_message}</p>
                    {conv.unread > 0 && <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">{conv.unread}</Badge>}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Message View */}
        <Card className="w-full md:w-2/3 glass-effect flex flex-col">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b border-primary/20">
                <div className="flex items-center">
                   <Avatar className="h-10 w-10 mr-3 border-2 border-primary">
                    <AvatarImage src={`https://avatar.vercel.sh/${selectedConversation.name.replace(" ","")}.png`} alt={selectedConversation.name} />
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">{getInitials(selectedConversation.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-primary">{selectedConversation.name}</CardTitle>
                    <CardDescription className="text-xs">Online</CardDescription> {/* Mock status */}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] px-4 py-2.5 rounded-xl shadow ${
                      msg.sender === "You" ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-muted-foreground rounded-bl-none"
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.sender === "You" ? "text-primary-foreground/70 text-right" : "text-muted-foreground/70 text-left"}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="p-4 border-t border-primary/20 bg-input/30">
                <div className="flex items-center w-full gap-2">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><Paperclip className="h-5 w-5" /></Button>
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="bg-background border-primary/30 focus:border-primary focus:ring-primary"
                  />
                   <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><Smile className="h-5 w-5" /></Button>
                  <Button onClick={handleSendMessage} size="icon" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </CardFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
              <Inbox className="h-24 w-24 opacity-30 mb-6" />
              <h2 className="text-2xl font-semibold mb-2">Select a conversation</h2>
              <p className="text-sm">Choose a chat from the left panel to view messages or start a new one.</p>
            </div>
          )}
        </Card>
      </motion.div>
       <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary) / 0.5);
          border-radius: var(--radius);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary));
        }
      `}</style>
    </div>
  );
};

export default MyMessagesPage;
