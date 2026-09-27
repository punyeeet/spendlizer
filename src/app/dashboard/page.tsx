"use client";
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { formatDate } from '@/helpers/generic';
import Layout from '../components/NavbarWrapper';
import { DebitModal } from '../components/add-transaction/DebitModal';
import CreditModal from '../components/add-transaction/CreditModal';
import { AddTag } from '../components/add-tag';
import { Tag, Transaction } from '@/archetypes/Transaction';
import { TagUI } from '../components/tag';
import { TransactionBadge } from '../components/chips/TransactionBadge';
import ConfirmModal from '../components/confirm-modal';
import { MdDeleteOutline } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import EditModal from '../components/edit-transaction/EditModal';
import { FiPlus } from 'react-icons/fi';
import { BsArrowDownLeft, BsArrowUpRight } from 'react-icons/bs';
import DateRangeFilter, { DateRange } from '../components/common/DateRangeFilter';

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDebitModal, setShowDebitModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState('');
  const [showEditModal, setShowEditModal] = useState('');

  const [tags, setTags] = useState<Tag[]>([]);
  const [submittingLoader, setSubmittingLoader] = useState(false);
  const [addTagModal, setAddTagModal] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;

      const response = await axios.get('/api/transaction/all', { params });
      const fetchedData = response.data.data || [];
      setTransactions(fetchedData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, submittingLoader]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('/api/tags/all');
        const fetchedData = response.data.data || [];
        setTags(fetchedData);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, []);

  const handleDateChange = (range: DateRange) => {
    setDateRange(range);
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50/60 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Header Card */}
          <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Transactions</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Track, filter, and manage your income & expenses
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/80 transition-all shadow-2xs active:scale-95"
                onClick={() => setShowDebitModal(true)}
              >
                <BsArrowUpRight className="text-rose-600" />
                <span>Debit +</span>
              </button>
              <button
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80 transition-all shadow-2xs active:scale-95"
                onClick={() => setShowCreditModal(true)}
              >
                <BsArrowDownLeft className="text-emerald-600" />
                <span>Credit +</span>
              </button>
              <button
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs active:scale-95"
                onClick={() => setAddTagModal(true)}
              >
                <FiPlus className="text-slate-300" />
                <span>New Tag</span>
              </button>
            </div>
          </div>

          {/* Date Range Filter Bar */}
          <DateRangeFilter onDateChange={handleDateChange} />

          {/* Transactions Table Card */}
          <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6">Date</th>
                    <th className="py-3.5 px-4 sm:px-6">Tags</th>
                    <th className="py-3.5 px-4 sm:px-6">Description</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Amount</th>
                    <th className="py-3.5 px-4 sm:px-6 text-center">Type</th>
                    <th className="py-3.5 px-4 sm:px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                        Loading transactions...
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                        No transactions found for the selected date range.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((transaction, index) => (
                      <tr
                        key={transaction._id || index}
                        className="hover:bg-slate-50/70 transition-colors group"
                      >
                        <td className="py-3.5 px-4 sm:px-6 text-slate-600 whitespace-nowrap text-xs sm:text-sm font-medium">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex flex-wrap gap-1 items-center">
                            {transaction.tag && transaction.tag.length > 0 ? (
                              transaction.tag.map((tagId) => {
                                const result = tags.find((ob) => ob._id === tagId);
                                return result ? <TagUI tag={result} key={result._id} /> : null;
                              })
                            ) : (
                              <span className="text-xs text-slate-400 italic">None</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-slate-700 font-medium max-w-xs truncate">
                          {transaction.description || '—'}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-right font-semibold whitespace-nowrap">
                          <span
                            className={
                              transaction.type === 'debit' ? 'text-rose-600' : 'text-emerald-600'
                            }
                          >
                            {transaction.type === 'debit' ? '-' : '+'}₹{Number(transaction.amount || 0).toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-center whitespace-nowrap">
                          <TransactionBadge type={transaction.type} size="sm" />
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setShowEditModal(transaction._id!)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FaEdit size={15} />
                            </button>
                            <button
                              onClick={() => setShowConfirmModal(transaction._id!)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete"
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
        {showDebitModal && (
          <DebitModal
            setShowDebitModal={setShowDebitModal}
            submittingLoader={submittingLoader}
            setSubmittingLoader={setSubmittingLoader}
          />
        )}
        {showCreditModal && (
          <CreditModal
            setShowCreditModal={setShowCreditModal}
            submittingLoader={submittingLoader}
            setSubmittingLoader={setSubmittingLoader}
          />
        )}
        {addTagModal && (
          <AddTag
            setAddTagModal={setAddTagModal}
            submittingLoader={submittingLoader}
            setSubmittingLoader={setSubmittingLoader}
          />
        )}
        {showEditModal !== '' && (
          <EditModal
            setShowEditModal={setShowEditModal}
            id={showEditModal}
            setSubmittingLoader={setSubmittingLoader}
            submittingLoader={submittingLoader}
          />
        )}
        {showConfirmModal !== '' && (
          <ConfirmModal
            setShowConfirmModal={setShowConfirmModal}
            id={showConfirmModal}
            setSubmittingLoader={setSubmittingLoader}
            confirmMessage={'Are you sure you want to delete this transaction?'}
            submittingLoader={submittingLoader}
          />
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
