import axios from 'axios';
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { GetloginAction } from '../Redux/Action/AdminAction';

function ARegistrationForm() {
  const [cookies, setCookie, removeCookie] = useCookies(['Atoken']);
  const Atoken = { headers: { Authorization: `Bearer ${cookies?.Atoken}` } };

  const dispatch = useDispatch();
  const [obj, setObj] = useState({
    name: '',
    email: '',
    password: ''
  });

  const SignupData = (e) => {
    setObj({
      ...obj,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await dispatch(GetloginAction(obj, Atoken));
      
      Swal.fire({
        title: 'Success!',
        text: 'Registration successful!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4CAF50',  
      });

      setObj({ name: '', email: '', password: '' });

    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong!',
        icon: 'error',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#F44336',  
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center">
      <div className="max-w-lg w-full p-6 shadow-lg rounded-lg bg-gray-800">
        <h2 className="text-2xl font-semibold text-center mb-6 text-white">
          Admin Account Registration
        </h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Name:
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={obj.name}
              onChange={SignupData}
              placeholder="Enter your name"
              required
              className="mt-2 p-2 w-full border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white bg-gray-700"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email:
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={obj.email}
              onChange={SignupData}
              placeholder="Enter your email"
              required
              className="mt-2 p-2 w-full border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white bg-gray-700"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password:
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={obj.password}
              onChange={SignupData}
              placeholder="Enter your password"
              required
              className="mt-2 p-2 w-full border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white bg-gray-700"
            />
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ARegistrationForm;
