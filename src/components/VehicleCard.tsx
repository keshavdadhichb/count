"use client";

import Link from "next/link";
import { useState } from "react";

interface VehicleCardProps {
    id: string;
    vehicleNo: string;
    tripNo?: string | null;
    targetCount?: number | null;
    packageCount: number;
    dateId: string;
    onDelete?: (id: string) => Promise<void>;
}

export default function VehicleCard({
    id,
    vehicleNo,
    tripNo,
    targetCount,
    packageCount,
    dateId,
    onDelete,
}: VehicleCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const progress = targetCount ? Math.min((packageCount / targetCount) * 100, 100) : null;

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!showConfirm) {
            setShowConfirm(true);
            return;
        }

        if (onDelete) {
            setIsDeleting(true);
            await onDelete(id);
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowConfirm(false);
    };

    return (
        <div className={`relative ${isDeleting ? "opacity-50" : ""}`}>
            <Link href={`/vehicle/${id}`} className="block">
                <div className="card group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
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
                                    <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
                                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                    <circle cx="5.5" cy="18.5" r="2.5" />
                                    <circle cx="18.5" cy="18.5" r="2.5" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">{vehicleNo}</h3>
                                {tripNo && (
                                    <span className="text-sm text-gray-500">Trip {tripNo}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">{packageCount}</div>
                                <div className="text-xs text-gray-500">
                                    {targetCount ? `of ${targetCount}` : "Bundles"}
                                </div>
                            </div>
                            {onDelete && (
                                <div className="flex items-center gap-1">
                                    {showConfirm ? (
                                        <>
                                            <button
                                                onClick={handleDelete}
                                                disabled={isDeleting}
                                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                title="Confirm Delete"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={handleCancelDelete}
                                                className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                                title="Cancel"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M18 6L6 18M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={handleDelete}
                                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                            title="Delete"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {progress !== null && (
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
}
