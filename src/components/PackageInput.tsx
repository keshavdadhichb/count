"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";

interface PackageInputProps {
    onSubmit: (packageNo: string, isADAS: boolean, isLoose: boolean) => Promise<{ success: boolean; isDuplicate: boolean }>;
    disabled?: boolean;
}

interface FormData {
    packageNo: string;
}

export default function PackageInput({ onSubmit, disabled }: PackageInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isADAS, setIsADAS] = useState(false);
    const [isLoose, setIsLoose] = useState(false);

    const { register, handleSubmit, reset } = useForm<FormData>({
        defaultValues: {
            packageNo: "",
        },
    });

    // Auto-focus on mount and after each submission
    useEffect(() => {
        if (inputRef.current && !disabled) {
            inputRef.current.focus();
        }
    }, [disabled]);

    const handleFormSubmit = useCallback(async (data: FormData) => {
        const trimmed = data.packageNo.trim();
        if (!trimmed || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onSubmit(trimmed, isADAS, isLoose);
            reset();
            // Re-focus after submission
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        } finally {
            setIsSubmitting(false);
        }
    }, [onSubmit, reset, isSubmitting, isADAS, isLoose]);

    const { ref: formRef, ...rest } = register("packageNo", {
        required: true,
        pattern: /^\d+$/,
    });

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="relative">
                <input
                    {...rest}
                    ref={(e) => {
                        formRef(e);
                        (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = e;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="0000"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    disabled={disabled || isSubmitting}
                    className="input input-large disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Package number"
                />
                {isSubmitting && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="spinner" />
                    </div>
                )}
            </div>

            {/* ADAS and LOOSE Checkboxes */}
            <div className="flex gap-4">
                <label
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-base cursor-pointer transition-all border-2 ${isADAS
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-white text-gray-700 border-gray-300 hover:border-orange-400"
                        }`}
                >
                    <input
                        type="checkbox"
                        checked={isADAS}
                        onChange={(e) => {
                            setIsADAS(e.target.checked);
                            if (e.target.checked) setIsLoose(false); // Mutually exclusive
                        }}
                        className="sr-only"
                    />
                    <span className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isADAS ? "bg-white border-white" : "border-gray-400"
                        }`}>
                        {isADAS && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-orange-500">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        )}
                    </span>
                    ADAS
                </label>

                <label
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-base cursor-pointer transition-all border-2 ${isLoose
                            ? "bg-purple-500 text-white border-purple-500"
                            : "bg-white text-gray-700 border-gray-300 hover:border-purple-400"
                        }`}
                >
                    <input
                        type="checkbox"
                        checked={isLoose}
                        onChange={(e) => {
                            setIsLoose(e.target.checked);
                            if (e.target.checked) setIsADAS(false); // Mutually exclusive
                        }}
                        className="sr-only"
                    />
                    <span className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isLoose ? "bg-white border-white" : "border-gray-400"
                        }`}>
                        {isLoose && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-purple-500">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        )}
                    </span>
                    LOOSE
                </label>
            </div>

            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(handleFormSubmit)();
                    // Keep focus on input to prevent keyboard from closing
                    setTimeout(() => {
                        inputRef.current?.focus();
                    }, 10);
                }}
                disabled={disabled || isSubmitting}
                className="btn btn-success w-full text-xl font-bold min-h-[64px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    <div className="spinner border-white border-t-transparent" />
                ) : (
                    <>
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2"
                        >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        ADD {isADAS && "(ADAS)"} {isLoose && "(LOOSE)"}
                    </>
                )}
            </button>

            <p className="text-center text-sm text-gray-500">
                Type a 4-digit package number and press <kbd className="px-2 py-1 bg-gray-100 rounded font-mono text-xs">Enter</kbd> or tap ADD
            </p>
        </form>
    );
}
