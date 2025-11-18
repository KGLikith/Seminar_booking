"use client";

import { useState } from "react";
import { X, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  hall: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookingModal({
  hall,
  onClose,
  onSuccess,
}: BookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    booking_date: "",
    start_time: "",
    end_time: "",
    purpose: "",
    permission_letter_url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.booking_date || !formData.start_time || !formData.end_time || !formData.purpose) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.start_time >= formData.end_time) {
      setError("End time must be after start time");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hall_id: hall.id,
          ...formData,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create booking");
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-linear-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200 p-6 flex items-center justify-between">
          <h2 className="heading-3 text-slate-900">Book {hall.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Booking Date *</label>
            <input
              type="date"
              required
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.booking_date}
              onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Start Time *</label>
              <input
                type="time"
                required
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">End Time *</label>
              <input
                type="time"
                required
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Purpose *</label>
            <textarea
              required
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              placeholder="Describe the purpose of your booking..."
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Permission Letter URL</label>
            <input
              type="url"
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.permission_letter_url}
              onChange={(e) => setFormData({ ...formData, permission_letter_url: e.target.value })}
              placeholder="https://example.com/letter.pdf"
              disabled={loading}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t-2 border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-900 font-semibold rounded-lg hover:bg-slate-200 transition-all duration-200 disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
