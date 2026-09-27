import React, { ChangeEvent, FormEvent, memo, useEffect, useState } from 'react';
import Modal from '../Modal';
import MultiSelectDropdown from '../multiselect';
import axios from 'axios';
import { TRANSACTION_TYPE, Transaction } from '@/archetypes/Transaction';
import LottieLoader from '../common/LottieLoader';

const DebitModalComponent = ({ setShowDebitModal, submittingLoader, setSubmittingLoader }: any) => {
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [addTransaction, setAddTransaction] = useState<Transaction>({
        date: new Date(0),
        amount: 0,
        type: TRANSACTION_TYPE.DEBIT,
        tag: [],
        description: '',
    });

    const submitTransaction = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setSubmittingLoader(true);
            const response = await axios.post("api/transaction/add", {
                data: {
                    ...addTransaction,
                },
            });
            console.log('Added successfully', response);
        } catch (error: any) {
            console.log("failed", error.message);
        } finally {
            setSubmittingLoader(false);
            setShowDebitModal(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddTransaction((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTagChange = (options: string[]) => {
        setSelectedTags(options);
        setAddTransaction((prev) => ({
            ...prev,
            tag: options,
        }));
    };

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get('/api/tags/all');
                const fetchedData = response.data.data;
                setTags(fetchedData);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }, []);

    return (
        <Modal onClose={() => setShowDebitModal(false)}>
            <h2 className="text-xl font-semibold mb-4 text-rose-800">Add Debit Detail</h2>
            <form onSubmit={submitTransaction}>
                <div className="mb-4">
                    <label className="block text-gray-700">Date</label>
                    <input
                        type="date"
                        className="mt-1 block w-full p-2 border rounded-md"
                        onChange={handleChange}
                        name="date"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Amount</label>
                    <input
                        type="number"
                        className="mt-1 block w-full p-2 border rounded-md"
                        onChange={handleChange}
                        name="amount"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <input
                        type="text"
                        className="mt-1 block w-full p-2 border rounded-md"
                        onChange={handleChange}
                        name="description"
                    />
                </div>

                <div className="mb-4">
                    <MultiSelectDropdown
                        options={tags}
                        getLabel={(tag: any) => tag.tag}
                        getKey={(tag: any) => tag._id}
                        placeholder={'Select tags'}
                        onChange={handleTagChange}
                        value={selectedTags}
                    />
                </div>

                <button className="bg-rose-600 text-white py-2 px-4 rounded-xl hover:bg-rose-700 font-medium" type="submit">
                    Submit
                </button>
            </form>
            {submittingLoader ? <LottieLoader className="w-20 h-20 text-black" /> : null}
        </Modal>
    );
};

export const DebitModal = memo(DebitModalComponent);
