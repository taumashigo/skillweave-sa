"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Catalogue", href: "/catalog" },
    { label: "Pathways", href: "/catalog" },
    { label: "Opportunities", href: "/opportunities" },
    { label: "Pricing", href: "/pricing" },
    { label: "Providers", href: "/providers" },
  ],
  "For Learners": [
    { label: "Get Started", href: "/signup" },
    { label: "Build a Pathway", href: "/signup" },
    { label: "Credentials", href: "/about" },
    { label: "Portfolio", href: "/about" },
    { label: "RPL", href: "/about" },
  ],
  "For Employers": [
    { label: "Post Opportunities", href: "/signup" },
    { label: "Verify Credentials", href: "/about" },
    { label: "Talent Pool", href: "/about" },
    { label: "Partnerships", href: "/about" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/about" },
    { label: "Privacy Policy", href: "/about" },
    { label: "Terms of Service", href: "/about" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold font-display">SkillWeave</div>
                <div className="text-[9px] font-semibold text-emerald-400 tracking-widest uppercase">
                  South Africa
                </div>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Building futures through modular learning, stackable credentials, and real-world experience.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} SkillWeave SA. All rights reserved. Proudly South African.
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span>Aligned with</span>
            <span className="text-emerald-400 font-semibold">SAQA/NQF</span>
            <span>framework concepts</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
