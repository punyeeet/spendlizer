"use client"
import React, { useState, useEffect, } from 'react';
import axios from 'axios';
import { formatDate } from '@/helpers/generic';
import Layout from '../components/NavbarWrapper';
import { DebitModal } from '../components/add-transaction/DebitModal';
import CreditModal from '../components/add-transaction/CreditModal';
import { AddTag } from '../components/add-tag';
import { Tag, Transaction } from '@/archetypes/Transaction';
import { TagUI } from '../components/tag';
import { BsCreditCard2FrontFill } from "react-icons/bs";
import { useRouter } from 'next/navigation';
import ConfirmModal from '../components/confirm-modal';
import { MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import EditModal from '../components/edit-transaction/EditModal';




const Dashboard = () => {
    const router = useRouter();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [showDebitModal, setShowDebitModal] = useState(false);
    const [showCreditModal, setShowCreditModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState('');
    const [showEditModal, setShowEditModal] = useState('');

    const [tags, setTags] = useState<Tag[]>([]);
    const [filter, setFilter] = useState('all');

    const [submittingLoader, setSubmittingLoader] = useState(false);

    const [addTagModal, setAddTagModal] = useState(false);


    const fetchTransactions = async () => {
        try {
            const response = await axios.get('/api/transaction/all'); // Adjust the endpoint as necessary
            const fetchedData = response.data.data;
            setTransactions(fetchedData);
            setFilteredTransactions(fetchedData);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    useEffect(() => {
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

    useEffect(() => {
        filterTransactions();
    }, [filter, transactions]);

    const filterTransactions = () => {
        const now = new Date();
        let filtered = transactions;

        switch (filter) {
            case 'day':
                filtered = transactions.filter(transaction => {
                    const transactionDate = new Date(transaction.date);
                    return transactionDate.toDateString() === now.toDateString();
                });
                break;
            case 'week':
                const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                filtered = transactions.filter(transaction => {
                    const transactionDate = new Date(transaction.date);
                    return transactionDate >= startOfWeek;
                });
                break;
            case 'month':
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                filtered = transactions.filter(transaction => {
                    const transactionDate = new Date(transaction.date);
                    return transactionDate >= startOfMonth;
                });
                break;
            case 'year':
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                filtered = transactions.filter(transaction => {
                    const transactionDate = new Date(transaction.date);
                    return transactionDate >= startOfYear;
                });
                break;
            case 'all':
            default:
                filtered = transactions;
                break;
        }

        setFilteredTransactions(filtered);
    };


    return (
        <Layout>
            <div className="min-h-screen bg-gray p-8">
                <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-700">Dashboard</h1>
                        <div className=''>
                            <button
                                className="bg-gray-700 text-white py-2 px-4 rounded mr-2 hover:bg-gray-600"
                                onClick={() => {
                                    setShowDebitModal(true)
                                }}
                            >
                                Debit <span>&#43;</span>
                            </button>
                            <button
                                className="bg-gray-700 text-white py-2 px-4 mr-2 rounded hover:bg-gray-600"
                                onClick={() => {
                                    setShowCreditModal(true)
                                }}
                            >
                                Credit <span>&#43;</span>
                            </button>
                            <button
                                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-400"
                                onClick={() => {
                                    setAddTagModal(true)
                                }}
                            >
                                New Tag <span>&#43;</span>
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="mr-4">
                            <input
                                type="radio"
                                value="all"
                                checked={filter === 'all'}
                                onChange={() => setFilter('all')}
                            />
                            All
                        </label>
                        <label className="mr-4">
                            <input
                                type="radio"
                                value="day"
                                checked={filter === 'day'}
                                onChange={() => setFilter('day')}
                            />
                            Day
                        </label>
                        <label className="mr-4">
                            <input
                                type="radio"
                                value="week"
                                checked={filter === 'week'}
                                onChange={() => setFilter('week')}
                            />
                            Week
                        </label>
                        <label className="mr-4">
                            <input
                                type="radio"
                                value="month"
                                checked={filter === 'month'}
                                onChange={() => setFilter('month')}
                            />
                            Month
                        </label>
                        <label className="mr-4">
                            <input
                                type="radio"
                                value="year"
                                checked={filter === 'year'}
                                onChange={() => setFilter('year')}
                            />
                            Year
                        </label>
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
                                {filteredTransactions.map((transaction, index) => (
                                    
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
                                        <td className="py-2 border-t text-center justify-evenly ">
                                            
                                            <button onClick={()=>setShowEditModal(transaction._id!)}
                                            className='hover:text-gray-600'
                                                >
                                                <FaEdit size={20}/>
                                            </button>

                                            <button onClick={()=>setShowConfirmModal(transaction._id!)}
                                            className='hover:text-gray-600'
                                                >
                                                <MdDeleteOutline size={20}/>
                                            </button>
                                            
                                        </td>
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

                {/* Edit transaction Modal */}
                {
                    showEditModal !='' && (
                        <EditModal
                            setShowEditModal={setShowEditModal}
                            id={showEditModal}
                            setSubmittingLoader={setSubmittingLoader}
                            submittingLoader={submittingLoader}
                        />
                    )
                }

                {/* Confirm delete Modal */}
                {
                    showConfirmModal !='' && (
                        <ConfirmModal
                            setShowConfirmModal={setShowConfirmModal}
                            id={showConfirmModal}
                            setSubmittingLoader={setSubmittingLoader}
                            confirmMessage={'Are you sure you want to delete?'}
                            submittingLoader={submittingLoader}
                        />
                    )
                }

            </div>
        </Layout>
    );
};

export default Dashboard;


