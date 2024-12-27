import React, { useState } from 'react';
import logo from '../images/prescription-removebg-preview (1).png';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Dnavbar() {
  const [cookies, setCookie, removeCookie] = useCookies(['Dtoken']);
  const Dtoken = { headers: { Authorization: `Bearer ${cookies?.Dtoken}` } };

  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const logout = () => {
    setLoading(true); // Set loading to true when logout is initiated
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Logout',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        removeCookie('Dtoken'); // Remove the cookie
        navigate('/login'); // Redirect to login page
        Swal.fire('Logged out!', 'You have been logged out.', 'success').then(() => {
          setLoading(false); // Set loading to false after logout operation is complete
        });
      } else {
        setLoading(false); // In case of cancellation, reset loading to false
      }
    });
  };

  return (
    <div className='flex justify-between items-center sm:px-10 py-3 bg-gray-900 dark:bg-gray-800 border-b border-b-[#ADADAD]'>
      <div className='flex items-center gap-2 text-xs'>
        <img onClick={() => navigate('/')} className='cursor-pointer w-[60px]' src={logo} alt="" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-white'>{Dtoken ? 'Admin' : 'Doctor'}</p>
      </div>

      <button
        onClick={() => logout()}
        className={`bg-primary text-white text-sm px-10 py-2 rounded-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={loading} // Disable the button while loading
      >
        {loading ? 'Logging out...' : 'Logout'} {/* Show a loading text */}
      </button>
    </div>
  );
}

export default Dnavbar;
