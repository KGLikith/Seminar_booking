"use client";

import { useState } from "react";
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ApprovalModalProps {
  booking: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ApprovalModal({
  booking,
  onClose,
  onSuccess,
}: ApprovalModalProps) {
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "decision">("details");

  const handleApprove = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });

      if (!res.ok) throw new Error("Failed to approve booking");
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error approving booking");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError("Please provide a rejection reason");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "rejected",
          rejection_reason: rejectionReason,
        }),
      });

      if (!res.ok) throw new Error("Failed to reject booking");
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error rejecting booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-linear-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200 p-6 flex items-center justify-between">
          <h2 className="heading-3 text-slate-900">Review Booking</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Booking Details */}
          <div className="space-y-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 font-medium mb-1">Hall Name</p>
              <p className="font-semibold text-slate-900">{booking.hall.name}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 font-medium mb-1">Requested by</p>
              <p className="font-semibold text-slate-900">{booking.teacher.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-600 font-medium mb-1">Date</p>
                <p className="font-semibold text-slate-900 text-sm">
                  {new Date(booking.booking_date).toLocaleDateString()}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-600 font-medium mb-1">Time</p>
                <p className="font-semibold text-slate-900 text-sm">
                  {new Date(booking.start_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 font-medium mb-1">Purpose</p>
              <p className="text-slate-900 text-sm">{booking.purpose}</p>
            </div>
          </div>

          {/* Decision Section */}
          <div className="mb-6 border-t-2 border-slate-200 pt-6">
            <label className="block text-sm font-semibold text-slate-900 mb-3">Rejection Reason (if rejecting)</label>
            <textarea
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              rows={4}
              placeholder="Leave empty to approve the booking..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-900 font-semibold rounded-lg hover:bg-slate-200 transition-all duration-200 disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              className="flex-1 px-4 py-2.5 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={loading}
            >
              <AlertCircle className="w-4 h-4" />
              Reject
            </button>
            <button
              onClick={handleApprove}
              className="flex-1 px-4 py-2.5 bg-linear-to-r from-emerald-600 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={loading}
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
