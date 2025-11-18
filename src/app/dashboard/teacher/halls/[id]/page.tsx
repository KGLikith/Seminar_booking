"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from 'next/navigation';

interface HallPreview {
  id: string;
  name: string;
  seating_capacity: number;
  location: string;
  description: string;
  image_url: string;
  status: string;
  equipment: any[];
  components: any[];
}

export default function HallPreviewPage() {
  const params = useParams();
  const hallId = params.id as string;
  const [hall, setHall] = useState<HallPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchHall = async () => {
      try {
        const res = await fetch(`/api/halls/${hallId}`);
        if (res.ok) {
          setHall(await res.json());
        }
      } catch (error) {
        console.error("Error fetching hall:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHall();
  }, [hallId]);

  if (loading) return <div className="p-8 text-center">Loading hall details...</div>;
  if (!hall) return <div className="p-8 text-center">Hall not found</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="slide-up mb-8">
        <h1 className="heading-1 mb-2">{hall.name}</h1>
        <p className="text-neutral-600">{hall.location}</p>
      </div>

      {/* Hero Image */}
      {hall.image_url && (
        <div className="relative h-96 rounded-lg overflow-hidden mb-8 scale-in shadow-lg">
          <Image
            src={hall.image_url || "/placeholder.svg"}
            alt={hall.name}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 right-4">
            <span className={`status-badge ${
              hall.status === "available" ? "status-approved" : "status-pending"
            }`}>
              {hall.status.charAt(0).toUpperCase() + hall.status.slice(1)}
            </span>
          </div>
        </div>
      )}

      {/* 3D Floor Plan Section */}
      <div className="card p-8 mb-8 slide-up" style={{ animationDelay: "0.1s" }}>
        <h2 className="heading-2 mb-6">Hall Layout</h2>
        <div className="bg-linear-to-br from-primary/5 to-secondary/5 rounded-lg p-12 flex items-center justify-center min-h-80 border border-dashed border-primary/30 fade-in">
          <div className="text-center">
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="heading-3 mb-2">3D Floor Plan</h3>
            <p className="text-neutral-600 mb-4">Interactive 3D layout coming soon</p>
            <div className="flex justify-center gap-4">
              <div className="text-left">
                <p className="text-sm text-neutral-600">Capacity</p>
                <p className="text-2xl font-bold text-primary">{hall.seating_capacity}</p>
              </div>
              <div className="w-px bg-neutral-300"></div>
              <div className="text-left">
                <p className="text-sm text-neutral-600">Area</p>
                <p className="text-2xl font-bold text-primary">TBD</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-4 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-4 px-4 font-medium transition-all duration-300 border-b-2 ${
            activeTab === "overview"
              ? "border-primary text-primary"
              : "border-transparent text-neutral-600 hover:text-neutral-900"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("equipment")}
          className={`pb-4 px-4 font-medium transition-all duration-300 border-b-2 ${
            activeTab === "equipment"
              ? "border-primary text-primary"
              : "border-transparent text-neutral-600 hover:text-neutral-900"
          }`}
        >
          Equipment & Components
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-4 px-4 font-medium transition-all duration-300 border-b-2 ${
            activeTab === "bookings"
              ? "border-primary text-primary"
              : "border-transparent text-neutral-600 hover:text-neutral-900"
          }`}
        >
          Booking Timeline
        </button>
      </div>

      {/* Tab Content */}
      <div className="slide-in-right">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="heading-3 mb-4">About this Hall</h3>
              <p className="text-neutral-600 leading-relaxed">
                {hall.description || "No description available"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6 card-hover">
                <h4 className="font-semibold mb-2 text-neutral-900">Seating Capacity</h4>
                <p className="text-3xl font-bold text-primary">{hall.seating_capacity}</p>
              </div>
              <div className="card p-6 card-hover">
                <h4 className="font-semibold mb-2 text-neutral-900">Hall Status</h4>
                <p className="text-3xl font-bold text-success capitalize">{hall.status}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "equipment" && (
          <div className="space-y-4">
            {hall.equipment && hall.equipment.length > 0 ? (
              hall.equipment.map((item: any) => (
                <div key={item.id} className="card p-6 card-hover">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-neutral-900">{item.name}</h4>
                      <p className="text-sm text-neutral-600">{item.type}</p>
                      {item.serial_number && (
                        <p className="text-xs text-neutral-500 mt-1">SN: {item.serial_number}</p>
                      )}
                    </div>
                    <span className={`status-badge ${
                      item.condition === "active" ? "status-approved" :
                      item.condition === "not_working" ? "status-rejected" :
                      "status-pending"
                    }`}>
                      {item.condition.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="card p-6 text-center text-neutral-600">
                No equipment assigned to this hall
              </div>
            )}

            {hall.components && hall.components.length > 0 && (
              <div className="mt-8">
                <h3 className="heading-3 mb-4">Hall Components</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hall.components.map((comp: any) => (
                    <div key={comp.id} className="card p-4 card-hover">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold">{comp.name}</h5>
                        <span className={`status-badge ${
                          comp.status === "operational" ? "status-approved" :
                          comp.status === "faulty" ? "status-rejected" :
                          "status-pending"
                        }`}>
                          {comp.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600">{comp.type}</p>
                      {comp.location && (
                        <p className="text-xs text-neutral-500 mt-2">📍 {comp.location}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="card p-6">
            <p className="text-neutral-600">Booking timeline feature coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
