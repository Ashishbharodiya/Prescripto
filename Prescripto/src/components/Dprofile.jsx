import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { DoctorDetailAction } from '../Redux/Action/UseAction';
import Swal from 'sweetalert2';

function Dprofile() {
    const [cookies, setCookie, removeCookie] = useCookies(['Dtoken']);
    const Dtoken = { headers: { Authorization: `Bearer ${cookies?.Dtoken}` } };

    console.log(Dtoken);
    
    const dispatch = useDispatch();
    const state = useSelector((state) => state);

    useEffect(() => {
        if (cookies?.Dtoken) {
          dispatch(DoctorDetailAction(Dtoken)); 
        }
    }, [cookies?.Dtoken, dispatch]);

    useEffect(() => {
        if (state.userDetail?.GetUserDetail?.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'No Profile Data',
                text: 'Failed to load doctor profile data. Please try again later.',
            });
        } else if (state.userDetail?.GetUserDetail) {
            Swal.fire({
                icon: 'success',
                title: 'Profile Loaded',
                text: 'Your profile details have been successfully loaded.',
            });
        }
    }, [state.userDetail]);

    return (
        <div className="bg-gray-900 text-white min-h-screen p-7 overflow-auto w-full h-full ">
            <div className=" max-w-full bg-gray-800 rounded-lg shadow-lg p-8">
                <h5 className="text-2xl font-bold text-center mb-6 text-indigo-500">Profile</h5>
                
                {state.userDetail?.GetUserDetail?.map((userData, i) => {
                    return (
                        i === 0 && (
                            <div key={userData.id} className="space-y-6 overflow-auto">
                                <div className="flex justify-center">
                                    <img
                                        src={`https://prescripto-66h4.onrender.com${state.userDetail?.GetUserDetail?.[0]?.image}`}
                                        alt="User Profile"
                                        className="object-cover rounded-full w-[270px] h-[280px] transition-transform duration-300 hover:scale-110"
                                    />
                                </div>
                                
                                <div className="text-center">
                                    <p className="text-2xl font-semibold">{userData.userName}</p>
                                    <p className="text-lg text-gray-400">{userData.firstName} {userData.lastName}</p>
                                </div>

                                <hr className="border-gray-600" />

                                <div>
                                    <p className="text-xl font-semibold mb-3 text-indigo-400">Contact Information</p>
                                    <div className="space-y-3">
                                        <div className="flex space-x-3 hover:bg-gray-700 p-2 rounded-md transition-all duration-200">
                                            <p className="text-gray-400">Name:</p>
                                            <p>{userData.name}</p>
                                        </div>

                                        <div className="flex space-x-3 hover:bg-gray-700 p-2 rounded-md transition-all duration-200">
                                            <p className="text-gray-400">Email:</p>
                                            <p>{userData.email}</p>
                                        </div>

                                        <div className="flex space-x-3 hover:bg-gray-700 p-2 rounded-md transition-all duration-200">
                                            <p className="text-gray-400">Contact:</p>
                                            <p>{userData.contactNumber}</p>
                                        </div>

                                        <div className="flex space-x-3 hover:bg-gray-700 p-2 rounded-md transition-all duration-200">
                                            <p className="text-gray-400">Address:</p>
                                            <p>{userData.address}</p>
                                        </div>

                                    </div>
                                </div>

                                <hr className="border-gray-600" />

                                <div>
                                    <p className="text-xl font-semibold mb-3 text-indigo-400">Basic Information</p>
                                    <div className="space-y-3">

                                        <div className="flex space-x-3 hover:bg-gray-700 p-2 rounded-md transition-all duration-200">
                                            <p className="text-gray-400">Specialization:</p>
                                            <p>{userData.specialization}</p>
                                        </div>

                                        <div className="flex space-x-3 hover:bg-gray-700 p-2 rounded-md transition-all duration-200">
                                            <p className="text-gray-400">Gender:</p>
                                            <p>{userData.gender}</p>
                                        </div>

                                        <div className="flex space-x-3 hover:bg-gray-700 p-2 rounded-md transition-all duration-200">
                                            <p className="text-gray-400">Degree:</p>
                                            <p>{userData.degree}</p>
                                        </div>

                                        <div className="flex space-x-3 hover:bg-gray-700 p-2 rounded-md transition-all duration-200">
                                            <p className="text-gray-400">Experience:</p>
                                            <p>{userData.experience}</p>
                                        </div>

                                        <div className="flex space-x-3 hover:bg-gray-700 p-2 rounded-md transition-all duration-200">
                                            <p className="text-gray-400">About:</p>
                                            <p>{userData.about}</p>
                                        </div>

                                    </div>
                                </div>

                                <hr className="border-gray-600" />

                                <div>
                                    <p className="text-xl font-semibold mb-3 text-indigo-400">Availability</p>
                                    <div className="space-y-3">
                                        <div className="flex space-x-3 hover:bg-gray-700 p-2 rounded-md transition-all duration-200">
                                            <p className="text-gray-400">Available:</p>
                                            <p>{userData.available ? 'Yes' : 'No'}</p>
                                        </div>

                                        <div className="flex space-x-3 hover:bg-gray-700 p-2 rounded-md transition-all duration-200">
                                            <p className="text-gray-400">Fees:</p>
                                            <p>{userData.fees}</p>
                                        </div>

                                        <div className="flex space-x-3 hover:bg-gray-700 p-2 rounded-md transition-all duration-200">
                                            <p className="text-gray-400">Availability Time:</p>
                                            <p>{userData.availability?.time}</p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )
                    );
                })}
            </div>
        </div>
    )
}

export default Dprofile;
