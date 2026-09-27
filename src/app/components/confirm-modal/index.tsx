import React from 'react';
import Modal from '../Modal';
import axios from 'axios';
import LottieLoader from '../common/LottieLoader';

const ConfirmModal = ({
    setShowConfirmModal,
    submittingLoader,
    setSubmittingLoader,
    confirmMessage,
    id,
    onDelete,
}: any) => {
    const handleDeleteTransaction = async (itemId: string) => {
        if (onDelete) {
            await onDelete(itemId);
            return;
        }
        setSubmittingLoader(true);
        try {
            await axios.delete(`/api/transaction/delete/${itemId}`);
            setSubmittingLoader(false);
            setShowConfirmModal('');
        } catch (err) {
            console.error(err);
            setSubmittingLoader(false);
        }
    };

    return (
        <Modal onClose={() => setShowConfirmModal('')}>
            <h2 className="text-lg font-semibold mb-4 text-slate-800">{confirmMessage}</h2>
            <div className="flex justify-start gap-3">
                <button
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-xl transition-colors shadow-xs"
                    onClick={() => handleDeleteTransaction(id)}
                >
                    Yes, Delete
                </button>

                <button
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors"
                    onClick={() => setShowConfirmModal('')}
                >
                    Cancel
                </button>
            </div>

            {submittingLoader ? <LottieLoader className="w-20 h-20 text-black" /> : null}
        </Modal>
    );
};

export default ConfirmModal;
