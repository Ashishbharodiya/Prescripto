import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Swal from 'sweetalert2';

const DoctorsList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);  // Set loading state to false initially
    const [cookies, setCookie, removeCookie] = useCookies(['Atoken']);
    const Atoken = cookies?.Atoken;

    // Fetch all doctors
    const getAllDoctors = async () => {
        setLoading(true);  // Set loading to true when the fetch starts
        try {
            const { data } = await axios.get('https://prescripto-66h4.onrender.com/api/admin/all-doctors', {
                headers: { Authorization: `Bearer ${Atoken}` },
            });

            if (data.success) {
                setDoctors(data.doctors);
                console.log(data);  
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message || 'Failed to fetch doctors',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while fetching doctors.',
            });
        } finally {
            setLoading(false);  // Set loading to false after the fetch completes
        }
    };

    // Change the availability of a doctor
    const changeAvailability = async (docId) => {
        setLoading(true);  // Start loading
        try {
            const { data } = await axios.post(
                'https://prescripto-66h4.onrender.com/api/doctor/change-availability',
                { docId },
                { headers: { Authorization: `Bearer ${Atoken}` } }
            );

            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: data.message || 'Doctor availability updated.',
                });
                getAllDoctors();  // Refresh the doctor list
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message || 'Failed to update availability',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while changing availability.',
            });
        } finally {
            setLoading(false);  // Stop loading once done
        }
    };

    useEffect(() => {
        if (Atoken) {
            getAllDoctors();  // Fetch doctors when the token is available
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Unauthorized',
                text: 'No token found. Please log in.',
            });
        }
    }, [Atoken]);

    return (
        <div className='min-h-screen w-[1100px] bg-gray-900 text-white p-5 w-full h-full'>
            <h1 className='text-3xl font-semibold mb-6 text-white'>All Doctors</h1>
            <div className='w-full flex flex-wrap gap-6 pt-5'>
                {loading ? (
                    <div className="w-full text-center">
                        <div className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-primary rounded-full animate-spin mx-auto"></div>
                    </div>
                ) : (
                    doctors.map((item) => (
                        <div key={item._id} className='border border-[#444444] rounded-xl max-w-[220px] w-full overflow-hidden cursor-pointer group'>
                            <img
                                className='w-full h-48 object-cover bg-[#2E2E2E] group-hover:bg-[#1A73E8] transition-all duration-500'
                                src={item.image ? `https://prescripto-66h4.onrender.com${item.image}` : '/path/to/fallback-image.jpg'}
                                alt={item.name}
                            />
                            <div className='p-4'>
                                <p className='text-white text-lg font-semibold'>{item.name}</p>
                                <p className='text-[#B0B0B0] text-sm'>{item.specialization}</p>
                                <div className='mt-2 flex items-center gap-2 text-sm'>
                                    <input
                                        onChange={() => changeAvailability(item._id)}
                                        type="checkbox"
                                        checked={item.available}
                                        className="form-checkbox text-[#1A73E8] border-[#444444] focus:ring-2 focus:ring-[#1A73E8]"
                                    />
                                    <p className='text-[#B0B0B0]'>Available</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DoctorsList;
