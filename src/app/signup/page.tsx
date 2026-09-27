'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import LottieLoader from '../components/common/LottieLoader';
import { User } from '@/archetypes/Auth';
import Image from "next/image";

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User>({ username: '', email: '', password: '' });
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user.email.length > 0 && user.password!.length > 0 && user.username!.length > 0) {
      setSubmitDisabled(false);
    } else {
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
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg border border-slate-100">
        <div className="flex justify-center">
          <Image
            className="rounded-lg"
            src="/logo.jpeg"
            alt="Spendlizer Logo"
            width={180}
            height={37}
            priority
          />
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-800">Sign Up</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={user.username}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 mt-1 text-slate-900 border border-slate-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={user.email}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 mt-1 text-slate-900 border border-slate-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={user.password}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 mt-1 text-slate-900 border border-slate-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-2.5 text-white bg-slate-900 rounded-xl font-medium hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              submitDisabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={submitDisabled}
          >
            Sign Up
          </button>
        </form>
        <div className="text-center">
          <Link href={'/login'} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            Already have an Account? Login instead!
          </Link>
        </div>

        {loading ? <LottieLoader className="w-20 h-20 text-black mx-auto" /> : null}
      </div>
    </div>
  );
};

export default SignupPage;
