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
        packageNo: string
    ): Promise<{ success: boolean; isDuplicate: boolean }> => {
        try {
            const res = await fetch("/api/packages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ vehicleId, packageNo }),
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
