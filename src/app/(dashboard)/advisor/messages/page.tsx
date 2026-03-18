"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Search } from "lucide-react";
import { Button, Card, Input, Avatar, Textarea } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { cn } from "@/lib/utils";

const mockConversations = [
  { id: "1", name: "Thabo Mokoena", lastMessage: "Thanks for the feedback on my pathway!", time: "2 min ago", unread: true },
  { id: "2", name: "Nomsa Dlamini", lastMessage: "I'm struggling with the statistics module", time: "1 hour ago", unread: true },
  { id: "3", name: "Sipho Nkosi", lastMessage: "Ready to start my capstone project", time: "Yesterday", unread: false },
  { id: "4", name: "Palesa Khumalo", lastMessage: "Can we schedule a check-in?", time: "2 days ago", unread: false },
];

const mockMessages = [
  { id: "1", sender: "Nomsa Dlamini", text: "Hi Dr. Mthembu, I'm really struggling with the probability section in the statistics module.", time: "1:30 PM", isMe: false },
  { id: "2", sender: "Me", text: "Hi Nomsa! I can see from your progress that you scored 45% on that section. Have you tried the remediation resources?", time: "1:35 PM", isMe: true },
  { id: "3", sender: "Nomsa Dlamini", text: "I started the video refresher but I still don't understand conditional probability.", time: "1:40 PM", isMe: false },
  { id: "4", sender: "Me", text: "Let's schedule a 30-minute session this week. I'll walk you through it with some practical examples. Would Thursday at 2pm work?", time: "1:45 PM", isMe: true },
];

export default function AdvisorMessagesPage() {
  const [selected, setSelected] = useState("2");
  const [newMessage, setNewMessage] = useState("");

  return (
    <DashboardShell role="mentor" userName="Dr. Zanele Mthembu" userEmail="zanele@capaciti.org.za">
      <PageHeader title="Messages" description="Communicate with your learners." />
      <div className="px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversation List */}
          <Card className="overflow-hidden flex flex-col">
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search conversations..." className="pl-8 h-8 text-sm" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {mockConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelected(conv.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-slate-50",
                    selected === conv.id ? "bg-emerald-50" : "hover:bg-slate-50"
                  )}
                >
                  <Avatar name={conv.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900">{conv.name}</span>
                      <span className="text-[10px] text-slate-400">{conv.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread && <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />}
                </button>
              ))}
            </div>
          </Card>

          {/* Chat */}
          <Card className="lg:col-span-2 overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
              <Avatar name="Nomsa Dlamini" size="sm" />
              <div>
                <div className="text-sm font-medium text-slate-900">Nomsa Dlamini</div>
                <div className="text-xs text-slate-400">Data Analyst & BI pathway</div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {mockMessages.map((msg) => (
                <div key={msg.id} className={cn("flex", msg.isMe ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[70%] px-3 py-2 rounded-xl text-sm",
                    msg.isMe ? "bg-emerald-600 text-white rounded-br-sm" : "bg-slate-100 text-slate-700 rounded-bl-sm"
                  )}>
                    <p>{msg.text}</p>
                    <p className={cn("text-[10px] mt-1", msg.isMe ? "text-emerald-200" : "text-slate-400")}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-100 flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button size="icon"><Send className="h-4 w-4" /></Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}