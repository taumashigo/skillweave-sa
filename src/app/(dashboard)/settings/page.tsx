"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Lock, Bell, Globe, Shield, Palette, Save, Eye, EyeOff,
} from "lucide-react";
import { Button, Card, Input, Label, Textarea, Separator, Badge } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { SA_PROVINCES } from "@/lib/utils";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "preferences", label: "Preferences", icon: Palette },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <DashboardShell>
      <PageHeader title="Settings" description="Manage your profile, security, and preferences." />

      <div className="px-6 lg:px-8 py-8 max-w-4xl">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-slate-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "border-emerald-500 text-emerald-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <Card className="p-6">
            <h2 className="text-base font-semibold font-display text-slate-900 mb-6">Profile Information</h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Full Name</Label><Input className="mt-1.5" defaultValue="Thabo Mokoena" /></div>
                <div><Label>Email</Label><Input className="mt-1.5" defaultValue="thabo@skillweave.co.za" type="email" /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Mobile Number</Label><Input className="mt-1.5" defaultValue="+27 82 123 4567" /></div>
                <div>
                  <Label>Province</Label>
                  <select className="mt-1.5 w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm">
                    {SA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea className="mt-1.5" rows={3} defaultValue="Aspiring full-stack developer with a passion for building technology solutions for South African challenges." />
              </div>
              <div><Label>LinkedIn URL</Label><Input className="mt-1.5" defaultValue="https://linkedin.com/in/thabo-mokoena" /></div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded border-slate-300" />
                <Label>Make my portfolio public</Label>
              </div>
              <div className="pt-2"><Button><Save className="h-4 w-4 mr-2" />Save Changes</Button></div>
            </div>
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-base font-semibold font-display text-slate-900 mb-4">Change Password</h2>
              <div className="space-y-4 max-w-md">
                <div><Label>Current Password</Label><Input className="mt-1.5" type="password" /></div>
                <div><Label>New Password</Label><Input className="mt-1.5" type="password" /></div>
                <div><Label>Confirm New Password</Label><Input className="mt-1.5" type="password" /></div>
                <Button><Lock className="h-4 w-4 mr-2" />Update Password</Button>
              </div>
            </Card>
            <Card className="p-6">
              <h2 className="text-base font-semibold font-display text-slate-900 mb-2">Two-Factor Authentication</h2>
              <p className="text-sm text-slate-500 mb-4">Add an extra layer of security to your account.</p>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">Not Enabled</Badge>
                <Button variant="outline" size="sm"><Shield className="h-4 w-4 mr-1.5" />Enable 2FA</Button>
              </div>
            </Card>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <Card className="p-6">
            <h2 className="text-base font-semibold font-display text-slate-900 mb-6">Notification Preferences</h2>
            <div className="space-y-4">
              {[
                { label: "Module completion alerts", desc: "Get notified when you complete a module", default: true },
                { label: "Credential issuance", desc: "Notified when new credentials are issued", default: true },
                { label: "Remediation recommendations", desc: "Alerts when remediation support is suggested", default: true },
                { label: "New opportunity matches", desc: "Opportunities that match your skills", default: true },
                { label: "Milestone achievements", desc: "Celebratory notifications for milestones", default: true },
                { label: "Advisor messages", desc: "Messages from your mentor/advisor", default: true },
                { label: "Marketing emails", desc: "Platform news and feature updates", default: false },
              ].map((pref) => (
                <div key={pref.label} className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{pref.label}</div>
                    <div className="text-xs text-slate-500">{pref.desc}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={pref.default} className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-200 peer-checked:bg-emerald-500 rounded-full peer-focus:ring-2 peer-focus:ring-emerald-500/20 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                  </label>
                </div>
              ))}
              <div className="pt-2"><Button><Save className="h-4 w-4 mr-2" />Save Preferences</Button></div>
            </div>
          </Card>
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <Card className="p-6">
            <h2 className="text-base font-semibold font-display text-slate-900 mb-6">Learning Preferences</h2>
            <div className="space-y-4">
              <div>
                <Label>Preferred Learning Mode</Label>
                <select className="mt-1.5 w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm">
                  <option>Online</option><option>Blended</option><option>In-Person</option><option>Any</option>
                </select>
              </div>
              <div>
                <Label>Budget Preference</Label>
                <select className="mt-1.5 w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm">
                  <option>Free Only</option><option>Under R500/mo</option><option>R500–R2,000/mo</option><option>Flexible</option>
                </select>
              </div>
              <div>
                <Label>Language</Label>
                <select className="mt-1.5 w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm">
                  <option>English</option><option>isiZulu</option><option>Afrikaans</option><option>isiXhosa</option>
                </select>
              </div>
              <div>
                <Label>Accessibility</Label>
                <div className="mt-2 space-y-2">
                  {["Screen reader support", "High contrast mode", "Larger text", "Reduced motion"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm text-slate-600">
                      <input type="checkbox" className="rounded border-slate-300" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              <div className="pt-2"><Button><Save className="h-4 w-4 mr-2" />Save Preferences</Button></div>
            </div>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
