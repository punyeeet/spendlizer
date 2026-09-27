'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Layout from '../components/NavbarWrapper';
import {
    RecurringSchedule,
    Tag,
    TRANSACTION_TYPE,
    RECURRING_STATUS,
} from '@/archetypes/Transaction';
import { formatDate } from '@/helpers/generic';
import { TagUI } from '../components/tag';
import { TransactionBadge } from '../components/chips/TransactionBadge';
import ConfirmModal from '../components/confirm-modal';
import { MdDeleteOutline } from 'react-icons/md';
import { FaEdit, FaHistory } from 'react-icons/fa';
import { FiPlus, FiRepeat, FiClock } from 'react-icons/fi';
import { AddRecurringModal } from '../components/recurring/AddRecurringModal';
import { EditRecurringModal } from '../components/recurring/EditRecurringModal';
import { ScheduleHistoryModal } from '../components/recurring/ScheduleHistoryModal';

export default function RecurringPage() {
    const [schedules, setSchedules] = useState<RecurringSchedule[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);
    const [submittingLoader, setSubmittingLoader] = useState(false);

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<RecurringSchedule | null>(null);
    const [viewingHistorySchedule, setViewingHistorySchedule] = useState<RecurringSchedule | null>(null);
    const [deletingScheduleId, setDeletingScheduleId] = useState<string>('');

    const fetchSchedules = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/recurring/schedule');
            setSchedules(response.data.data || []);
        } catch (error) {
            console.error('Error fetching recurring schedules:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTags = async () => {
        try {
            const response = await axios.get('/api/tags/all');
            setTags(response.data.data || []);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    useEffect(() => {
        fetchSchedules();
        fetchTags();
    }, [fetchSchedules]);

    const handleDeleteSchedule = async (id: string) => {
        try {
            setSubmittingLoader(true);
            await axios.delete(`/api/recurring/schedule/${id}`);
            fetchSchedules();
        } catch (error: any) {
            console.error('Error deleting schedule:', error);
            alert(error.response?.data?.error || 'Failed to delete schedule');
        } finally {
            setSubmittingLoader(false);
            setDeletingScheduleId('');
        }
    };

    // Calculate quick stats
    const activeSchedules = schedules.filter((s) => s.status === RECURRING_STATUS.ACTIVE);
    const activeDebitsCount = activeSchedules.filter((s) => s.type === TRANSACTION_TYPE.DEBIT).length;
    const activeCreditsCount = activeSchedules.filter((s) => s.type === TRANSACTION_TYPE.CREDIT).length;

    return (
        <Layout>
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50/60 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Top Header Card */}
                    <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                                    <FiRepeat size={20} />
                                </span>
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                                    Recurring Schedules
                                </h1>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                Automate recurring bills, salaries, subscriptions, and EMIs on scheduled dates
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
                        >
                            <FiPlus size={16} />
                            <span>New Schedule</span>
                        </button>
                    </div>

                    {/* Quick Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl p-4 flex items-center gap-3">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                <FiRepeat size={22} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Active Schedules
                                </p>
                                <p className="text-xl font-bold text-slate-800">
                                    {activeSchedules.length}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl p-4 flex items-center gap-3">
                            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                                <FiClock size={22} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Recurring Debits
                                </p>
                                <p className="text-xl font-bold text-rose-600">
                                    {activeDebitsCount} active
                                </p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl p-4 flex items-center gap-3">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                <FiClock size={22} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Recurring Credits
                                </p>
                                <p className="text-xl font-bold text-emerald-600">
                                    {activeCreditsCount} active
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Schedules Table Card */}
                    <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        <th className="py-3.5 px-4 sm:px-6">Schedule Name</th>
                                        <th className="py-3.5 px-4 sm:px-6">Tags</th>
                                        <th className="py-3.5 px-4 sm:px-6">Frequency</th>
                                        <th className="py-3.5 px-4 sm:px-6 text-right">Amount</th>
                                        <th className="py-3.5 px-4 sm:px-6">Next Due</th>
                                        <th className="py-3.5 px-4 sm:px-6">Duration</th>
                                        <th className="py-3.5 px-4 sm:px-6 text-center">Status</th>
                                        <th className="py-3.5 px-4 sm:px-6 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                                                Loading recurring schedules...
                                            </td>
                                        </tr>
                                    ) : schedules.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                                                No recurring schedules found. Create your first schedule above!
                                            </td>
                                        </tr>
                                    ) : (
                                        schedules.map((schedule) => (
                                            <tr
                                                key={schedule._id}
                                                className="hover:bg-slate-50/70 transition-colors group"
                                            >
                                                <td className="py-3.5 px-4 sm:px-6">
                                                    <div className="font-semibold text-slate-800">
                                                        {schedule.name}
                                                    </div>
                                                    {schedule.description && (
                                                        <div className="text-xs text-slate-400 truncate max-w-xs">
                                                            {schedule.description}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-4 sm:px-6">
                                                    <div className="flex flex-wrap gap-1 items-center">
                                                        {schedule.tag && schedule.tag.length > 0 ? (
                                                            schedule.tag.map((tagId) => {
                                                                const result = tags.find((t) => t._id === tagId);
                                                                return result ? <TagUI tag={result} key={result._id} /> : null;
                                                            })
                                                        ) : (
                                                            <span className="text-xs text-slate-400 italic">None</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 sm:px-6">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                                                        {schedule.frequency}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 sm:px-6 text-right font-semibold whitespace-nowrap">
                                                    <span
                                                        className={
                                                            schedule.type === 'debit'
                                                                ? 'text-rose-600'
                                                                : 'text-emerald-600'
                                                        }
                                                    >
                                                        {schedule.type === 'debit' ? '-' : '+'}₹
                                                        {Number(schedule.amount || 0).toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 sm:px-6 text-slate-600 whitespace-nowrap text-xs sm:text-sm font-medium">
                                                    {formatDate(schedule.nextOccurrence)}
                                                </td>
                                                <td className="py-3.5 px-4 sm:px-6 text-slate-600 whitespace-nowrap text-xs">
                                                    {schedule.endDate ? (
                                                        <span>Until {formatDate(schedule.endDate)}</span>
                                                    ) : (
                                                        <span className="text-indigo-600 font-medium">Indefinite</span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-4 sm:px-6 text-center whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider ${
                                                            schedule.status === 'active'
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                : schedule.status === 'paused'
                                                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                                                        }`}
                                                    >
                                                        {schedule.status}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 sm:px-6 text-center whitespace-nowrap">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <button
                                                            onClick={() => setViewingHistorySchedule(schedule)}
                                                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                            title="View Generated Transactions"
                                                        >
                                                            <FaHistory size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingSchedule(schedule)}
                                                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                            title="Edit Schedule"
                                                        >
                                                            <FaEdit size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeletingScheduleId(schedule._id!)}
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                            title="Delete Schedule"
                                                        >
                                                            <MdDeleteOutline size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Modals */}
                {showAddModal && (
                    <AddRecurringModal
                        onClose={() => setShowAddModal(false)}
                        onSuccess={fetchSchedules}
                    />
                )}

                {editingSchedule && (
                    <EditRecurringModal
                        schedule={editingSchedule}
                        onClose={() => setEditingSchedule(null)}
                        onSuccess={fetchSchedules}
                    />
                )}

                {viewingHistorySchedule && (
                    <ScheduleHistoryModal
                        schedule={viewingHistorySchedule}
                        tags={tags}
                        onClose={() => setViewingHistorySchedule(null)}
                    />
                )}

                {deletingScheduleId && (
                    <ConfirmModal
                        setShowConfirmModal={setDeletingScheduleId}
                        id={deletingScheduleId}
                        setSubmittingLoader={setSubmittingLoader}
                        confirmMessage="Are you sure you want to delete this recurring schedule? (Existing past transactions will remain in your dashboard)."
                        submittingLoader={submittingLoader}
                        onDelete={handleDeleteSchedule}
                    />
                )}
            </div>
        </Layout>
    );
}
