"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, CheckCircle2, AlertCircle } from 'lucide-react';

interface HallCardProps {
  hall: any;
  onBook: (hall: any) => void;
}

export default function HallCard({ hall, onBook }: HallCardProps) {
  const isAvailable = hall.status === "available";

  return (
    <div className="group rounded-xl border-2 border-slate-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 animate-fade-in">
      {/* Image */}
      {hall.image_url && (
        <Link href={`/dashboard/teacher/halls/${hall.id}`}>
          <div className="relative h-48 overflow-hidden bg-linear-to-br from-slate-200 to-slate-300 cursor-pointer">
            <Image
              src={hall.image_url || "/placeholder.svg?height=192&width=400&query=seminar hall"}
              alt={hall.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </Link>
      )}

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title & Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="heading-3 text-slate-900 mb-1">{hall.name}</h3>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4" />
              <span>{hall.location}</span>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold text-sm whitespace-nowrap ${
            isAvailable
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}>
            {isAvailable ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {hall.status.replace("_", " ")}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-lg">
          <div>
            <p className="text-xs text-slate-600 font-medium mb-1">Capacity</p>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-600" />
              <p className="font-semibold text-slate-900">{hall.seating_capacity}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-600 font-medium mb-1">Equipment</p>
            <p className="font-semibold text-slate-900">{hall.equipment?.length || 0}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onBook(hall)}
            disabled={!isAvailable}
            className="flex-1 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Book Now
          </button>
          <Link href={`/dashboard/teacher/halls/${hall.id}`} className="flex-1">
            <button className="w-full px-4 py-2.5 bg-slate-100 text-slate-900 font-semibold rounded-lg hover:bg-slate-200 transition-all duration-200">
              Preview
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
