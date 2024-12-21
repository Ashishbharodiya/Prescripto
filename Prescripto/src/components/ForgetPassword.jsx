import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const ForgetPassword = () => {
  const { id, resetpasswordToken } = useParams();  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Passwords do not match',
        text: 'Please make sure both passwords are the same.',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to reset your password?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reset it!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) {
      return; 
    }

    try {
      const response = await axios.post('https://prescripto-62tm.onrender.com/api/user/forgetPassword', {
        id,
        resetpasswordToken,  
        newPassword,
        confirmPassword,
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'error',
          title: 'Reset Failed',
          text: response.data.message || 'There was an error resetting your password.',
        });
      } else {

        Swal.fire({
          icon: 'success',
          title: 'Password Reset Successful',
          text: 'Your password has been reset successfully.',
        });

        setFormSubmitted(true); 
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'An error occurred',
        text: error.response ? error.response.data.message : 'Network error. Please try again later.',
      });
    }
  };

  if (formSubmitted) {
    return    <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center animate-fadeIn">
      <div className="text-blue-400 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">Password Successful</h2>
      <p className="text-lg text-gray-300 mb-6">
        Your password has been successfully reset. You can now log in using your new password.
      </p>
      <p className="text-sm text-gray-400">Thank you for choosing us!</p>
  
      <div className="mt-6">
        <button  className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 transition duration-300">
          <a href='/'> Go to Login </a>
        </button>
      </div>
    </div>
  </div>
  

  }

  return (
   
<div class="flex items-center justify-center min-h-screen bg-gray-900">
  <div class="max-w-md w-full p-6 bg-gray-800 rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-center text-white mb-6">Reset Password</h2>
    <form onSubmit={handleSubmit} class="space-y-4" autoComplete='off'>
      <div>
        <label for="newPassword" class="block text-sm font-medium text-gray-300">New Password:</label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          class="w-full px-4 py-2 mt-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>
      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-300">Confirm Password:</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          class="w-full px-4 py-2 mt-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        class="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Reset Password
      </button>
    </form>
  </div>
</div>


  

  );
};

export default ForgetPassword;
