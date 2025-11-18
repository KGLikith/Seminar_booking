"use client";

import { useState } from "react";
import { AlertTriangle, Plus, AlertCircle } from 'lucide-react';

interface MaintenanceReport {
  id?: string;
  date: string;
  hallName: string;
  issue: string;
  priority: "low" | "medium" | "high";
}

export default function MaintenanceReports() {
  const [reports, setReports] = useState<MaintenanceReport[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    hallName: "",
    issue: "",
    priority: "medium" as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.hallName.trim() || !formData.issue.trim()) {
      return;
    }
    setReports([...reports, { ...formData, id: Date.now().toString() }]);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      hallName: "",
      issue: "",
      priority: "medium",
    });
    setShowForm(false);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="w-5 h-5" />;
      case "medium":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Maintenance Reports</h1>
          <p className="text-slate-600">Log and track maintenance issues</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap w-full md:w-auto justify-center md:justify-start"
        >
          <Plus className="w-4 h-4" />
          {showForm ? "Cancel" : "New Report"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Date</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Hall Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Auditorium A"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={formData.hallName}
                  onChange={(e) => setFormData({ ...formData, hallName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Issue Description</label>
              <textarea
                required
                placeholder="Describe the maintenance issue..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                rows={4}
                value={formData.issue}
                onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Priority Level</label>
              <select
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Submit Report
            </button>
          </form>
        </div>
      )}

      {/* Reports List */}
      <div className="space-y-4">
        {reports.length > 0 ? (
          reports.map((report, idx) => (
            <div key={report.id} className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{report.hallName}</h3>
                  <p className="text-sm text-slate-600">{report.date}</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${getPriorityColor(report.priority)}`}>
                  {getPriorityIcon(report.priority)}
                  {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)} Priority
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed">{report.issue}</p>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-slate-50 rounded-lg">
            <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No maintenance reports yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
