import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import agsLogo from '../assets/images/ags-logo.png';
import toast from 'react-hot-toast'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/login', { email, password });
      const token = res.data.data.token;
      const decoded = jwtDecode(token);
      const role = decoded.role || decoded.userRole || '';
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      navigate('/products');
    } catch (error) {
      let errorMsg = '';

      if (error.response?.data?.error) {
        if (typeof error.response.data.error === 'string') {
          errorMsg = error.response.data.error;
        } else if (typeof error.response.data.error === 'object') {
          errorMsg = Object.values(error.response.data.error)
            .flat()
            .join('\n');
        }
      } else {
        errorMsg = error.message;
      }

      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="xl:w-[700px] px-10 py-6 rounded-3xl xl:shadow-2xl bg-white">
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 rounded-full border-4 bg-[#033149] shadow-md flex items-center justify-center">
            <img
              src={agsLogo}
              alt="Logo"
              className="w-28 h-28 rounded-full object-cover"
            />
          </div>
        </div>

        <h1 className="text-center text-3xl font-bold mt-2 mb-2">Login</h1>

        <div className="flex justify-center mt-4">
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
            <input
              type="text"
              required
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="py-3 px-5 mb-4 rounded-md bg-white border-2 border-zinc-200 md:w-[500px] w-[300px] focus:outline-none focus:border-2 focus:border-[#033149]"
              placeholder="Enter your email"
            />

            <input
              type="password"
              required
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="py-3 px-5 mb-4 rounded-md bg-white border-2 border-zinc-200 md:w-[500px] w-[300px] focus:outline-none focus:border-2 focus:border-[#033149]"
              placeholder="Enter your password"
            />

            <div className="flex justify-end md:w-[500px] w-[300px] mb-4 text-sm">
              <span className="mr-1">Don't have an account?</span>
              <a href="/register" className="text-blue-700 text-sm">
                Register here
              </a>
            </div>

            <button
              type="submit"
              className="py-3 bg-[#033149] text-white md:w-[500px] w-[300px] rounded-md font-bold"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
