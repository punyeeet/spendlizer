import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Modal from '../Modal';
import MultiSelectDropdown from '../multiselect';
import axios from 'axios';
import { RECURRING_FREQUENCY, TRANSACTION_TYPE } from '@/archetypes/Transaction';
import LottieLoader from '../common/LottieLoader';

interface AddRecurringModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const AddRecurringModal = ({ onClose, onSuccess }: AddRecurringModalProps) => {
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isIndefinite, setIsIndefinite] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        type: TRANSACTION_TYPE.DEBIT,
        frequency: RECURRING_FREQUENCY.MONTHLY,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        description: '',
    });

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get('/api/tags/all');
                setTags(response.data.data || []);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };
        fetchTags();
    }, []);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTagChange = (selectedTagIds: string[]) => {
        setSelectedTags(selectedTagIds);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await axios.post('/api/recurring/schedule', {
                name: formData.name,
                amount: Number(formData.amount),
                type: formData.type,
                frequency: formData.frequency,
                startDate: formData.startDate,
                endDate: isIndefinite || !formData.endDate ? null : formData.endDate,
                tag: selectedTags,
                description: formData.description,
            });
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error creating recurring schedule:', error);
            alert(error.response?.data?.error || 'Failed to create recurring schedule');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal onClose={onClose}>
            <div className="p-1">
                <h2 className="text-xl font-bold text-slate-800 mb-1">Add Recurring Schedule</h2>
                <p className="text-xs text-slate-500 mb-4">
                    Automatically create transactions on a scheduled recurring basis.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3.5 max-h-[75vh] overflow-y-auto pr-1">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Schedule Name *
                        </label>
                        <input
                            type="text"
                            required
                            name="name"
                            placeholder="e.g. Home Loan EMI, Monthly Salary, Gym"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Type *
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            >
                                <option value={TRANSACTION_TYPE.DEBIT}>Debit (Expense)</option>
                                <option value={TRANSACTION_TYPE.CREDIT}>Credit (Income)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Amount (₹) *
                            </label>
                            <input
                                type="number"
                                required
                                min="0.01"
                                step="any"
                                name="amount"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Frequency *
                            </label>
                            <select
                                name="frequency"
                                value={formData.frequency}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            >
                                <option value={RECURRING_FREQUENCY.DAILY}>Daily</option>
                                <option value={RECURRING_FREQUENCY.WEEKLY}>Weekly</option>
                                <option value={RECURRING_FREQUENCY.MONTHLY}>Monthly</option>
                                <option value={RECURRING_FREQUENCY.YEARLY}>Yearly</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Start Date *
                            </label>
                            <input
                                type="date"
                                required
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                Duration / End Date
                            </label>
                            <label className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-medium cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isIndefinite}
                                    onChange={(e) => setIsIndefinite(e.target.checked)}
                                    className="rounded text-indigo-600 focus:ring-indigo-500 size-3.5"
                                />
                                Indefinite length
                            </label>
                        </div>
                        {!isIndefinite && (
                            <input
                                type="date"
                                required={!isIndefinite}
                                name="endDate"
                                value={formData.endDate}
                                min={formData.startDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Tags
                        </label>
                        <MultiSelectDropdown
                            options={tags}
                            getLabel={(t: any) => t.tag}
                            getKey={(t: any) => t._id}
                            placeholder="Select tags"
                            onChange={handleTagChange}
                            value={selectedTags}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Description (Optional)
                        </label>
                        <input
                            type="text"
                            name="description"
                            placeholder="e.g. Monthly rent to landlord"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
                        >
                            {submitting ? 'Creating...' : 'Create Schedule'}
                        </button>
                    </div>
                </form>
                {submitting && <LottieLoader className="w-16 h-16 mx-auto mt-2" />}
            </div>
        </Modal>
    );
};
