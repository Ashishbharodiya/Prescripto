import React from 'react'
import { useCookies } from 'react-cookie';
import { FaCalendarAlt, FaHome, FaSignOutAlt, FaUsers } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Dsidebar() {

    const [cookies, setCookie, removeCookie] = useCookies(['Dtoken']);
    const Dtoken = { headers: { Authorization: `Bearer ${cookies?.Dtoken}` } };

    const navigate = useNavigate();

    const handleLogout = () => {
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
                removeCookie('Dtoken');
                navigate('/doctor/login'); 
                Swal.fire('Logged out!', 'You have been logged out.', 'success');
            }
        });
    };

    return (
        <div className="min-h-screen border-r">
            {Dtoken && (
                <ul className="text-[#515151] mt-5 dark:bg-gray-800 ">
                    <NavLink
                        to="/doctor-dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer dark:bg-gray-800  ${
                                isActive ? 'bg-gray-800 border-r-4 border-primary' : ''
                            }`
                        }
                    >
                        <FaHome className="min-w-4 text-white" />
                        <p className="hidden md:block text-white">Dashboard</p>
                    </NavLink>

                    <NavLink
                        to="/doctor-appointments"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                                isActive ? 'bg-gray-800 border-r-4 border-primary' : ''
                            }`
                        }
                    >
                        <FaCalendarAlt className="min-w-4 text-white" />
                        <p className="hidden md:block text-white">Appointments</p>
                    </NavLink>

                    <NavLink
                        to="/doctor-profile"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                                isActive ? 'bg-gray-800 border-r-4 border-primary' : ''
                            }`
                        }
                    >
                        <FaUsers className="min-w-4 text-white" />
                        <p className="hidden md:block text-white">Profile</p>
                    </NavLink>

                    <button
                        className="flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt className="min-w-4 text-white" />
                        <p className="hidden md:block text-white">Logout</p>
                    </button>
                </ul>
            )}
        </div>
    );
}

export default Dsidebar;
