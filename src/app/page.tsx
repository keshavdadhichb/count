"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Link from "next/link";

interface DateEntry {
  id: string;
  date: string;
  vehicleCount: number;
  packageCount: number;
}

export default function Dashboard() {
  const [dates, setDates] = useState<DateEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const fetchDates = useCallback(async () => {
    try {
      const res = await fetch("/api/dates");
      const data = await res.json();
      setDates(data);
    } catch (error) {
      console.error("Error fetching dates:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDates();
  }, [fetchDates]);

  const handleAddToday = async () => {
    if (isCreating) return;
    setIsCreating(true);
    try {
      const res = await fetch("/api/dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: new Date().toISOString() }),
      });
      const newDate = await res.json();
      await fetchDates();
      // Navigate to the new date
      window.location.href = `/date/${newDate.id}`;
    } catch (error) {
      console.error("Error creating date:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Factory Count" subtitle="Shipment Tracking" />

      <div className="container py-6 space-y-6">
        {/* Add Today Button */}
        <button
          onClick={handleAddToday}
          disabled={isCreating}
          className="btn btn-primary w-full text-lg gap-2"
        >
          {isCreating ? (
            <div className="spinner border-white border-t-transparent" />
          ) : (
            <>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Today&apos;s Date
            </>
          )}
        </button>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card text-center">
            <div className="stat-value text-3xl">{dates.length}</div>
            <div className="stat-label">Total Days</div>
          </div>
          <div className="card text-center">
            <div className="stat-value text-3xl">
              {dates.reduce((sum, d) => sum + d.packageCount, 0)}
            </div>
            <div className="stat-label">Total Bundles</div>
          </div>
        </div>

        {/* Date List */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-700">Recent Dates</h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="spinner" />
            </div>
          ) : dates.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No dates recorded yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Tap &quot;Add Today&apos;s Date&quot; to get started
              </p>
            </div>
          ) : (
            dates.map((dateEntry) => (
              <Link key={dateEntry.id} href={`/date/${dateEntry.id}`}>
                <div className="card group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          {formatDate(dateEntry.date)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {dateEntry.vehicleCount} vehicle
                          {dateEntry.vehicleCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {dateEntry.packageCount}
                      </div>
                      <div className="text-xs text-gray-500">Bundles</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
