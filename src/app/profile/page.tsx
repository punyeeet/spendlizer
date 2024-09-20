'use client'
import { User } from "@/archetypes/Auth";
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import Layout from "../components/NavbarWrapper";

export default function ProfilePage({ params }: any) {

    const router = useRouter();

    const [data, setData] = useState<User>({
        email: '',
        username: '',
    })

    useEffect(() => {
        const getUserDetails = async () => {
            const response = await axios.get('/api/users/me')
            setData(response.data.data);
        }

        getUserDetails();
    }, []);

    const handleLogout = async () => {
        try {

            const response = await axios.get('/api/users/logout')

            alert("Logged Out Successfuly");

            router.push('/login');

        } catch (error: any) {
            console.log(error.message);
            alert(error.message);
        }
    }

    return (
        <Layout>
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="md:flex">
                    <div className="md:flex-shrink-0">
                        <img className="h-48 w-full object-cover md:w-48" src={`https://avatar.iran.liara.run/username?username=${data.username || 'user'}`} alt="User Avatar" />
                    </div>
                    <div className="p-8">
                        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">User Profile</div>
                        <h1 className="block mt-1 text-lg leading-tight font-medium text-black">{data.username}</h1>
                        <p className="mt-2 text-gray-500">Email: {data.email}</p>
                        <p className="mt-2 text-gray-500">Welcome to Spendlizer. Your personal money tracking and analysis tool.</p>
                        <button className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
        </Layout>
    )
}