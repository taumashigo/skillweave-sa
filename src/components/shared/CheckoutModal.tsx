"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, CreditCard, Shield, CheckCircle2, Lock, Sparkles,
  Zap, Gift, Loader2,
} from "lucide-react";
import { Button, Badge, Separator } from "@/components/ui";
import { cn, formatCurrency } from "@/lib/utils";
import { getPaymentService } from "@/lib/services/payment-service";
import type { Module } from "@/types";

interface CheckoutModalProps {
  module: Module;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CheckoutModal({ module, isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "voucher">("card");
  const [voucherCode, setVoucherCode] = useState("");

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const paymentService = getPaymentService();
      const session = await paymentService.createCheckoutSession({
        userId: "current-user",
        moduleId: module.id,
        moduleTitle: module.title,
        amountCents: module.cost_cents,
        successUrl: `${window.location.origin}/learning?enrolled=${module.id}`,
        cancelUrl: `${window.location.origin}/catalog/${module.slug}`,
      });

      // In production, redirect to Stripe checkout
      // For mock, simulate success
      if (session.url) {
        window.location.href = session.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h2 className="text-lg font-semibold font-display text-slate-900">Enrol in Module</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>

          {/* Module Summary */}
          <div className="p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-900">{module.title}</h3>
                <p className="text-xs text-slate-500">{module.provider_name} · {module.credits} credits</p>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 mb-4">
              <span className="text-sm text-slate-600">Module fee</span>
              <span className="text-xl font-bold font-display text-slate-900">
                {formatCurrency(module.cost_cents)}
              </span>
            </div>

            {/* Payment Method */}
            <div className="space-y-2 mb-4">
              <button
                onClick={() => setPaymentMethod("card")}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all",
                  paymentMethod === "card"
                    ? "border-emerald-500 bg-emerald-50/50"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <CreditCard className={cn("h-5 w-5", paymentMethod === "card" ? "text-emerald-600" : "text-slate-400")} />
                <div>
                  <div className="text-sm font-medium text-slate-900">Card Payment</div>
                  <div className="text-xs text-slate-500">Visa, Mastercard, or Amex</div>
                </div>
              </button>
              <button
                onClick={() => setPaymentMethod("voucher")}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all",
                  paymentMethod === "voucher"
                    ? "border-emerald-500 bg-emerald-50/50"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <Gift className={cn("h-5 w-5", paymentMethod === "voucher" ? "text-emerald-600" : "text-slate-400")} />
                <div>
                  <div className="text-sm font-medium text-slate-900">Voucher / Coupon</div>
                  <div className="text-xs text-slate-500">Apply a voucher or bursary code</div>
                </div>
              </button>
            </div>

            {paymentMethod === "voucher" && (
              <div className="mb-4">
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Enter voucher code..."
                  className="w-full h-10 rounded-lg border border-slate-200 px-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                />
              </div>
            )}

            {/* Security notice */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
              <Lock className="h-3 w-3" />
              <span>Payments are processed securely via Stripe</span>
            </div>

            {/* Action */}
            <Button
              className="w-full h-11"
              onClick={handleCheckout}
              isLoading={loading}
            >
              {loading ? "Processing..." : `Pay ${formatCurrency(module.cost_cents)}`}
            </Button>

            {/* Free alternative notice */}
            <div className="flex items-center gap-2 mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
              <Zap className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="text-xs text-emerald-700">
                Some similar modules are available for free. <a href="/catalog" className="font-medium underline">Browse free options</a>
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
