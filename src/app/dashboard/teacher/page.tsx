"use client";

import BookingModal from "@/components/dashboard/teacher/booking-modal";
import HallCard from "@/components/dashboard/teacher/hall-card";
import { useEffect, useState } from "react";

interface Hall {
  id: string;
  name: string;
  location: string;
  seating_capacity: number;
  image_url?: string;
  status: string;
  equipment: any[];
}

export default function TeacherDashboard() {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHall, setSelectedHall] = useState<Hall | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const res = await fetch("/api/halls");
        if (res.ok) {
          setHalls(await res.json());
        }
      } catch (error) {
        console.error("Error fetching halls:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHalls();
  }, []);

  const handleBookHall = (hall: Hall) => {
    setSelectedHall(hall);
    setShowBookingModal(true);
  };

  if (loading) return <div className="p-8">Loading halls...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="heading-2 mb-2">Available Seminar Halls</h1>
        <p className="text-neutral-600">Select a hall to make a booking request</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {halls.map((hall) => (
          <HallCard
            key={hall.id}
            hall={hall}
            onBook={handleBookHall}
          />
        ))}
      </div>

      {showBookingModal && selectedHall && (
        <BookingModal
          hall={selectedHall}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedHall(null);
          }}
          onSuccess={() => {
            setShowBookingModal(false);
            setSelectedHall(null);
            // Refresh bookings
          }}
        />
      )}
    </div>
  );
}
