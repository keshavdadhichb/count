"use client";

import { useState } from "react";

interface Package {
    id: string;
    packageNo: string;
    isDuplicate: boolean;
    createdAt: string;
}

interface PackageListProps {
    packages: Package[];
    onDelete?: (id: string) => Promise<void>;
    onEdit?: (id: string, newPackageNo: string) => Promise<void>;
}

export default function PackageList({ packages, onDelete, onEdit }: PackageListProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleStartEdit = (pkg: Package) => {
        setEditingId(pkg.id);
        setEditValue(pkg.packageNo);
    };

    const handleSaveEdit = async (id: string) => {
        if (onEdit && editValue.trim()) {
            await onEdit(id, editValue.trim());
        }
        setEditingId(null);
        setEditValue("");
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditValue("");
    };

    const handleDelete = async (id: string) => {
        if (onDelete) {
            setDeletingId(id);
            await onDelete(id);
            setDeletingId(null);
        }
    };

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
                        } ${deletingId === pkg.id ? "opacity-50" : ""}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <div className="flex items-center gap-3 flex-1">
                        <span className="text-sm text-gray-400 font-mono w-8">
                            #{packages.length - index}
                        </span>

                        {editingId === pkg.id ? (
                            <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="text-xl font-bold tracking-wider bg-white border-2 border-blue-500 rounded-lg px-3 py-1 w-32 text-center"
                                inputMode="numeric"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSaveEdit(pkg.id);
                                    if (e.key === "Escape") handleCancelEdit();
                                }}
                            />
                        ) : (
                            <span className="text-2xl font-bold tracking-wider">{pkg.packageNo}</span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {pkg.isDuplicate && editingId !== pkg.id && (
                            <span className="text-xs font-semibold text-yellow-700 bg-yellow-200 px-2 py-1 rounded-full">
                                DUPLICATE
                            </span>
                        )}

                        {editingId === pkg.id ? (
                            <>
                                <button
                                    onClick={() => handleSaveEdit(pkg.id)}
                                    className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                    title="Save"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    title="Cancel"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <>
                                {onEdit && (
                                    <button
                                        onClick={() => handleStartEdit(pkg)}
                                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                        title="Edit"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={() => handleDelete(pkg.id)}
                                        disabled={deletingId === pkg.id}
                                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                                        title="Delete"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
