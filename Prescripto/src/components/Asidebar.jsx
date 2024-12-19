import React from 'react'
import { useCookies } from 'react-cookie';
import { FaCalendarAlt, FaHome, FaSignOutAlt, FaUserMd, FaUsers } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { MdAdminPanelSettings } from "react-icons/md";
import Swal from 'sweetalert2';

function Asidebar() {

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
            cancelButtonText: 'Cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                removeCookie('Atoken');
                navigate('/admin/login'); 
                Swal.fire('Logged out!', 'You have been logged out successfully.', 'success');
            }
        });
    };

    return (
        <div className="min-h-screen border-r">
            {Atoken && (
                <ul className="text-[#515151] mt-5 dark:bg-gray-800">
                    <NavLink
                        to="/admin/dashboard"
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
                        to="/admin/all-appointments"
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
                        to="/admin/doctors"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                                isActive ? 'bg-gray-800 border-r-4 border-primary' : ''
                            }`
                        }
                    >
                        <FaUserMd className="min-w-4 text-white" />
                        <p className="hidden md:block text-white">Add Doctor</p>
                    </NavLink>

                    <NavLink
                        to="/admin/register"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                                isActive ? 'bg-gray-800 border-r-4 border-primary' : ''
                            }`
                        }
                    >
                        <MdAdminPanelSettings className="min-w-4 text-white" />
                        <p className="hidden md:block text-white">Add Admin</p>
                    </NavLink>

                    <NavLink
                        to="/admin/all-doctors"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                                isActive ? 'bg-gray-800 border-r-4 border-primary' : ''
                            }`
                        }
                    >
                        <FaUsers className="min-w-4 text-white" />
                        <p className="hidden md:block text-white">Doctors List</p>
                    </NavLink>

                    <button
                        className="flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer"
                        onClick={() => logout()}
                    >
                        <FaSignOutAlt className="min-w-4 text-white" />
                        <p className="hidden md:block text-white">Logout</p>
                    </button>
                </ul>
            )}
        </div>
    );
}

export default Asidebar;
