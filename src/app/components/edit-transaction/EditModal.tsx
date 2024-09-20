
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import Modal from '../Modal'
import { Player } from '@lottiefiles/react-lottie-player'
import loadingAnimation from '@/assets/animation-loading.json'
import axios from 'axios'
import { TRANSACTION_TYPE, Transaction } from '@/archetypes/Transaction'
import MultiSelectDropdown from '../multiselect'
import { formatDate } from '../../util/Generic.util'


const EditModal = ({ setShowEditModal, submittingLoader, setSubmittingLoader, id }: any) => {

    const [tags, setTags] = useState([]);

    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const [addTransaction, setAddTransaction] = useState<Transaction>({
        date: new Date(0),
        amount: 0,
        type: TRANSACTION_TYPE.CREDIT,
        tag: [],
        description: '',
    })

    const submitTransaction = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setSubmittingLoader(true);

            const response = await axios.put(`api/transaction/update/${id}`, {
                data: {
                    ...addTransaction
                }
            });

            console.log('Updated successfully', response);

        } catch (error: any) {
            console.log("failed", error.message)
        } finally {
            setSubmittingLoader(false);
            setShowEditModal('');
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddTransaction((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTagChange = (options: string[]) => {
        setAddTransaction((prev) => ({
            ...prev,
            tag: options
        }));
    }



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
        const fetchTransaction = async () => {
            try {
                const response = await axios.get(`/api/transaction/${id}`); // Adjust the endpoint as necessary

                const fetchedData = response.data.transaction;

                setAddTransaction(fetchedData);
                // console.log([...fetchedData.tag]);
                setSelectedTags([...fetchedData.tag])
            } catch (error) {
                console.error('Error fetching transaction:', error);
            }
        };

        fetchTransaction();
    }, [])


    return (
        <Modal onClose={() => setShowEditModal('')}>
            <h2 className="text-xl font-semibold mb-4">Edit Transaction</h2>
            <form onSubmit={submitTransaction}>
                <div className="mb-4">
                    <label className="block text-gray-700">Date</label>
                    <input
                        type="date"
                        className="mt-1 block w-full p-2 border rounded-md"
                        onChange={handleChange}
                        name='date'
                        // @ts-ignore
                        value={formatDate(addTransaction.date)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Amount</label>
                    <input
                        type="number"
                        className="mt-1 block w-full p-2 border rounded-md"
                        onChange={handleChange}
                        name='amount'
                        value={addTransaction.amount}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <input
                        type="text"
                        className="mt-1 block w-full p-2 border rounded-md"
                        onChange={handleChange}
                        name='description'
                        value={addTransaction.description}
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


                <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700" type='submit'>
                    Update
                </button>
            </form>
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

export default EditModal