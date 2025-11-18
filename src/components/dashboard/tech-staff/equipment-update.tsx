"use client";

import { useState } from "react";
import { X, AlertCircle } from 'lucide-react';

interface Equipment {
  id: string;
  name: string;
  condition: string;
}

interface EquipmentUpdateModalProps {
  equipment: Equipment;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EquipmentUpdateModal({
  equipment,
  onClose,
  onSuccess,
}: EquipmentUpdateModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    condition: equipment.condition,
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/equipment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipment_id: equipment.id,
          condition: formData.condition,
          notes: formData.notes,
        }),
      });

      if (!res.ok) throw new Error("Failed to update equipment");
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating equipment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-linear-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200 p-6 flex items-center justify-between">
          <h2 className="heading-3 text-slate-900">Update {equipment.name}</h2>
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

          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-600 font-medium mb-1">Current Condition</p>
            <p className="font-semibold text-slate-900 capitalize">{equipment.condition}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">New Condition *</label>
            <select
              required
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              disabled={loading}
            >
              <option value="">Select condition...</option>
              <option value="active">Active</option>
              <option value="not_working">Not Working</option>
              <option value="under_repair">Under Repair</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Notes</label>
            <textarea
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes about the equipment status..."
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
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
