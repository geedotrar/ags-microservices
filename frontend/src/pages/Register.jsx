import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import agsLogo from '../assets/images/ags-logo.png';
import ModalConfirmation from '../components/ModalConfirmation';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  const handleRegisterClick = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmRegister = async () => {
    try {
      await axios.post('http://localhost:8000/api/register', {
        name,
        email,
        password,
      });

      toast.success('Registration successful. Please login.');
      navigate('/');
    } catch (error) {
      const errors = error.response?.data?.error;
      const combinedErrors =
        errors && typeof errors === 'object'
          ? Object.values(errors).flat().join('\n')
          : error.message;

      toast.error(combinedErrors);
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

        <h1 className="text-center text-3xl font-bold mt-2 mb-2">Register</h1>

        <div className="flex justify-center mt-4">
          <form className="w-full flex flex-col items-center">
            <input
              type="text"
              required
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="py-3 px-5 mb-4 rounded-md bg-white border-2 border-zinc-200 md:w-[500px] w-[300px] focus:outline-none focus:border-[#033149]"
              placeholder="Enter your name"
            />
            <input
              type="text"
              required
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="py-3 px-5 mb-4 rounded-md bg-white border-2 border-zinc-200 md:w-[500px] w-[300px] focus:outline-none focus:border-[#033149]"
              placeholder="Enter your email"
            />
            <input
              type="password"
              required
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="py-3 px-5 mb-4 rounded-md bg-white border-2 border-zinc-200 md:w-[500px] w-[300px] focus:outline-none focus:border-[#033149]"
              placeholder="Enter your password"
            />
            <div className="flex justify-end md:w-[500px] w-[300px] mb-4 text-sm">
              <span className="mr-1">Already have an account?</span>
              <a href="/" className="text-blue-700 text-sm">
                Login
              </a>
            </div>
            <button
              type="submit"
              onClick={handleRegisterClick}
              className="py-3 bg-[#033149] text-white md:w-[500px] w-[300px] rounded-md font-bold"
            >
              Register
            </button>
          </form>
        </div>
      </div>

      <ModalConfirmation
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={async () => {
          await handleConfirmRegister();
          setShowConfirmModal(false);
        }}
        title="Confirm Registration"
        message={`Are you sure you want to continue register new account?`}
      />
    </div>
  );
}
