"use client";

import { useEffect, useState } from "react";

interface DuplicateToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

export default function DuplicateToast({
    message,
    isVisible,
    onClose,
}: DuplicateToastProps) {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setIsExiting(true);
                setTimeout(() => {
                    setIsExiting(false);
                    onClose();
                }, 300);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] p-4">
            <div
                className={`mx-auto max-w-md warning-banner flex items-center gap-3 ${isExiting ? "toast-exit" : "toast"
                    }`}
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="flex-shrink-0"
                >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z" />
                </svg>
                <span className="flex-1 text-sm font-semibold">{message}</span>
                <button
                    onClick={() => {
                        setIsExiting(true);
                        setTimeout(() => {
                            setIsExiting(false);
                            onClose();
                        }, 300);
                    }}
                    className="p-1 hover:bg-yellow-200 rounded transition-colors"
                    aria-label="Dismiss"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
