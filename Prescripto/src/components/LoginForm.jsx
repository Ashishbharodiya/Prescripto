import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [Loginobj, setLoginobj] = useState({});
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();  

  const LoginData = (e) => {
    setLoginobj({ ...Loginobj, [e.target.name]: e.target.value });  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();  

    setLoading(true);
    Swal.fire({
      title: 'Logging in...',
      text: 'Please wait while we process your login.',
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,  
      showConfirmButton: false,  
    });

    try {
      const response = await axios.post('https://prescripto-66h4.onrender.com/api/user/login', Loginobj, {
        headers: {
          'Content-Type': 'application/json', 
        },
      });

      Swal.fire({
        title: 'Login Successful!',
        text: 'Welcome back!',
        icon: 'success',
        confirmButtonColor: "#1D4ED8",
        background: "#1E293B",
        color: "#FFFFFF",
        confirmButtonText: 'Okay',
      });

      const userId = response.data.data._id; 
      navigate(`/verify-otp/${userId}`);

    } catch (error) {
      console.error('Error during login:', error);

      Swal.fire({
        title: 'Login Failed!',
        text: 'Invalid credentials, please try again.',
        icon: 'error',
        confirmButtonColor: "#DC2626",
        background: "#1E293B",
        color: "#FFFFFF",
        confirmButtonText: 'Retry',
      });
    } finally {
      setLoading(false);  
    }
  };

  return (
    <div className="login-container flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm z-10">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Login 
        </h2>
        <form onSubmit={handleSubmit} autoComplete='off'>
          <div className="mb-4">
            <label htmlFor="user" className="block text-gray-300 font-semibold mb-2">
              User  
            </label>
            <input
              type="email"
              id="user"
              name="user"
              value={Loginobj.user}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              onChange={LoginData}
              placeholder="Enter your email"
              required
              disabled={loading}  
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 font-semibold mb-2">
              Password  
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={Loginobj.password}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              onChange={LoginData}
              placeholder="Enter your password"
              required
              disabled={loading}  
            />
          </div>

          <p className="text-sm text-gray-400 mt-2 pb-2">
            <a href="/verifyEmail" className="text-blue-400 hover:underline">
              Forgot your password?
            </a>
          </p>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}  
          >
            {loading ? 'Logging in...' : 'Login'}  
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-400 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
