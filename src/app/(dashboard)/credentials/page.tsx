"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Award, ExternalLink, QrCode, Download, Eye, Shield, CheckCircle2 } from "lucide-react";
import { Button, Badge, Card, EmptyState, Separator } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useAuth } from "@/lib/hooks";
import { formatDate } from "@/lib/utils";
import type { Credential } from "@/types";

const typeLabels: Record<string, string> = {
  badge: "Badge", certificate: "Certificate", milestone: "Milestone",
  qualification: "Qualification", endorsement: "Endorsement",
};

const supabase = createSupabaseBrowser();

export default function CredentialsPage() {
  const { profile } = useAuth();
  const [credentials, setCredentials] = React.useState<Credential[]>([]);
  React.useEffect(() => {
    if (!profile?.user_id) return;
    supabase.from("credentials").select("*").eq("user_id", profile.user_id).order("issued_at", { ascending: false }).then(({ data }) => { if (data) setCredentials(data as Credential[]); });
  }, [profile?.user_id]);
  

  return (
    <DashboardShell>
      <PageHeader
        title="My Credentials"
        description="All your earned badges, certificates, milestones, and endorsements."
        actions={
          <Link href="/wallet">
            <Button variant="outline" size="sm"><Eye className="h-4 w-4 mr-1.5" />Wallet View</Button>
          </Link>
        }
      />

      <div className="px-6 lg:px-8 py-8 max-w-4xl">
        {credentials.length > 0 ? (
          <div className="space-y-4">
            {credentials.map((cred, i) => (
              <motion.div
                key={cred.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-slate-900">{cred.title}</h3>
                        <Badge variant="outline" className="text-[10px]">{typeLabels[cred.type] || cred.type}</Badge>
                        {cred.is_verified && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                      </div>
                      <p className="text-sm text-slate-500 mb-2">{cred.description}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>Issued by: {cred.issuer}</span>
                        <span>·</span>
                        <span>{formatDate(cred.issued_at)}</span>
                      </div>
                      <div className="mt-2">
                        <code className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                          {cred.credential_hash}
                        </code>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <Link href={`/verify/${cred.id}`}>
                        <Button variant="outline" size="sm" className="text-xs w-full">
                          <ExternalLink className="h-3 w-3 mr-1" />Verify
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="text-xs">
                        <QrCode className="h-3 w-3 mr-1" />QR
                      </Button>
                      <Link href={`/api/certificates/${cred.id}`} target="_blank">
                        <Button variant="outline" size="sm" className="text-xs w-full">
                          <Download className="h-3 w-3 mr-1" />PDF
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Award className="h-8 w-8" />}
            title="No credentials yet"
            description="Complete modules and milestones to earn verifiable digital credentials."
            action={<Link href="/catalog"><Button>Browse Modules</Button></Link>}
          />
        )}
      </div>
    </DashboardShell>
  );
}
