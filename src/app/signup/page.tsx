'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect, } from 'react';
import Link from 'next/link';
import axios from 'axios'
import { useRouter } from 'next/navigation';
import { Player } from '@lottiefiles/react-lottie-player';
import loadingAnimation from '@/assets/animation-loading.json'
import { User } from '@/archetypes/Auth';


const SignupPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User>({ username: '', email: '', password: '' });

  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);



  useEffect(() => {
    if (user.email.length > 0 && user.password!.length > 0 && user.username!.length > 0) {
      setSubmitDisabled(false)
    }else{
      setSubmitDisabled(true);
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(user);
    // Add your signup logic here

    try {
      setLoading(true);
      setSubmitDisabled(true);
      const response = await axios.post('api/users/signup', user);

      console.log("Signup success", response.data);

      router.push("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setSubmitDisabled(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={user.username}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={user.email}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={user.password}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${submitDisabled ? 'cursor-not-allowed' : ''}`}
            disabled={submitDisabled}
          >
            Sign Up
          </button>
        </form>
        <Link href={'/login'} className='align-middle hover:text-blue-500'> Already have an Account? Login instead!</Link>

        {
          loading ? 

          <Player src={loadingAnimation}
            loop
            autoplay
            className='w-20 h-20'
          />: null
        }
      </div>
    </div>
  );
};

export default SignupPage;
