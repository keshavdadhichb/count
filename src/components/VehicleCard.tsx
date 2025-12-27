"use client";

import Link from "next/link";

interface VehicleCardProps {
    id: string;
    vehicleNo: string;
    tripNo?: string | null;
    targetCount?: number | null;
    packageCount: number;
    dateId: string;
}

export default function VehicleCard({
    id,
    vehicleNo,
    tripNo,
    targetCount,
    packageCount,
    dateId,
}: VehicleCardProps) {
    const progress = targetCount ? Math.min((packageCount / targetCount) * 100, 100) : null;

    return (
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
                    <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{packageCount}</div>
                        <div className="text-xs text-gray-500">
                            {targetCount ? `of ${targetCount}` : "Bundles"}
                        </div>
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
    );
}
