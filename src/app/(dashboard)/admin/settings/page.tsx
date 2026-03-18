"use client";

import React from "react";
import { Settings, Save, Shield, Bell, Globe, Database, Key, Mail } from "lucide-react";
import { Button, Card, Input, Label, Textarea, Separator, Badge } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";

export default function AdminSettingsPage() {
  return (
    <DashboardShell role="admin" userName="Admin User" userEmail="admin@skillweave.co.za">
      <PageHeader title="Platform Settings" description="Configure global platform settings and integrations." />
      <div className="px-6 lg:px-8 py-8 max-w-3xl space-y-6">
        {/* General */}
        <Card className="p-6">
          <h2 className="text-base font-semibold font-display text-slate-900 mb-4 flex items-center gap-2"><Globe className="h-4 w-4 text-slate-400" />General</h2>
          <div className="space-y-4">
            <div><Label>Platform Name</Label><Input className="mt-1.5" defaultValue="SkillWeave SA" /></div>
            <div><Label>Support Email</Label><Input className="mt-1.5" defaultValue="support@skillweave.co.za" type="email" /></div>
            <div><Label>Default Language</Label>
              <select className="mt-1.5 w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"><option>English</option><option>isiZulu</option><option>Afrikaans</option></select>
            </div>
            <div><Label>Default Currency</Label><Input className="mt-1.5" defaultValue="ZAR" disabled /></div>
          </div>
        </Card>

        {/* Qualification Rules */}
        <Card className="p-6">
          <h2 className="text-base font-semibold font-display text-slate-900 mb-4 flex items-center gap-2"><Shield className="h-4 w-4 text-slate-400" />Default Qualification Rules</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Min Total Credits</Label><Input className="mt-1.5" type="number" defaultValue={120} /></div>
              <div><Label>Min Core Credits</Label><Input className="mt-1.5" type="number" defaultValue={80} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Max Elective Credits</Label><Input className="mt-1.5" type="number" defaultValue={40} /></div>
              <div><Label>Remediation Trigger (% below)</Label><Input className="mt-1.5" type="number" defaultValue={50} /></div>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" defaultChecked className="rounded border-slate-300" />
              Require capstone for NQF 6+ pathways
            </label>
          </div>
        </Card>

        {/* Integrations */}
        <Card className="p-6">
          <h2 className="text-base font-semibold font-display text-slate-900 mb-4 flex items-center gap-2"><Key className="h-4 w-4 text-slate-400" />Integrations</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label>Stripe (Payments)</Label>
                <Badge variant="success" className="text-[10px]">Connected</Badge>
              </div>
              <Input className="font-mono text-xs" defaultValue="pk_test_•••••••••••••••" disabled />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label>AI Provider</Label>
                <Badge variant="secondary" className="text-[10px]">Mock Mode</Badge>
              </div>
              <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm">
                <option>Mock (Development)</option>
                <option>OpenAI</option>
                <option>Anthropic</option>
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label>Email Provider</Label>
                <Badge variant="secondary" className="text-[10px]">Not Configured</Badge>
              </div>
              <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm">
                <option>None</option>
                <option>Resend</option>
                <option>SendGrid</option>
              </select>
            </div>
          </div>
        </Card>

        <Button><Save className="h-4 w-4 mr-2" />Save Settings</Button>
      </div>
    </DashboardShell>
  );
}
