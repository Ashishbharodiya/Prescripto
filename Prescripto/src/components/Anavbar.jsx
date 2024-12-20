import React from 'react';
import logo from '../images/prescription-removebg-preview (1).png';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Anavbar() {
    const [cookies, setCookie, removeCookie] = useCookies(['Atoken']);
    const Atoken = { headers: { Authorization: `Bearer ${cookies?.Atoken}` } };

    const navigate = useNavigate();

    const logout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to log out!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, log me out!',
            cancelButtonText: 'No, stay logged in',
            reverseButtons: true,
            customClass: {
                container: 'bg-gray-900 text-white',
                title: 'text-white font-semibold',  
                content: 'text-gray-300', 
                confirmButton: 'bg-red-600 hover:bg-red-700 text-white',  
                cancelButton: 'bg-gray-600 hover:bg-gray-700 text-white'  
            }
        }).then((result) => {
            if (result.isConfirmed) {
                removeCookie('Atoken', { path: '/' });

                Swal.fire({
                    title: 'Logged out!',
                    text: 'You have been logged out successfully.',
                    icon: 'success',
                    customClass: {
                        container: 'bg-gray-900 text-white',  
                        title: 'text-white font-semibold',  
                        content: 'text-gray-300',  
                    }
                });

                navigate('/doctor/login');
            } else {
                Swal.fire({
                    title: 'Cancelled',
                    text: 'You are still logged in.',
                    icon: 'info',
                    customClass: {
                        container: 'bg-gray-900 text-white', 
                        title: 'text-white font-semibold',  
                        content: 'text-gray-300', 
                    }
                });
            }
        });
    };

    return (
        <div className='flex justify-between items-center px-6 py-4 bg-gray-900 dark:bg-gray-800 border-b border-b-[#ADADAD]'>
            <div className='flex items-center gap-2 text-xs'>
                <img 
                    onClick={() => navigate('/')} 
                    className='cursor-pointer w-[60px]' 
                    src={logo} 
                    alt="Logo" 
                />
                <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-white'>
                    {cookies?.Atoken ? 'Admin' : 'Doctor'}
                </p>
            </div>
            <button 
                onClick={logout} 
                className='bg-primary text-white text-sm px-6 py-2 rounded-full hover:bg-primary-dark transition-all'
            >
                Logout
            </button>
        </div>
    );
}

export default Anavbar;
