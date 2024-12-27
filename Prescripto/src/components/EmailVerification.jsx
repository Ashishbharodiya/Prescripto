import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const EmailVerification = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://prescripto-66h4.onrender.com/api/user/verifyEmail', { email });

      if (response.data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Email Sent!',
          text: 'A verification email has been sent to your email address.',
        });

        
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'There was an issue sending the email. Please try again later.',
        });
      }
    } catch (error) {
     
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong. Please try again later.',
      });
    } 
  };

  return (
  
<div className="flex justify-center items-center min-h-screen bg-gray-900">
  <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full sm:w-96">
    <h2 className="text-2xl font-semibold text-center text-white mb-6">Verify Your Email</h2>
    <form onSubmit={handleSubmit} autoComplete='off'>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-300 font-medium mb-2">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleEmailChange}
          required
          placeholder="Enter your email"
          className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button 
        type="submit" 
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        Send Verification Email
      </button>
    </form>
  </div>
</div>



  );
};

export default EmailVerification;
