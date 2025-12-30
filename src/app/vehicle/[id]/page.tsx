"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import PackageInput from "@/components/PackageInput";
import PackageList from "@/components/PackageList";
import StatsCounter from "@/components/StatsCounter";
import DuplicateToast from "@/components/DuplicateToast";
import VoiceInput from "@/components/VoiceInput";

interface Package {
    id: string;
    packageNo: string;
    isDuplicate: boolean;
    isADAS: boolean;
    isLoose: boolean;
    createdAt: string;
}

interface VehicleDetails {
    id: string;
    vehicleNo: string;
    tripNo: string | null;
    targetCount: number | null;
    workDateId: string;
    date: string;
    packages: Package[];
}

interface Stats {
    vehicleCount: number;
    dateCount: number;
    grandTotal: number;
}

export default function VehiclePage() {
    const params = useParams();
    const router = useRouter();
    const vehicleId = params.id as string;

    const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
    const [stats, setStats] = useState<Stats>({
        vehicleCount: 0,
        dateCount: 0,
        grandTotal: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [duplicateMessage, setDuplicateMessage] = useState("");
    const [showDuplicateToast, setShowDuplicateToast] = useState(false);
    const [isEditingVehicle, setIsEditingVehicle] = useState(false);
    const [editVehicleNo, setEditVehicleNo] = useState("");

    const fetchVehicle = useCallback(async () => {
        try {
            const res = await fetch(`/api/vehicles/${vehicleId}`);
            if (!res.ok) {
                router.push("/");
                return;
            }
            const data = await res.json();
            setVehicle(data);
        } catch (error) {
            console.error("Error fetching vehicle:", error);
        } finally {
            setIsLoading(false);
        }
    }, [vehicleId, router]);

    const fetchStats = useCallback(async () => {
        if (!vehicle) return;
        try {
            const res = await fetch(
                `/api/stats?vehicleId=${vehicleId}&dateId=${vehicle.workDateId}`
            );
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    }, [vehicle, vehicleId]);

    useEffect(() => {
        fetchVehicle();
    }, [fetchVehicle]);

    useEffect(() => {
        if (vehicle) {
            fetchStats();
        }
    }, [vehicle, fetchStats]);

    const handleSubmitPackage = async (
        packageNo: string,
        isADAS: boolean = false,
        isLoose: boolean = false
    ): Promise<{ success: boolean; isDuplicate: boolean }> => {
        try {
            const res = await fetch("/api/packages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ vehicleId, packageNo, isADAS, isLoose }),
            });

            const data = await res.json();

            if (data.success && data.package) {
                // Add to local state immediately for instant feedback
                setVehicle((prev) =>
                    prev
                        ? {
                            ...prev,
                            packages: [data.package, ...prev.packages],
                        }
                        : prev
                );

                // Update stats
                setStats((prev) => ({
                    vehicleCount: prev.vehicleCount + 1,
                    dateCount: prev.dateCount + 1,
                    grandTotal: prev.grandTotal + 1,
                }));

                // Show duplicate warning if applicable
                if (data.isDuplicate) {
                    setDuplicateMessage(
                        `⚠️ Duplicate: Package ${packageNo} was previously scanned`
                    );
                    setShowDuplicateToast(true);
                }
            }

            return { success: data.success, isDuplicate: data.isDuplicate || false };
        } catch (error) {
            console.error("Error adding package:", error);
            return { success: false, isDuplicate: false };
        }
    };

    const handleDeletePackage = async (id: string) => {
        try {
            const res = await fetch(`/api/packages/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                // Remove from local state
                setVehicle((prev) =>
                    prev
                        ? {
                            ...prev,
                            packages: prev.packages.filter((p) => p.id !== id),
                        }
                        : prev
                );

                // Update stats
                setStats((prev) => ({
                    vehicleCount: Math.max(0, prev.vehicleCount - 1),
                    dateCount: Math.max(0, prev.dateCount - 1),
                    grandTotal: Math.max(0, prev.grandTotal - 1),
                }));
            }
        } catch (error) {
            console.error("Error deleting package:", error);
        }
    };

    const handleEditPackage = async (id: string, newPackageNo: string) => {
        try {
            const res = await fetch(`/api/packages/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ packageNo: newPackageNo }),
            });

            const data = await res.json();

            if (data.success && data.package) {
                // Update local state
                setVehicle((prev) =>
                    prev
                        ? {
                            ...prev,
                            packages: prev.packages.map((p) =>
                                p.id === id ? data.package : p
                            ),
                        }
                        : prev
                );

                // Show duplicate warning if applicable
                if (data.isDuplicate) {
                    setDuplicateMessage(
                        `⚠️ Duplicate: Package ${newPackageNo} already exists`
                    );
                    setShowDuplicateToast(true);
                }
            }
        } catch (error) {
            console.error("Error editing package:", error);
        }
    };

    const handleEditVehicle = async () => {
        if (!editVehicleNo.trim()) return;

        try {
            const res = await fetch(`/api/vehicles/${vehicleId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ vehicleNo: editVehicleNo }),
            });

            const data = await res.json();
            if (data.success) {
                setVehicle(prev => prev ? { ...prev, vehicleNo: data.vehicle.vehicleNo } : prev);
                setIsEditingVehicle(false);
            }
        } catch (error) {
            console.error("Error updating vehicle:", error);
        }
    };

    if (isLoading || !vehicle) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="spinner" />
            </div>
        );
    }

    const progress = vehicle.targetCount
        ? Math.min((vehicle.packages.length / vehicle.targetCount) * 100, 100)
        : null;

    return (
        <div className="min-h-screen bg-gray-50 safe-area-bottom">
            <DuplicateToast
                message={duplicateMessage}
                isVisible={showDuplicateToast}
                onClose={() => setShowDuplicateToast(false)}
            />

            <Header
                title={vehicle.vehicleNo}
                subtitle={vehicle.tripNo ? `Trip ${vehicle.tripNo}` : undefined}
                backHref={`/date/${vehicle.workDateId}`}
            />

            {/* Vehicle Edit Section */}
            <div className="container pt-4">
                {isEditingVehicle ? (
                    <div className="flex gap-2 items-center">
                        <input
                            type="text"
                            value={editVehicleNo}
                            onChange={(e) => setEditVehicleNo(e.target.value.toUpperCase())}
                            placeholder="Vehicle Number"
                            className="flex-1 px-4 py-2 border-2 border-blue-300 rounded-xl font-bold text-lg focus:outline-none focus:border-blue-500"
                            autoFocus
                        />
                        <button
                            onClick={handleEditVehicle}
                            className="px-4 py-2 bg-green-500 text-white rounded-xl font-bold"
                        >
                            ✓
                        </button>
                        <button
                            onClick={() => setIsEditingVehicle(false)}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-xl font-bold"
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            setEditVehicleNo(vehicle.vehicleNo);
                            setIsEditingVehicle(true);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit Vehicle Number
                    </button>
                )}
            </div>

            <div className="container py-6 space-y-6">
                {/* Progress Bar (if target set) */}
                {progress !== null && (
                    <div className="card">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-600">Progress</span>
                            <span className="text-sm font-bold text-blue-600">
                                {vehicle.packages.length} / {vehicle.targetCount} Bundles
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${progress >= 100 ? "bg-green-500" : "bg-blue-500"
                                    }`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        {progress >= 100 && (
                            <p className="text-sm text-green-600 font-semibold mt-2 text-center">
                                ✓ Target Reached!
                            </p>
                        )}
                    </div>
                )}

                {/* Stats Counter */}
                <StatsCounter
                    vehicleCount={stats.vehicleCount}
                    dateCount={stats.dateCount}
                    grandTotal={stats.grandTotal}
                />

                {/* Package Input (Critical Component) */}
                <div className="card">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Scan Package
                    </h3>
                    <PackageInput onSubmit={handleSubmitPackage} />

                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <VoiceInput
                            onNumberDetected={async (num) => {
                                await handleSubmitPackage(num);
                            }}
                        />
                    </div>
                </div>

                {/* Package List */}
                <div>
                    <h3 className="text-lg font-bold text-gray-700 mb-3">
                        Scanned Packages ({vehicle.packages.length})
                    </h3>
                    <PackageList
                        packages={vehicle.packages}
                        onDelete={handleDeletePackage}
                        onEdit={handleEditPackage}
                    />
                </div>
            </div>
        </div>
    );
}
