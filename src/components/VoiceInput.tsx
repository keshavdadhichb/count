"use client";

import { useState, useRef, useCallback } from "react";

interface VoiceInputProps {
    onNumberDetected: (number: string) => void;
    disabled?: boolean;
}

export default function VoiceInput({ onNumberDetected, disabled }: VoiceInputProps) {
    const [isListening, setIsListening] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [lastAdded, setLastAdded] = useState("");
    const [error, setError] = useState("");

    const socketRef = useRef<WebSocket | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const processedNumbersRef = useRef<Set<string>>(new Set());

    // Extract 4-digit numbers from speech
    const extractNumbers = useCallback((text: string): string[] => {
        const wordToNumber: { [key: string]: string } = {
            'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
            'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
            'oh': '0', 'to': '2', 'too': '2', 'for': '4', 'won': '1',
            'tree': '3', 'free': '3', 'ate': '8', 'niner': '9'
        };

        let processed = text.toLowerCase().trim();
        console.log("Original text:", processed);

        // Replace word numbers with digits (multiple passes for reliability)
        for (let i = 0; i < 3; i++) {
            Object.entries(wordToNumber).forEach(([word, digit]) => {
                processed = processed.replace(new RegExp(`\\b${word}\\b`, 'gi'), digit);
            });
        }
        console.log("After word replacement:", processed);

        // Remove ALL spaces between digits
        while (processed.match(/(\d)\s+(\d)/)) {
            processed = processed.replace(/(\d)\s+(\d)/g, '$1$2');
        }
        console.log("After space removal:", processed);

        // Find all number sequences (3-6 digits to be flexible)
        const matches = processed.match(/\d{3,6}/g) || [];
        console.log("Found numbers:", matches);

        // Take first 4 digits if longer
        const results = matches.map(m => m.length > 4 ? m.slice(0, 4) : m);

        return [...new Set(results)];
    }, []);

    // Process detected numbers
    const processNumbers = useCallback((numbers: string[]) => {
        const now = Date.now();

        numbers.forEach(num => {
            const key = `${num}-${Math.floor(now / 3000)}`;

            if (!processedNumbersRef.current.has(key)) {
                processedNumbersRef.current.add(key);

                setTimeout(() => {
                    processedNumbersRef.current.delete(key);
                }, 5000);

                setLastAdded(num);
                onNumberDetected(num);

                if (navigator.vibrate) {
                    navigator.vibrate(100);
                }
            }
        });
    }, [onNumberDetected]);

    // Convert Float32Array to Int16Array for Deepgram
    const floatTo16BitPCM = (float32Array: Float32Array): ArrayBuffer => {
        const buffer = new ArrayBuffer(float32Array.length * 2);
        const view = new DataView(buffer);
        for (let i = 0; i < float32Array.length; i++) {
            const s = Math.max(-1, Math.min(1, float32Array[i]));
            view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        }
        return buffer;
    };

    const startListening = useCallback(async () => {
        setIsConnecting(true);
        setError("");
        setTranscript("");
        setLastAdded("");

        try {
            // Get API key from server
            const tokenRes = await fetch("/api/speech-token");
            const { apiKey, error: tokenError } = await tokenRes.json();

            if (tokenError || !apiKey) {
                throw new Error(tokenError || "Failed to get API key");
            }

            // Get microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 16000,
                    echoCancellation: true,
                    noiseSuppression: true,
                }
            });
            streamRef.current = stream;

            // Create AudioContext
            const audioContext = new AudioContext({ sampleRate: 16000 });
            audioContextRef.current = audioContext;

            const source = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            // Connect to Deepgram WebSocket
            const socket = new WebSocket(
                `wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=16000&channels=1&language=en-IN&model=nova-2&punctuate=false&interim_results=true`,
                ["token", apiKey]
            );

            socket.onopen = () => {
                console.log("Deepgram connected!");
                setIsConnecting(false);
                setIsListening(true);

                // Process audio and send to Deepgram
                processor.onaudioprocess = (e) => {
                    if (socket.readyState === WebSocket.OPEN) {
                        const inputData = e.inputBuffer.getChannelData(0);
                        const pcmData = floatTo16BitPCM(inputData);
                        socket.send(pcmData);
                    }
                };

                source.connect(processor);
                processor.connect(audioContext.destination);
            };

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.channel?.alternatives?.[0]) {
                        const text = data.channel.alternatives[0].transcript;
                        const isFinal = data.is_final;

                        console.log(`Deepgram [${isFinal ? 'FINAL' : 'interim'}]:`, text);

                        if (text) {
                            setTranscript(text);

                            // Try to extract numbers from the text
                            const numbers = extractNumbers(text);

                            // Process if we found 4-digit numbers (don't wait for is_final)
                            if (numbers.length > 0) {
                                console.log("✅ Found 4-digit numbers:", numbers);
                                processNumbers(numbers);
                            }
                        }
                    }
                } catch (e) {
                    console.error("Error parsing Deepgram response:", e);
                }
            };

            socket.onerror = (err) => {
                console.error("Deepgram error:", err);
                setError("Connection error. Please try again.");
                stopListening();
            };

            socket.onclose = (event) => {
                console.log("Deepgram disconnected:", event.code, event.reason);
            };

            socketRef.current = socket;

        } catch (err) {
            console.error("Error starting voice input:", err);
            setError(err instanceof Error ? err.message : "Failed to start voice input");
            setIsConnecting(false);
            stopListening();
        }
    }, [extractNumbers, processNumbers]);

    const stopListening = useCallback(() => {
        // Stop processor
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }

        // Close AudioContext
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        // Close WebSocket
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }

        // Stop microphone
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        setIsListening(false);
        setIsConnecting(false);
        processedNumbersRef.current.clear();
    }, []);

    const toggleListening = () => {
        if (isListening || isConnecting) {
            stopListening();
        } else {
            startListening();
        }
    };

    return (
        <div className="space-y-3">
            <button
                type="button"
                onClick={toggleListening}
                disabled={disabled}
                className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-lg transition-all ${isListening
                    ? "bg-red-500 text-white"
                    : isConnecting
                        ? "bg-yellow-500 text-white"
                        : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isListening ? "animate-pulse" : ""}
                >
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
                {isConnecting
                    ? "Connecting..."
                    : isListening
                        ? "LISTENING... Tap to Stop"
                        : "Speak to Add"}
            </button>

            {(isListening || isConnecting || error) && (
                <div className={`border-2 rounded-xl p-4 space-y-2 ${error ? "bg-red-50 border-red-200" : "bg-purple-50 border-purple-200"
                    }`}>
                    {!error && isListening && (
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-purple-700">
                                Say any 4-digit number clearly
                            </span>
                        </div>
                    )}

                    {error && (
                        <p className="text-red-600 text-sm font-medium">
                            ⚠️ {error}
                        </p>
                    )}

                    {transcript && !error && (
                        <p className="text-gray-700 text-base bg-white rounded-lg p-2 font-mono">
                            &quot;{transcript}&quot;
                        </p>
                    )}

                    {lastAdded && !error && (
                        <div className="flex items-center gap-2 text-green-600 font-bold text-lg">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Added: {lastAdded}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
