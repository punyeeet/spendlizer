import { Player } from '@lottiefiles/react-lottie-player'
import React, { ChangeEvent, FormEvent, memo, useState } from 'react'
import loadingAnimation from '@/assets/animation-loading.json'
import Modal from '../Modal'
import axios from 'axios'


const AddTagComponent = ({ setAddTagModal, submittingLoader, setSubmittingLoader }: any) => {

    const [newTag, setNewTag] = useState({
        color: '',
        tag: ''
    })

    const submitAddTag = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setSubmittingLoader(true);

            const response = await axios.post("api/tags/add", {
                data: {
                    ...newTag
                }
            });

            console.log('Added successfully', response);
        } catch (error: any) {
            console.log("failed", error.message)
        } finally {
            setSubmittingLoader(false);
            setAddTagModal(false);
            setNewTag({
                color: '',
                tag: ''
            })
        }
    }

    const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewTag((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <Modal onClose={() => setAddTagModal(false)}>
            <h2 className="text-xl font-semibold mb-4">Add a new tag</h2>
            <form onSubmit={submitAddTag}>
                <div className="mb-4">
                    <label className="block text-gray-700">Tag Name</label>
                    <input
                        type="text"
                        className="mt-1 block w-full p-2 border rounded-md"
                        onChange={handleTagChange}
                        name='tag'
                    />
                </div>
                <div className="mb-4 flex flex-row  justify-between items-center">
                    <div className='w-3/4'>
                        <label className="block text-gray-700">Color</label>
                        <input
                            type="color"
                            className="mt-1 block w-full p-2 border rounded-md"
                            onChange={handleTagChange}
                            name='color'
                        />
                    </div>
                    <div
                        className='w-10 h-10 border-2 border-black rounded-md ml-2 justify-self-center '
                        style={{ backgroundColor: newTag.color }}
                    >
                    </div>
                </div>

                <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700" type='submit'>
                    Submit
                </button>
            </form>
            {
                submittingLoader ?

                    <Player src={loadingAnimation}
                        loop
                        autoplay
                        className='w-20 h-20'
                    /> : null
            }
        </Modal>
    )
}

export const AddTag = memo(AddTagComponent)