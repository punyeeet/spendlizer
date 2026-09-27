'use client';
import { User } from "@/archetypes/Auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Layout from "../components/NavbarWrapper";
import Avatar from "../components/avatar/Avatar";
import { FiLogOut, FiMail, FiUser, FiShield } from "react-icons/fi";

export default function ProfilePage() {
    const router = useRouter();

    const [data, setData] = useState<User>({
        email: '',
        username: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const response = await axios.get('/api/users/me');
                setData(response.data.data);
            } catch (err) {
                console.error("Failed to fetch user details:", err);
            } finally {
                setLoading(false);
            }
        };

        getUserDetails();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.get('/api/users/logout');
            router.push('/login');
        } catch (error: any) {
            console.error(error.message);
            alert(error.message);
        }
    };

    return (
        <Layout>
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-300">
                    {/* Header Banner */}
                    <div className="h-32 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 relative">
                        <div className="absolute -bottom-12 left-8 ring-4 ring-white rounded-full">
                            <Avatar name={data.username || 'User'} size="2xl" />
                        </div>
                    </div>

                    {/* Profile Body */}
                    <div className="pt-16 pb-8 px-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    {loading ? 'Loading...' : data.username || 'Spendlizer User'}
                                </h1>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                    <FiShield className="text-indigo-500" /> Account Active
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-200 shadow-sm"
                            >
                                <FiLogOut /> Logout
                            </button>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <FiMail className="text-slate-400 text-lg" />
                                    <div>
                                        <div className="text-xs text-slate-400 font-medium">Email Address</div>
                                        <div className="text-sm font-medium text-slate-800">{data.email || 'Not available'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <FiUser className="text-slate-400 text-lg" />
                                    <div>
                                        <div className="text-xs text-slate-400 font-medium">Username</div>
                                        <div className="text-sm font-medium text-slate-800">@{data.username || 'user'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
                            Spendlizer — Personal Expense & Budget Intelligence
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
