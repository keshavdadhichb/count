"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import VehicleCard from "@/components/VehicleCard";

interface Vehicle {
    id: string;
    vehicleNo: string;
    tripNo: string | null;
    targetCount: number | null;
    packageCount: number;
}

interface DateDetails {
    id: string;
    date: string;
    vehicles: Vehicle[];
}

export default function DateDetailPage() {
    const params = useParams();
    const router = useRouter();
    const dateId = params.id as string;

    const [dateDetails, setDateDetails] = useState<DateDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingVehicle, setIsAddingVehicle] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [vehicleNo, setVehicleNo] = useState("");
    const [tripNo, setTripNo] = useState("");
    const [targetCount, setTargetCount] = useState("");

    const fetchDateDetails = useCallback(async () => {
        try {
            const res = await fetch(`/api/dates/${dateId}`);
            if (!res.ok) {
                router.push("/");
                return;
            }
            const data = await res.json();
            setDateDetails(data);
        } catch (error) {
            console.error("Error fetching date:", error);
        } finally {
            setIsLoading(false);
        }
    }, [dateId, router]);

    useEffect(() => {
        fetchDateDetails();
    }, [fetchDateDetails]);

    const handleAddVehicle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vehicleNo.trim() || isAddingVehicle) return;

        setIsAddingVehicle(true);
        try {
            const res = await fetch("/api/vehicles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    workDateId: dateId,
                    vehicleNo: vehicleNo.trim(),
                    tripNo: tripNo.trim() || null,
                    targetCount: targetCount.trim() || null,
                }),
            });
            const newVehicle = await res.json();
            setVehicleNo("");
            setTripNo("");
            setTargetCount("");
            setShowAddForm(false);
            // Navigate to the new vehicle
            router.push(`/vehicle/${newVehicle.id}`);
        } catch (error) {
            console.error("Error adding vehicle:", error);
        } finally {
            setIsAddingVehicle(false);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            return "Today";
        }
        return date.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    if (isLoading || !dateDetails) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="spinner" />
            </div>
        );
    }

    const totalPackages = dateDetails.vehicles.reduce(
        (sum, v) => sum + v.packageCount,
        0
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                title={formatDate(dateDetails.date)}
                subtitle={`${dateDetails.vehicles.length} vehicles • ${totalPackages} bundles`}
                backHref="/"
            />

            <div className="container py-6 space-y-6">
                {/* Add Vehicle Button/Form */}
                {!showAddForm ? (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="btn btn-primary w-full text-lg gap-2"
                    >
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
                        Add Vehicle
                    </button>
                ) : (
                    <form onSubmit={handleAddVehicle} className="card space-y-4">
                        <h3 className="text-lg font-bold text-gray-900">New Vehicle</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Vehicle Number *
                            </label>
                            <input
                                type="text"
                                value={vehicleNo}
                                onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
                                placeholder="TN59AT0877"
                                className="input"
                                autoFocus
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Trip Number
                                </label>
                                <input
                                    type="text"
                                    value={tripNo}
                                    onChange={(e) => setTripNo(e.target.value)}
                                    placeholder="1"
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Target Count
                                </label>
                                <input
                                    type="number"
                                    value={targetCount}
                                    onChange={(e) => setTargetCount(e.target.value)}
                                    placeholder="85"
                                    className="input"
                                    inputMode="numeric"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddForm(false);
                                    setVehicleNo("");
                                    setTripNo("");
                                    setTargetCount("");
                                }}
                                className="btn btn-outline flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isAddingVehicle || !vehicleNo.trim()}
                                className="btn btn-primary flex-1"
                            >
                                {isAddingVehicle ? (
                                    <div className="spinner border-white border-t-transparent" />
                                ) : (
                                    "Add & Start"
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {/* Vehicles List */}
                <div className="space-y-3">
                    <h2 className="text-lg font-bold text-gray-700">Vehicles</h2>

                    {dateDetails.vehicles.length === 0 ? (
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
                                    <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
                                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                    <circle cx="5.5" cy="18.5" r="2.5" />
                                    <circle cx="18.5" cy="18.5" r="2.5" />
                                </svg>
                            </div>
                            <p className="text-gray-500 font-medium">No vehicles added yet</p>
                            <p className="text-gray-400 text-sm mt-1">
                                Tap &quot;Add Vehicle&quot; to get started
                            </p>
                        </div>
                    ) : (
                        dateDetails.vehicles.map((vehicle) => (
                            <VehicleCard
                                key={vehicle.id}
                                id={vehicle.id}
                                vehicleNo={vehicle.vehicleNo}
                                tripNo={vehicle.tripNo}
                                targetCount={vehicle.targetCount}
                                packageCount={vehicle.packageCount}
                                dateId={dateId}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
