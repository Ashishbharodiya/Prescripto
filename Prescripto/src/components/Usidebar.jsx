import React from 'react'
import { useCookies } from 'react-cookie';
import { FaCalendarAlt, FaHome, FaSignOutAlt, FaUsers } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { MdAdminPanelSettings } from "react-icons/md";
import Swal from 'sweetalert2';

function Usidebar() {

    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const token = { headers: { Authorization: `Bearer ${cookies?.token}` } };

    const navigate = useNavigate();

    const logout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will be logged out!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, logout!',
            cancelButtonText: 'No, cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                removeCookie('token'); 
                navigate('/login'); 
                Swal.fire('Logged Out!', 'You have been logged out.', 'success');
            }
        });
    };

    return (
       <div className="min-h-screen border-r">
    {token && (
        <ul className="text-[#515151] mt-5 dark:bg-gray-800">
            <NavLink
                to="/user/dashboard"
                className={({ isActive }) =>
                    `flex items-center gap-3 py-3.5 px-3 sm:px-6 md:px-9 lg:px-10 xl:px-12 cursor-pointer dark:bg-gray-800 ${
                        isActive ? 'bg-gray-800 border-r-4 border-primary' : ''
                    }`
                }
            >
                <FaHome className="min-w-4 text-white" />
                <p className="hidden sm:block text-white">Dashboard</p>
            </NavLink>

            <NavLink
                to="/doctors"
                className={({ isActive }) =>
                    `flex items-center gap-3 py-3.5 px-3 sm:px-6 md:px-9 lg:px-10 xl:px-12 cursor-pointer ${
                        isActive ? 'bg-gray-800 border-r-4 border-primary' : ''
                    }`
                }
            >
                <FaCalendarAlt className="min-w-4 text-white" />
                <p className="hidden sm:block text-white">Doctors</p>
            </NavLink>

            <NavLink
                to="/my-appointments"
                className={({ isActive }) =>
                    `flex items-center gap-3 py-3.5 px-3 sm:px-6 md:px-9 lg:px-10 xl:px-12 cursor-pointer ${
                        isActive ? 'bg-gray-800 border-r-4 border-primary' : ''
                    }`
                }
            >
                <MdAdminPanelSettings className="min-w-4 text-white" />
                <p className="hidden sm:block text-white">MyAppointments</p>
            </NavLink>

            <NavLink
                to="/profile"
                className={({ isActive }) =>
                    `flex items-center gap-3 py-3.5 px-3 sm:px-6 md:px-9 lg:px-10 xl:px-12 cursor-pointer ${
                        isActive ? 'bg-gray-800 border-r-4 border-primary' : ''
                    }`
                }
            >
                <FaUsers className="min-w-4 text-white" />
                <p className="hidden sm:block text-white">Profile</p>
            </NavLink>

            <button
                className="flex items-center gap-3 py-3.5 px-3 sm:px-6 md:px-9 lg:px-10 xl:px-12 cursor-pointer"
                onClick={() => logout()}
            >
                <FaSignOutAlt className="min-w-4 text-white" />
                <p className="hidden sm:block text-white">Logout</p>
            </button>
        </ul>
    )}
</div>

    );
}

export default Usidebar;
