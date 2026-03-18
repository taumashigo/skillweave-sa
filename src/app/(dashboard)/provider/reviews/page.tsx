"use client";

import React from "react";
import { Star, MessageSquare, ThumbsUp } from "lucide-react";
import { Badge, Card, Avatar, Button } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { formatDate } from "@/lib/utils";

const mockReviews = [
  { id: "r1", user: "Thabo Mokoena", module: "Intro to Programming with Python", rating: 5, comment: "Brilliant course! The project-based approach made everything click. The pace was perfect for a beginner and the Python exercises were really practical.", date: "2025-03-12" },
  { id: "r2", user: "Nomsa Dlamini", module: "Web Dev with JavaScript & React", rating: 5, comment: "This changed my career trajectory. I went from zero JS knowledge to building React apps in 3 months. The blended format with live sessions was fantastic.", date: "2025-03-10" },
  { id: "r3", user: "Sipho Nkosi", module: "Backend Development with Node.js", rating: 4, comment: "Great content and well-structured. The database sections were excellent. Would have liked more on deployment and CI/CD.", date: "2025-03-08" },
  { id: "r4", user: "Lerato Molefe", module: "Intro to Programming with Python", rating: 5, comment: "As someone who had never written a line of code, this module was incredibly accessible. The remediation support helped me through the tough parts.", date: "2025-03-05" },
  { id: "r5", user: "Palesa Khumalo", module: "DevOps & Cloud Infrastructure", rating: 4, comment: "Challenging but rewarding. The hands-on labs with AWS were the highlight. More content on Kubernetes would be welcome.", date: "2025-02-28" },
  { id: "r6", user: "Kagiso Mthembu", module: "Web Dev with JavaScript & React", rating: 4, comment: "Solid React course. The state management section needs updating for newer patterns, but overall excellent quality.", date: "2025-02-25" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
      ))}
    </div>
  );
}

export default function ProviderReviewsPage() {
  const avgRating = (mockReviews.reduce((s, r) => s + r.rating, 0) / mockReviews.length).toFixed(1);

  return (
    <DashboardShell role="provider" userName="WeThinkCode_" userEmail="admin@wethinkcode.co.za">
      <PageHeader title="Module Reviews" description="See what learners are saying about your modules." />
      <div className="px-6 lg:px-8 py-8 max-w-4xl">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-5 text-center">
            <div className="text-3xl font-bold font-display text-slate-900">{avgRating}</div>
            <StarRating rating={Math.round(Number(avgRating))} />
            <div className="text-xs text-slate-400 mt-1">Average rating</div>
          </Card>
          <Card className="p-5 text-center">
            <div className="text-3xl font-bold font-display text-slate-900">{mockReviews.length}</div>
            <div className="text-xs text-slate-400 mt-1">Total reviews</div>
          </Card>
          <Card className="p-5 text-center">
            <div className="text-3xl font-bold font-display text-emerald-600">{mockReviews.filter(r => r.rating >= 4).length}</div>
            <div className="text-xs text-slate-400 mt-1">4+ star reviews</div>
          </Card>
        </div>

        {/* Reviews */}
        <div className="space-y-4">
          {mockReviews.map((review) => (
            <Card key={review.id} className="p-5">
              <div className="flex items-start gap-3">
                <Avatar name={review.user} size="md" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-sm font-medium text-slate-900">{review.user}</span>
                      <span className="text-xs text-slate-400 ml-2">on {review.module}</span>
                    </div>
                    <span className="text-xs text-slate-400">{formatDate(review.date)}</span>
                  </div>
                  <StarRating rating={review.rating} />
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{review.comment}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <Button variant="ghost" size="sm" className="text-xs text-slate-400 h-7">
                      <ThumbsUp className="h-3 w-3 mr-1" />Helpful
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs text-slate-400 h-7">
                      <MessageSquare className="h-3 w-3 mr-1" />Reply
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
