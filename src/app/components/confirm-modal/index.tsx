
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import Modal from '../Modal'
import { Player } from '@lottiefiles/react-lottie-player'
import loadingAnimation from '@/assets/animation-loading.json'
import axios from 'axios'
import { TRANSACTION_TYPE, Transaction } from '@/archetypes/Transaction'
import MultiSelectDropdown from '../multiselect'


const ConfirmModal = ({ setShowConfirmModal, submittingLoader, setSubmittingLoader, confirmMessage, id }: any) => {



    const handleDeleteTransaction = async (id: string) => {
        setSubmittingLoader(true);
        try {
            axios.delete(`/api/transaction/delete/${id}`).then(() => {
                setSubmittingLoader(false);
                setShowConfirmModal('');
            })

        } catch (err) {
            console.log(err)
        }
    }


    return (
        <Modal onClose={() => setShowConfirmModal('')}>
            <h2 className="text-xl font-semibold mb-4">{confirmMessage}</h2>
            <div className='w-1/2 flex justify-start'>
                <button 
                className='border p-2 w-20 rounded-lg hover:bg-gray-200'
                onClick={() => handleDeleteTransaction(id)}>Yes</button>

                <button 
                className='border p-2 w-20 ml-2 rounded-lg hover:bg-gray-200'
                onClick={() => setShowConfirmModal('')}>No</button>
            </div>


            {
                submittingLoader ?

                    <Player src={loadingAnimation}
                        loop
                        autoplay
                        className='w-20 h-20 text-black'
                    /> : null
            }
        </Modal>
    )
}

export default ConfirmModal