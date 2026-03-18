"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FolderOpen, PlusCircle, ExternalLink, File, Award, Briefcase,
  MessageSquare, Image, Link2, Globe, Eye, EyeOff, Trash2, Edit,
} from "lucide-react";
import { Button, Badge, Card, Input, Textarea, Label, EmptyState, Separator } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { cn, formatDate } from "@/lib/utils";

const mockPortfolio = [
  {
    id: "p1", title: "E-Commerce Dashboard Redesign", type: "project",
    description: "Redesigned the dashboard for an online retailer using Figma and React. Improved task completion rates by 30%.",
    tags: ["React", "Figma", "UX Design"], url: "https://github.com/thabo/ecommerce-dash",
    is_public: true, created_at: "2024-09-15",
  },
  {
    id: "p2", title: "Python Data Pipeline", type: "project",
    description: "Built an ETL pipeline for processing CSV data files using Python and Pandas. Automated weekly reports.",
    tags: ["Python", "Pandas", "Data Engineering"], url: "",
    is_public: true, created_at: "2024-08-20",
  },
  {
    id: "p3", title: "Standard Bank Dashboard Endorsement", type: "endorsement",
    description: "Endorsed by Standard Bank for outstanding work on the Digital Banking Dashboard Redesign project.",
    tags: ["Employer Endorsed"], url: "",
    is_public: true, created_at: "2024-11-01",
  },
  {
    id: "p4", title: "Reflections on Learning Python", type: "reflection",
    description: "My journey from zero coding experience to building real applications. What worked, what didn't, and what I'd do differently.",
    tags: ["Personal Growth", "Python"], url: "",
    is_public: false, created_at: "2024-07-10",
  },
  {
    id: "p5", title: "Digital Literacy Certificate", type: "certificate",
    description: "CAPACITI Digital Literacy Foundations — completed with distinction.",
    tags: ["Certificate"], url: "",
    is_public: true, created_at: "2024-03-15",
  },
];

const typeIcons: Record<string, React.ElementType> = {
  project: Briefcase,
  endorsement: Award,
  certificate: Award,
  reflection: MessageSquare,
  evidence: File,
  work_sample: Image,
};

const typeColors: Record<string, string> = {
  project: "bg-blue-100 text-blue-600",
  endorsement: "bg-emerald-100 text-emerald-600",
  certificate: "bg-amber-100 text-amber-600",
  reflection: "bg-purple-100 text-purple-600",
  evidence: "bg-slate-100 text-slate-600",
  work_sample: "bg-pink-100 text-pink-600",
};

export default function PortfolioPage() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <DashboardShell>
      <PageHeader
        title="My Portfolio"
        description="Showcase your projects, endorsements, and evidence. Share your public portfolio with employers."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Globe className="h-4 w-4 mr-1.5" />
              View Public
            </Button>
            <Button onClick={() => setShowAdd(!showAdd)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        }
      />

      <div className="px-6 lg:px-8 py-8 max-w-4xl">
        {/* Add Form */}
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-8">
            <Card className="p-6">
              <h2 className="text-base font-semibold font-display text-slate-900 mb-4">Add Portfolio Item</h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Title</Label>
                    <Input className="mt-1.5" placeholder="My awesome project" />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <select className="mt-1.5 w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm">
                      <option value="project">Project</option>
                      <option value="work_sample">Work Sample</option>
                      <option value="evidence">Evidence</option>
                      <option value="reflection">Reflection</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea className="mt-1.5" rows={3} placeholder="Describe what you built, learned, or accomplished..." />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>URL (optional)</Label>
                    <Input className="mt-1.5" placeholder="https://github.com/..." />
                  </div>
                  <div>
                    <Label>Tags (comma-separated)</Label>
                    <Input className="mt-1.5" placeholder="React, Python, UX Design" />
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300" />
                    Make public
                  </label>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                  <Button>Add to Portfolio</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Portfolio Items */}
        <div className="space-y-4">
          {mockPortfolio.map((item, i) => {
            const Icon = typeIcons[item.type] || File;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="p-5 group">
                  <div className="flex items-start gap-4">
                    <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shrink-0", typeColors[item.type] || "bg-slate-100 text-slate-500")}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                        <Badge variant="secondary" className="text-[10px] capitalize">{item.type}</Badge>
                        {item.is_public ? (
                          <Eye className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5 text-slate-400" />
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mb-2">{item.description}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        {item.tags.map((tag) => (
                          <span key={tag} className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                            {tag}
                          </span>
                        ))}
                        <span className="text-xs text-slate-400 ml-auto">{formatDate(item.created_at)}</span>
                      </div>
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium mt-2 hover:underline">
                          <Link2 className="h-3 w-3" />
                          {item.url}
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button className="p-1.5 rounded-md hover:bg-slate-100"><Edit className="h-3.5 w-3.5 text-slate-400" /></button>
                      <button className="p-1.5 rounded-md hover:bg-red-50"><Trash2 className="h-3.5 w-3.5 text-red-400" /></button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
