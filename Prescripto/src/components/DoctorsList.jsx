import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Swal from 'sweetalert2';

const DoctorsList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);  
    const [cookies, setCookie, removeCookie] = useCookies(['Atoken']);
    const Atoken = cookies?.Atoken;

    const getAllDoctors = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://prescripto-62tm.onrender.com/api/admin/all-doctors', {
                headers: { Authorization: `Bearer ${Atoken}` },
            });

            if (data.success) {
                setDoctors(data.doctors);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message || 'Failed to fetch doctors',
                    confirmButtonColor: '#EF4444', 
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while fetching doctors.',
                confirmButtonColor: '#EF4444', 
            });
        } finally {
            setLoading(false);  
        }
    };

    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(
                'https://prescripto-62tm.onrender.com/api/doctor/change-availability',
                { docId },
                { headers: { Authorization: `Bearer ${Atoken}` } }
            );

            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: data.message || 'Doctor availability updated.',
                    confirmButtonColor: '#10B981', 
                });
                getAllDoctors();  
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message || 'Failed to update availability',
                    confirmButtonColor: '#EF4444', 
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while changing availability.',
                confirmButtonColor: '#EF4444',
            });
        }
    };

    useEffect(() => {
        if (Atoken) {
            getAllDoctors();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Unauthorized',
                text: 'No token found. Please log in.',
                confirmButtonColor: '#EF4444',
            });
        }
    }, [Atoken]);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-5">
            <h1 className="text-3xl font-semibold mb-6 text-white">All Doctors</h1>
            <div className="w-full flex flex-wrap gap-6 pt-5">
                {loading ? (
                    <p className="text-center text-white">Loading doctors...</p>
                ) : (
                    doctors.map((item) => (
                        <div
                            key={item._id}
                            className="border border-[#444444] rounded-xl max-w-[220px] w-full overflow-hidden cursor-pointer group hover:scale-105 transition-transform duration-300"
                        >
                            <img
                                className="w-full h-48 object-cover bg-[#2E2E2E] group-hover:bg-[#1A73E8] transition-all duration-500"
                                src={item.image ? `https://prescripto-62tm.onrender.com${item.image}` : '/path/to/fallback-image.jpg'}
                                alt={item.name}
                            />
                            <div className="p-4 bg-gray-800 hover:bg-gray-700 transition-colors duration-300">
                                <p className="text-white text-lg font-semibold">{item.name}</p>
                                <p className="text-[#B0B0B0] text-sm">{item.specialization}</p>
                                <div className="mt-2 flex items-center gap-2 text-sm">
                                    <input
                                        onChange={() => changeAvailability(item._id)}
                                        type="checkbox"
                                        checked={item.available}
                                        className="form-checkbox text-[#1A73E8] border-[#444444] focus:ring-2 focus:ring-[#1A73E8]"
                                    />
                                    <p className="text-[#B0B0B0]">Available</p>
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
