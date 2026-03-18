"use client";

import React, { useState } from "react";
import { Search, Users, Shield, Edit, Eye, Ban, CheckCircle2, MoreHorizontal } from "lucide-react";
import { Button, Badge, Card, Input, Avatar } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { formatDate } from "@/lib/utils";

const mockUsers = [
  { id: "1", name: "Thabo Mokoena", email: "thabo@example.co.za", role: "learner", status: "active", joined: "2024-02-15", province: "Gauteng" },
  { id: "2", name: "Standard Bank HR", email: "hr@standardbank.co.za", role: "employer", status: "active", joined: "2024-01-10", province: "Gauteng" },
  { id: "3", name: "WeThinkCode_ Admin", email: "admin@wethinkcode.co.za", role: "provider", status: "active", joined: "2024-01-05", province: "Gauteng" },
  { id: "4", name: "Dr. Zanele Mthembu", email: "zanele@capaciti.org.za", role: "mentor", status: "active", joined: "2024-03-01", province: "Western Cape" },
  { id: "5", name: "Nomsa Dlamini", email: "nomsa@example.co.za", role: "learner", status: "active", joined: "2024-04-20", province: "KwaZulu-Natal" },
  { id: "6", name: "Sipho Nkosi", email: "sipho@example.co.za", role: "learner", status: "active", joined: "2024-05-12", province: "Western Cape" },
  { id: "7", name: "Lerato Molefe", email: "lerato@example.co.za", role: "learner", status: "inactive", joined: "2024-06-01", province: "Gauteng" },
  { id: "8", name: "Palesa Khumalo", email: "palesa@example.co.za", role: "learner", status: "active", joined: "2024-06-15", province: "Free State" },
];

const roleColors: Record<string, string> = { learner: "default", employer: "info", provider: "purple", mentor: "warning", admin: "destructive" };

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const filtered = mockUsers.filter((u) =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardShell role="admin" userName="Admin User" userEmail="admin@skillweave.co.za">
      <PageHeader title="User Management" description={`${mockUsers.length} registered users across all roles.`} />
      <div className="px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="pl-10" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">User</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Role</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Province</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Joined</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} size="sm" />
                      <div><div className="font-medium text-slate-900">{u.name}</div><div className="text-xs text-slate-400">{u.email}</div></div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center"><Badge variant={roleColors[u.role] as any} className="capitalize">{u.role}</Badge></td>
                  <td className="py-3 px-4 text-center"><Badge variant={u.status === "active" ? "success" : "secondary"}>{u.status}</Badge></td>
                  <td className="py-3 px-4 text-center text-slate-600">{u.province}</td>
                  <td className="py-3 px-4 text-center text-slate-500">{formatDate(u.joined)}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-3.5 w-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
