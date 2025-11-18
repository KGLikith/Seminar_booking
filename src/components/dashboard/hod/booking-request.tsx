"use client";

import { AlertCircle, Calendar, Clock, MapPin, User, FileText } from 'lucide-react';

interface BookingRequestCardProps {
  booking: any;
  onReview: () => void;
}

export default function BookingRequestCard({
  booking,
  onReview,
}: BookingRequestCardProps) {
  const statusConfig = {
    pending: { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700" },
    approved: { bg: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700" },
    rejected: { bg: "bg-red-50", border: "border-red-200", badge: "bg-red-100 text-red-700" },
    completed: { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700" },
  };

  const config = statusConfig[booking.status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <div className={`rounded-xl border-2 ${config.border} ${config.bg} p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 animate-fade-in`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-slate-600" />
            <h3 className="heading-3 text-slate-900">{booking.hall.name}</h3>
          </div>
          <p className="text-sm text-slate-600">{booking.hall.location}</p>
        </div>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${config.badge} whitespace-nowrap`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex gap-3 items-start">
          <User className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-slate-600 font-medium">Requested by</p>
            <p className="text-sm font-semibold text-slate-900">{booking.teacher.name}</p>
          </div>
        </div>
        
        <div className="flex gap-3 items-start">
          <Calendar className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-slate-600 font-medium">Date</p>
            <p className="text-sm font-semibold text-slate-900">
              {new Date(booking.booking_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })}
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <Clock className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-slate-600 font-medium">Time Slot</p>
            <p className="text-sm font-semibold text-slate-900">
              {new Date(booking.start_time).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit"
              })} - {new Date(booking.end_time).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <AlertCircle className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-slate-600 font-medium">Capacity</p>
            <p className="text-sm font-semibold text-slate-900">{booking.hall.seating_capacity} seats</p>
          </div>
        </div>
      </div>

      {/* Purpose */}
      <div className="mb-6 p-4 bg-white bg-opacity-50 rounded-lg border border-slate-200">
        <div className="flex gap-2 items-start mb-2">
          <FileText className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-600 font-medium">Purpose</p>
        </div>
        <p className="text-sm text-slate-900">{booking.purpose}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {booking.status === "pending" && (
          <button
            onClick={onReview}
            className="flex-1 px-4 py-2 bg-linear-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Review Request
          </button>
        )}
        {booking.permission_letter_url && (
          <a
            href={booking.permission_letter_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 bg-slate-100 text-slate-900 font-semibold rounded-lg hover:bg-slate-200 hover:shadow-md transition-all duration-200 text-center"
          >
            View Letter
          </a>
        )}
      </div>
    </div>
  );
}
