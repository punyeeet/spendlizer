"use client"
import React, { useState, useEffect, use, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Modal from '@/app/components/Modal';
import { formatDate } from '@/helpers/generic';
import { Player } from '@lottiefiles/react-lottie-player';
import loadingAnimation from '@/assets/animation-loading.json'
import Layout from '../components/NavbarWrapper';
import { Dropdown, MenuProps } from 'antd';
import MultiSelectDropdown from '../components/multiselect';
import { DebitModal } from '../components/add-transaction/DebitModal';
import CreditModal from '../components/add-transaction/CreditModal';
import { AddTag } from '../components/add-tag';
import { Tag, Transaction } from '@/archetypes/Transaction';
import { TagUI } from '../components/tag';
import { BsCreditCard2FrontFill } from "react-icons/bs";



const Dashboard = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [showDebitModal, setShowDebitModal] = useState(false);
    const [showCreditModal, setShowCreditModal] = useState(false);
    const [tags, setTags] = useState<Tag[]>([])

    const [submittingLoader, setSubmittingLoader] = useState(false);

    const [addTagModal, setAddTagModal] = useState(false);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('/api/transaction/all'); // Adjust the endpoint as necessary

                const fetchedData = response.data.data;

                setTransactions(fetchedData);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [submittingLoader]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get('/api/tags/all'); // Adjust the endpoint as necessary

                const fetchedData = response.data.data;

                setTags(fetchedData);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }, []);


    return (
        <Layout>
            <div className="min-h-screen bg-gray p-8">
                <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-700">Dashboard</h1>
                        <div className=''>
                            <button
                                className="bg-blue-700 text-white py-2 px-4 rounded mr-2 hover:bg-blue-800"
                                onClick={() => {
                                    setShowDebitModal(true)
                                }}
                            >
                                Debit <span>&#43;</span>
                            </button>
                            <button
                                className="bg-pink-400 text-white py-2 px-4 mr-2 rounded hover:bg-pink-500"
                                onClick={() => {
                                    setShowCreditModal(true)
                                }}
                            >
                                Credit <span>&#43;</span>
                            </button>
                            <button
                                className="bg-rose-300 text-white py-2 px-4 rounded hover:bg-rose-400"
                                onClick={() => {
                                    setAddTagModal(true)
                                }}
                            >
                                New Tag <span>&#43;</span>
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2">Date 📅</th>
                                    <th className="py-2">Tag 🏷️</th>
                                    <th className="py-2">Amount 💳</th>
                                    <th className="py-2">Description 📝</th>
                                    <th className="py-2 flex">Type <span className='mt-1 ml-1'><BsCreditCard2FrontFill color='#' /></span></th>
                                    <th className='py-2'>Action ✏️</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction, index) => (
                                    <tr key={index}>
                                        <td className="py-2 border-t text-center">{formatDate(transaction.date)}</td>
                                        <td className="py-2 border-t text-center">
                                            {
                                                transaction.tag.map((tag) => {
                                                    const result = tags.find((ob) => ob._id == tag);

                                                    return (
                                                        result && <TagUI tag={result} key={result._id} />
                                                    )
                                                })
                                            }
                                        </td>
                                        <td className="py-2 border-t text-center">{transaction.amount}</td>
                                        <td className="py-2 border-t text-center">{transaction.description}</td>
                                        <td className={`py-2 border-t text-center rounded-md text-white font-semibold ${transaction.type == 'debit' ? 'bg-red-500' : 'bg-green-500'}`}>{transaction.type}</td>
                                        <td className="py-2 border-t text-center"> <a href='#'>Edit</a> <a href='#'>Delete</a></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Debit Modal */}
                {showDebitModal && (
                    <DebitModal
                        setShowDebitModal={setShowDebitModal}
                        submittingLoader={submittingLoader}
                        setSubmittingLoader={setSubmittingLoader}
                    />
                )}

                {/* Credit Modal */}
                {showCreditModal && (
                    <CreditModal
                        setShowCreditModal={setShowCreditModal}
                        submittingLoader={submittingLoader}
                        setSubmittingLoader={setSubmittingLoader}
                    />
                )}

                {/* Add Tag Modal */}
                {addTagModal && (
                    <AddTag
                        setAddTagModal={setAddTagModal}
                        submittingLoader={submittingLoader}
                        setSubmittingLoader={setSubmittingLoader}
                    />
                )}
            </div>
        </Layout>
    );
};

export default Dashboard;


