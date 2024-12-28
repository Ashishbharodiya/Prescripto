import axios from 'axios';
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function DLoginForm() {

    const [Loginobj, setLoginobj] = useState({});
    const [cookies, setCookie, removeCookie] = useCookies(['Dtoken', 'doctor']);
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    const LoginData = (e) => {
        Loginobj[e.target.name] = e.target.value;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setLoading(true); // Set loading to true when the request starts

        try {
            const response = await axios.post('https://prescripto-66h4.onrender.com/api/doctor/login', Loginobj, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.Dtoken) {
                const { Dtoken, data } = response.data;

                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);

                setCookie('Dtoken', Dtoken, { path: '/', expires: expiryDate });
                setCookie('doctor', JSON.stringify(data), { path: '/', expires: expiryDate });

                localStorage.setItem("Dtoken", Dtoken);
                localStorage.setItem("doctor", JSON.stringify(data));

                Swal.fire({
                    title: 'Success!',
                    text: 'Login successful. You are now logged in.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate("/doctor-dashboard");
                });

            } else {
                Swal.fire({
                    title: 'Login Failed!',
                    text: 'Invalid email or password. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'Try Again'
                });
            }

        } catch (error) {
            console.error('Error during login:', error);

            Swal.fire({
                title: 'Error!',
                text: 'An error occurred during login. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false); // Set loading to false after the request completes
        }
    }

    return (
        <div className="login-container flex items-center justify-center min-h-screen w-full h-full bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm z-10">
                <h2 className="text-2xl font-bold text-center mb-6 text-white">Dlogin</h2>
                <form onSubmit={handleSubmit} autoComplete='off'>
                    <div className="mb-4">
                        <label htmlFor="doctor" className="block text-gray-300 font-semibold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="doctor"
                            name="doctor"
                            value={Loginobj.doctor}
                            className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                            onChange={LoginData}
                            placeholder="Enter your email"
                            required
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
                        />
                    </div>

                    <p className="text-sm text-gray-400 mt-2 pb-2">
                        <a className="text-blue-400 hover:underline">
                            Forgot your password?
                        </a>
                    </p>

                    <button
                        type="submit"
                        className={`w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading} // Disable the button while loading
                    >
                        {loading ? 'Logging in...' : 'Login'} {/* Display loading text */}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default DLoginForm;
