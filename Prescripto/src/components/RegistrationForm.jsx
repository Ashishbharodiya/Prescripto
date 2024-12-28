import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { FaUser, FaEnvelope, FaPhone, FaMale, FaFemale, FaUserCircle, FaKey, FaBirthdayCake } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { GiConfirmed } from 'react-icons/gi';

function RegistrationForm() {
  const [obj, setObj] = useState({});
  const [blank, setBlank] = useState({});
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const SignupData = (e) => {
    if (e.target.name === 'userImage') {
      obj.userImage = e.target.files[0];
    } else {
      obj[e.target.name] = e.target.value;
      blank[e.target.name] = "";
    }
    setObj({ ...obj });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBlank({});

    if (obj.password !== obj.confirmpassword) {
      toast.error('Passwords do not match');
      return;
    }

    Swal.fire({
      title: 'Registering...',
      text: 'Please wait while we process your registration.',
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
      showConfirmButton: false,
    });

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('userName', obj.userName);
    formDataToSubmit.append('firstName', obj.firstName);
    formDataToSubmit.append('lastName', obj.lastName);
    formDataToSubmit.append('email', obj.email);
    formDataToSubmit.append('phoneNumber', obj.phoneNumber);
    formDataToSubmit.append('gender', obj.gender);
    formDataToSubmit.append('password', obj.password);
    formDataToSubmit.append('age', obj.age);
    formDataToSubmit.append('address', obj.address);
    formDataToSubmit.append('confirmpassword', obj.confirmpassword);
    formDataToSubmit.append('image', obj.userImage);

    try {
      setLoading(true); 
      const response = await axios.post('https://prescripto-66h4.onrender.com/api/user/registration', formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Registration successful:', response.data);
      toast.success(response.data.message);

      Swal.fire({
        title: 'Success!',
        text: response.data.message,
        icon: 'success',
        confirmButtonColor: '#4CAF50',
      });

      navigate(`/Login`);
      
      setObj({
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        gender: '',
        password: '',
        confirmpassword: '',
        age: '',
        address: '',
        userImage: null,
      });

    } catch (error) {
      console.error(error);
      
      const errorMessage = error.response?.data?.message || 'Something went wrong!';
      toast.error(errorMessage);

      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#f44336',
      });
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-2xl w-full p-6 shadow-lg rounded-lg bg-gray-800">
        <h2 className="text-2xl font-semibold text-center mb-6 text-white">Create Your Account</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-4">
            <label htmlFor="userName" className="block text-sm font-medium text-gray-300">
              <FaUser className="inline mr-2 text-blue-500" /> Username:
            </label>
            <input
              type="text"
              name="userName"
              id="userName"
              value={obj.userName}
              onChange={SignupData}
              placeholder="Enter your username"
              required
              className="mt-2 p-2 w-full border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-700"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
              <FaUserCircle className="inline mr-2 text-blue-500" /> First Name:
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              onChange={SignupData}
              value={obj.firstName}
              placeholder="Enter your first name"
              required
              className="mt-2 p-2 w-full border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-700"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
              <FaUserCircle className="inline mr-2 text-blue-500" /> Last Name:
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              onChange={SignupData}
              value={obj.lastName}
              placeholder="Enter your last name"
              required
              className="mt-2 p-2 w-full border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-700"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              <FaEnvelope className="inline mr-2 text-blue-500" /> Email:
            </label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={SignupData}
              value={obj.email}
              placeholder="Enter your email"
              required
              className="mt-2 p-2 w-full border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-700"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300">
              <FaPhone className="inline mr-2 text-blue-500" /> Phone Number:
            </label>
            <input
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              onChange={SignupData}
              value={obj.phoneNumber}
              placeholder="Enter your phone number"
              required
              className="mt-2 p-2 w-full border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-700"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-300">
              <GiConfirmed className="inline mr-2 text-blue-500" /> Gender:
            </label>
            <select
              name="gender"
              id="gender"
              value={obj.gender || ''}
              onChange={SignupData}
              required
              className="mt-2 p-2 w-full border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-700"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              <FaKey className="inline mr-2 text-blue-500" /> Password:
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={obj.password}
              onChange={SignupData}
              placeholder="Enter your password"
              required
              className="mt-2 p-2 w-full border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-700"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmpassword" className="block text-sm font-medium text-gray-300">
              <FaKey className="inline mr-2 text-blue-500" /> Confirm Password:
            </label>
            <input
              type="password"
              name="confirmpassword"
              id="confirmpassword"
              onChange={SignupData}
              value={obj.confirmpassword}
              placeholder="Confirm your password"
              required
              className="mt-2 p-2 w-full border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-700"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="age" className="block text-sm font-medium text-gray-300">
              <FaBirthdayCake className="inline mr-2 text-blue-500" /> Age:
            </label>
            <input
              type="number"
              name="age"
              id="age"
              value={obj.age}
              onChange={SignupData}
              placeholder="Enter your age"
              required
              className="mt-2 p-2 w-full border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-700"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-300">
              <MdLocationOn className="inline mr-2 text-blue-500" /> Address:
            </label>
            <input
              type="text"
              name="address"
              id="address"
              value={obj.address}
              onChange={SignupData}
              placeholder="Enter your address"
              required
              className="mt-2 p-2 w-full border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-700"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="userImage" className="block text-sm font-medium text-gray-300">
              <FaUserCircle className="inline mr-2 text-blue-500" /> Profile Picture:
            </label>
            <input
              type="file"
              name="userImage"
              id="userImage"
              onChange={SignupData}
              required
              className="mt-2 p-2 w-full border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-700"
            />
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>

        <p className="text-center mt-4 text-sm text-gray-300">
          Already have an account?{' '}
          <button className="text-blue-500">
            <a href="/Login">Login</a>
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegistrationForm;
