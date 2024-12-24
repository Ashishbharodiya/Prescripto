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
       <div className="flex items-center justify-between text-sm py-1 bg-gray-900 dark:bg-gray-800 border-b border-b-[#ADADAD] border-w-[6000px]">
    <div className="flex items-center justify-between ">
        <img className="cursor-pointer w-[90px] sm:w-[100px] md:w-[110px] lg:w-[120px] xl:w-[130px] 2xl:w-[140px]" src={logo} alt="Logo" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-white text-xs sm:text-sm md:text-base lg:text-lg'>
            User
        </p>
    </div>

    <div className="relative inline-block text-left md:ps-14 lg:ps-16 xl:ps-18 2xl:ps-20">
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
                    className="w-14 h-14 rounded-full sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-22 xl:h-22 2xl:w-24 2xl:h-24"
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
