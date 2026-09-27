'use client';
import Avatar from "@/app/components/avatar/Avatar";
import Layout from "@/app/components/NavbarWrapper";
import { FiGithub, FiLinkedin, FiMail, FiTwitter } from "react-icons/fi";

export default function ProfilePage({ params }: any) {
    const username = params?.id || 'User';

    return (
        <Layout>
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl border border-slate-100 p-8">
                    <div className="flex items-center space-x-6 pb-6 border-b border-slate-100">
                        <Avatar name={username} size="xl" />
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{username}</h2>
                            <p className="text-sm text-indigo-600 font-medium">Spendlizer Member</p>
                            <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                                <FiMail className="text-slate-400" /> {username}@example.com
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-base font-semibold text-slate-900">About</h3>
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                            Personal money tracking and analytics profile on Spendlizer.
                        </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <h3 className="text-base font-semibold text-slate-900 mb-3">Connect</h3>
                        <div className="flex space-x-3">
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition-colors">
                                <FiLinkedin /> LinkedIn
                            </a>
                            <a href="https://github.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors">
                                <FiGithub /> GitHub
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 text-xs font-medium hover:bg-sky-100 transition-colors">
                                <FiTwitter /> Twitter
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
