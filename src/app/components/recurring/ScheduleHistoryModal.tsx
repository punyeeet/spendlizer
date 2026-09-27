import React, { useEffect, useState } from 'react';
import Modal from '../Modal';
import axios from 'axios';
import { RecurringSchedule, Tag, Transaction } from '@/archetypes/Transaction';
import { formatDate } from '@/helpers/generic';
import { TransactionBadge } from '../chips/TransactionBadge';
import { TagUI } from '../tag';
import LottieLoader from '../common/LottieLoader';

interface ScheduleHistoryModalProps {
    schedule: RecurringSchedule;
    tags: Tag[];
    onClose: () => void;
}

export const ScheduleHistoryModal = ({
    schedule,
    tags,
    onClose,
}: ScheduleHistoryModalProps) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `/api/recurring/schedule/${schedule._id}`
                );
                setTransactions(response.data.data?.transactions || []);
            } catch (error) {
                console.error('Error fetching schedule history:', error);
            } finally {
                setLoading(false);
            }
        };

        if (schedule._id) {
            fetchHistory();
        }
    }, [schedule._id]);

    return (
        <Modal onClose={onClose}>
            <div className="p-1 max-w-2xl w-full">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            {schedule.name}
                        </h2>
                        <p className="text-xs text-slate-500">
                            Generated transaction history for this schedule
                        </p>
                    </div>
                </div>

                <div className="mb-4 bg-slate-50 p-3 rounded-xl flex flex-wrap gap-4 text-xs text-slate-600">
                    <div>
                        <span className="text-slate-400 block font-medium uppercase tracking-wider">Amount</span>
                        <span className="font-semibold text-slate-800 text-sm">
                            ₹{Number(schedule.amount).toLocaleString()} ({schedule.type})
                        </span>
                    </div>
                    <div>
                        <span className="text-slate-400 block font-medium uppercase tracking-wider">Frequency</span>
                        <span className="font-semibold text-slate-800 capitalize">
                            {schedule.frequency}
                        </span>
                    </div>
                    <div>
                        <span className="text-slate-400 block font-medium uppercase tracking-wider">Total Generated</span>
                        <span className="font-semibold text-indigo-600 text-sm">
                            {transactions.length} transaction(s)
                        </span>
                    </div>
                </div>

                <div className="max-h-72 overflow-y-auto border border-slate-100 rounded-xl">
                    {loading ? (
                        <div className="py-12 flex justify-center items-center">
                            <LottieLoader className="w-16 h-16" />
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="py-10 text-center text-slate-400 text-sm font-medium">
                            No transactions generated yet for this schedule.
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                                <tr>
                                    <th className="py-2.5 px-3">Date</th>
                                    <th className="py-2.5 px-3">Tags</th>
                                    <th className="py-2.5 px-3">Description</th>
                                    <th className="py-2.5 px-3 text-right">Amount</th>
                                    <th className="py-2.5 px-3 text-center">Type</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {transactions.map((tx, idx) => (
                                    <tr key={tx._id || idx} className="hover:bg-slate-50/70">
                                        <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-700">
                                            {formatDate(tx.date)}
                                        </td>
                                        <td className="py-2.5 px-3">
                                            <div className="flex flex-wrap gap-1 items-center">
                                                {tx.tag && tx.tag.length > 0 ? (
                                                    tx.tag.map((tagId) => {
                                                        const result = tags.find((t) => t._id === tagId);
                                                        return result ? <TagUI tag={result} key={result._id} /> : null;
                                                    })
                                                ) : (
                                                    <span className="text-slate-400 italic text-[11px]">None</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-3 text-slate-600 max-w-[150px] truncate">
                                            {tx.description || '—'}
                                        </td>
                                        <td className="py-2.5 px-3 text-right font-semibold whitespace-nowrap">
                                            <span
                                                className={
                                                    tx.type === 'debit' ? 'text-rose-600' : 'text-emerald-600'
                                                }
                                            >
                                                {tx.type === 'debit' ? '-' : '+'}₹{Number(tx.amount || 0).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                            <TransactionBadge type={tx.type} size="sm" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};
