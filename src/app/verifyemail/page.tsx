"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import LottieLoader from "../components/common/LottieLoader";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    const router = useRouter();

    const verifyUserEmail = async () => {
        try {
            await axios.post('/api/users/verifyemail', { token });
            setVerified(true);
            setTimeout(() => router.push('/login'), 5000);
        } catch (err: any) {
            setError(true);
            console.log(JSON.stringify(err));
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const searchParams = new URLSearchParams(window.location.search);
            const urlToken = searchParams.get('token') || window.location.search.split("=")[1] || '';

            if (!urlToken) {
                setError(true);
            } else {
                setToken(urlToken);
            }
        }
    }, []);

    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail();
        }
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-slate-100 text-center space-y-4">
                {error && !verified ? (
                    <div className="space-y-4">
                        <div className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            Verification Failed
                        </div>
                        <h3 className="text-sm text-slate-600">Something went wrong while verifying your email.</h3>
                        <div>
                            <Link href="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                Back to Login
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h1 className="text-xl font-bold text-slate-800">
                            {!verified ? 'Verifying Email...' : 'Email Verified Successfully! ✅'}
                        </h1>
                        {!verified ? (
                            <LottieLoader className="h-20 w-20 text-black mx-auto" />
                        ) : (
                            <p className="text-xs text-slate-500">Redirecting to login in a few seconds...</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
