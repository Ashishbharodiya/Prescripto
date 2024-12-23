import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { UserDetailAction } from '../Redux/Action/UseAction';
import Swal from 'sweetalert2';

function Profile() {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const token = { headers: { Authorization: `Bearer ${cookies?.token}` } };

  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  useEffect(() => {
    if (cookies?.token) {
      dispatch(UserDetailAction(token));
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'No token found. Please log in to view your profile.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }, [cookies?.token, dispatch]);

  useEffect(() => {
    if (state.userDetail?.GetUserDetail?.length > 0) {
      Swal.fire({
        title: 'Profile Loaded!',
        text: 'Your profile data has been successfully fetched.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    }
    if (state.userDetail?.GetUserDetail?.length === 0) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load your profile. Please try again.',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  }, [state.userDetail]);

  return (
    <div className="bg-gray-900 w-[1200px] text-white min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        <h5 className="text-2xl font-bold text-center mb-6 text-indigo-500">Profile</h5>
        
        {state.userDetail?.GetUserDetail?.map((userData, i) => {
          return (
            i === 0 && (
              <div key={userData.id} className="space-y-6">
                <div className="flex justify-center">
                  <img
                    src={`https://prescripto-3-ry9r.onrender.com${state.userDetail?.GetUserDetail?.[0]?.image}`}
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
                      <p className="text-gray-400">Email:</p>
                      <p>{userData.email}</p>
                    </div>
                    <div className="flex space-x-3 hover:bg-gray-700 p-2 rounded-md transition-all duration-200">
                      <p className="text-gray-400">Phone Number:</p>
                      <p>{userData.phoneNumber}</p>
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
                      <p className="text-gray-400">Gender:</p>
                      <p>{userData.gender}</p>
                    </div>
                    <div className="flex space-x-3 hover:bg-gray-700 p-2 rounded-md transition-all duration-200">
                      <p className="text-gray-400">Age:</p>
                      <p>{userData.age}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
}

export default Profile;
