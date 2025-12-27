"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
    title: string;
    backHref?: string;
    subtitle?: string;
}

export default function Header({ title, backHref, subtitle }: HeaderProps) {
    const pathname = usePathname();
    const isHome = pathname === "/";

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="container flex items-center gap-4 py-4">
                {backHref && (
                    <Link
                        href={backHref}
                        className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                        aria-label="Go back"
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
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </Link>
                )}
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
                    )}
                </div>
                {isHome && (
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-blue-700">Active</span>
                    </div>
                )}
            </div>
        </header>
    );
}
