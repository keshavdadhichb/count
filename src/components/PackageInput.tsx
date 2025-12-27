"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";

interface PackageInputProps {
    onSubmit: (packageNo: string) => Promise<{ success: boolean; isDuplicate: boolean }>;
    disabled?: boolean;
}

interface FormData {
    packageNo: string;
}

export default function PackageInput({ onSubmit, disabled }: PackageInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, reset, setFocus } = useForm<FormData>({
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
            await onSubmit(trimmed);
            reset();
            // Re-focus after submission
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        } finally {
            setIsSubmitting(false);
        }
    }, [onSubmit, reset, isSubmitting]);

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

            <button
                type="submit"
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
                        ADD
                    </>
                )}
            </button>

            <p className="text-center text-sm text-gray-500">
                Type a 4-digit package number and press <kbd className="px-2 py-1 bg-gray-100 rounded font-mono text-xs">Enter</kbd> or tap ADD
            </p>
        </form>
    );
}
