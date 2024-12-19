import React from 'react'
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
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                removeCookie('Atoken', { path: '/' });

                Swal.fire('Logged out!', 'You have been logged out successfully.', 'success');
                navigate('/doctor/login');
            } else {
                Swal.fire('Cancelled', 'You are still logged in.', 'info');
            }
        });
    };

    return (
        <div className='flex justify-between items-center sm:px-10 py-3 bg-gray-900 dark:bg-gray-800 border-b border-b-[#ADADAD]'>
            <div className='flex items-center gap-2 text-xs'>
                <img onClick={() => navigate('/')} className='cursor-pointer w-[60px]' src={logo} alt="Logo" />
                <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-white'>{Atoken ? 'Admin' : 'Doctor'}</p>
            </div>
            <button onClick={() => logout()} className='bg-primary text-white text-sm px-10 py-2 rounded-full'>Logout</button>
        </div>
    )
}

export default Anavbar;
