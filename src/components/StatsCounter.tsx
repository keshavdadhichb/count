"use client";

interface StatsCounterProps {
    vehicleCount: number;
    dateCount: number;
    grandTotal: number;
}

export default function StatsCounter({
    vehicleCount,
    dateCount,
    grandTotal,
}: StatsCounterProps) {
    return (
        <div className="grid grid-cols-3 gap-3">
            <div className="card text-center p-4">
                <div className="stat-value">{vehicleCount}</div>
                <div className="stat-label mt-1">This Vehicle</div>
            </div>
            <div className="card text-center p-4">
                <div className="stat-value">{dateCount}</div>
                <div className="stat-label mt-1">Today</div>
            </div>
            <div className="card text-center p-4">
                <div className="stat-value">{grandTotal}</div>
                <div className="stat-label mt-1">All Time</div>
            </div>
        </div>
    );
}
