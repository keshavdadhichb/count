"use client";

interface PackageListProps {
    packages: Array<{
        id: string;
        packageNo: string;
        isDuplicate: boolean;
        createdAt: string;
    }>;
}

export default function PackageList({ packages }: PackageListProps) {
    if (packages.length === 0) {
        return (
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
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                </div>
                <p className="text-gray-500 font-medium">No packages scanned yet</p>
                <p className="text-gray-400 text-sm mt-1">Start typing to add packages</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {packages.map((pkg, index) => (
                <div
                    key={pkg.id}
                    className={`package-item flex items-center justify-between p-4 rounded-xl border-2 ${pkg.isDuplicate
                            ? "bg-yellow-50 border-yellow-300"
                            : "bg-gray-50 border-gray-200"
                        }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400 font-mono w-8">
                            #{packages.length - index}
                        </span>
                        <span className="text-2xl font-bold tracking-wider">{pkg.packageNo}</span>
                    </div>
                    {pkg.isDuplicate && (
                        <span className="text-xs font-semibold text-yellow-700 bg-yellow-200 px-2 py-1 rounded-full">
                            DUPLICATE
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}
