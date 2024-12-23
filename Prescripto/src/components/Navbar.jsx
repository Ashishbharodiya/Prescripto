import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import logo from '../images/prescription-removebg-preview (1).png';
import { useCookies } from 'react-cookie';
import { DoctorDetailAction, UserDetailAction } from '../Redux/Action/UseAction';
import Swal from 'sweetalert2';

const Navbar = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const token = { headers: { Authorization: `Bearer ${cookies?.token}` } };
  
    const dispatch = useDispatch();
    const state = useSelector((state) => state);
  
    useEffect(() => {
      if (cookies?.token) {
        dispatch(UserDetailAction(token)); 
      }
    }, [cookies?.token, dispatch]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const logout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, logout!',
            cancelButtonText: 'No, cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                removeCookie('token'); 
                navigate('/admin/login'); 
                Swal.fire('Logged Out!', 'You have been logged out.', 'success');
            }
        });
    };

    const Dlogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out as Doctor!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, logout!',
            cancelButtonText: 'No, cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                removeCookie('token');
                navigate('/doctor/login');
                Swal.fire('Logged Out!', 'You have been logged out as Doctor.', 'success');
            }
        });
    };
    
    return (
        <div className="flex items-center justify-between text-sm py-1 bg-gray-900 dark:bg-gray-800 border-b border-b-[#ADADAD]">
            <div className="flex items-center justify-between pe-2 ">
                <img className="cursor-pointer w-[90px]" src={logo} alt="Logo" />
                <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-white'>User</p>
            </div>

            <div className="relative inline-block text-left ps-10">
                <div>
                    <button
                        onClick={toggleMenu}
                        type="button"
                        className="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm"
                        aria-expanded={isMenuOpen}
                        aria-haspopup="true"
                    >
                        <img
                            src={`https://prescripto-3-ry9r.onrender.com${state.userDetail?.GetUserDetail?.[0]?.image}`}
                            alt="User Profile"
                            className="w-14 h-14 rounded-full"
                        />
                    </button>
                </div>

                {isMenuOpen && (
                    <div
                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gray-900 dark:bg-gray-800 shadow-lg ring-1 ring-black/5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                        tabIndex="-1"
                    >
                        <div className="py-1" role="none">
                            <a href="/doctor-profile" className="block px-4 py-2 text-sm text-gray-700 text-white" role="menuitem" tabIndex="-1">
                                Profile
                            </a>
                            <a onClick={() => logout()} className="block px-4 py-2 text-sm text-gray-700 text-white" role="menuitem" tabIndex="-1">
                                Admin Logout
                            </a>
                            <a onClick={() => Dlogout()} className="block px-4 py-2 text-sm text-gray-700 text-white" role="menuitem" tabIndex="-1">
                                Doctor Logout
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
