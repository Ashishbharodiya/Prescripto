import axios from 'axios';
import React, { useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function AddDoctor() {
    let [hobbies, setHobbies] = useState([]);
    const [obj, setObj] = useState({});
    const [blank, setblank] = useState({});
    const [loading, setLoading] = useState(false); // Track loading state
    const navigate = useNavigate();

    const [cookies, setCookie, removeCookie] = useCookies(['Atoken']);
    const Atoken = { headers: { Authorization: `Bearer ${cookies?.Atoken}` } };

    const SignupData = (e) => {
        if (e.target.name === "hobbies") {
            if (e.target.checked) {
                hobbies.push(e.target.value);
                setHobbies([...hobbies]);
                obj.hobbies = hobbies;
                console.log(hobbies);
            }
            else {
                hobbies = obj.hobbies.filter((x) => x !== e.target.value);
                setHobbies([...hobbies]);
                obj.hobbies = hobbies;
            }
        }
        else if (e.target.name === 'profileImage') {
            obj.profileImage = e.target.files[0];
        } else {
            obj[e.target.name] = e.target.value;
            blank[e.target.name] = "";
        }
        setObj({ ...obj });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setblank({ ...blank });

        const formData = new FormData();
        formData.append('name', obj.name);
        formData.append('email', obj.email);
        formData.append('password', obj.password);
        formData.append('specialization', obj.specialization);
        formData.append('contactNumber', obj.contactNumber);
        formData.append('address', obj.address);
        formData.append('gender', obj.gender);
        formData.append('degree', obj.degree);
        formData.append('experience', obj.experience);
        formData.append('about', obj.about);
        formData.append('fees', obj.fees);
        formData.append('availability[days]', JSON.stringify(hobbies));
        formData.append('availability[time]', obj.availabilityTime);
        formData.append('image', obj.profileImage);

        // Show SweetAlert loading
        Swal.fire({
            title: 'Submitting...',
            text: 'Please wait while we add the doctor.',
            imageUrl: 'https://i.gifer.com/ZZ5H.gif', // Optionally, add a loading spinner image
            showConfirmButton: false,
            allowOutsideClick: false,
            willOpen: () => {
                setLoading(true); // Set loading to true when SweetAlert is shown
            }
        });

        try {
            // Making the API call
            const response = await axios.post('https://prescripto-66h4.onrender.com/api/admin/add-doctor', formData, Atoken);

            if (response.data.success) {
                console.log('Registration successful:', response.data);
                Swal.fire({
                    title: 'Registration Successful!',
                    text: 'You have been registered successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'bg-gray-800 text-gray-100',
                        confirmButton: 'bg-blue-600 text-white hover:bg-blue-700'
                    }
                });
                setObj({});
                setObj({ ...blank });
                setLoading(false); // Set loading to false after success
            } else {
                throw new Error('Something went wrong');
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an issue with your registration. Please try again later.',
                icon: 'error',
                confirmButtonText: 'Try Again',
                customClass: {
                    popup: 'bg-gray-800 text-gray-100',
                    confirmButton: 'bg-red-600 text-white hover:bg-red-700'
                }
            });
            setLoading(false); // Set loading to false after failure
        }
    };

    return (
        <>
            <form action="" onSubmit={handleSubmit} className="space-y-6 p-6 bg-gray-800 shadow-md rounded-lg" w-full h-full autoComplete='off'>
                <p className="text-2xl text-center font-semibold text-gray-100 transition-transform transform hover:scale-1 hover:text-blue-400 ">
                    Add Doctor
                </p>
                {/* Form content */}
                <div className="flex flex-col hover:text-blue-400">
                    <div className="mb-4">
                        <label htmlFor="profileImage" className="cursor-pointer">
                            {obj.profileImage && (
                                <img src={URL.createObjectURL(obj.profileImage)} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                            )}
                        </label>
                        <input
                            type="file"
                            name="profileImage"
                            id="profileImage"
                            onChange={SignupData}
                            required
                            className="mt-2 text-gray-100"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-gray-100 hover:text-blue-400">
                    {/* Form fields */}
                    <div className="space-y-4">
                        <div className='hover:text-blue-400'>
                            <label className="block text-sm font-medium text-gray-200 hover:text-blue-400">Name</label>
                            <input
                                type="text"
                                name="name"
                                onChange={SignupData}
                                value={obj.name}
                                required
                                className="w-full p-3 border border-gray-600 bg-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {/* Other form fields here */}
                    </div>

                    <div className="space-y-4">
                        {/* More form fields */}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 mt-4 bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700 transition duration-300"
                    disabled={loading} // Disable the button when loading is true
                >
                    {loading ? 'Adding Doctor...' : 'Add Doctor'}
                </button>
            </form>
        </>
    );
}

export default AddDoctor;
