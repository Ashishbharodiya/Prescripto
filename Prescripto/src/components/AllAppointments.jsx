import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { MdCancel } from "react-icons/md";
import icons from '../images/close.png';  
import Swal from 'sweetalert2';

function AllAppointments() {
    const [cookies, setCookie, removeCookie] = useCookies(['Atoken']);
    const Atoken = { headers: { Authorization: `Bearer ${cookies?.Atoken}` } };

    const [appointments, setAppointments] = useState([]);

    const getAllAppointments = async () => {
        try {
            const response = await axios.get('https://prescripto-62tm.onrender.com/api/admin/appointments', Atoken);
            if (response.data.success) {
                setAppointments(response.data.appointments.reverse());
            } else {
                console.log('Error fetching appointments');
            }
        } catch (error) {
            console.log('Error fetching appointments: ', error);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to cancel this appointment!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, keep it',
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.post('https://prescripto-62tm.onrender.com/api/admin/cancel-appointment', { appointmentId }, Atoken);
                    if (response.data.success) {
                        getAllAppointments();
                        Swal.fire('Cancelled!', 'The appointment has been cancelled.', 'success');
                    } else {
                        Swal.fire('Error!', 'Something went wrong, please try again.', 'error');
                    }
                } catch (error) {
                    Swal.fire('Error!', 'There was an issue canceling the appointment.', 'error');
                    console.log('Error canceling appointment: ', error);
                }
            }
        });
    };

    useEffect(() => {
        if (cookies?.Atoken) {
            getAllAppointments();
        }
    }, [cookies?.Atoken]);

    return (
        <div className='bg-gray-900 border rounded text-sm max-h-[80vh]'>
            <div className='hidden sm:grid grid-cols-[0.5fr_3.5fr_1fr_3fr_4fr_1fr_1fr] grid-flow-col py-3 px-6 border-b border-gray-700 bg-gray-900'>
                <p className='text-white'>#</p>
                <p className='text-white'>Patient</p>
                <p className='text-white'>Age</p>
                <p className='text-white'>Date & Time</p>
                <p className='text-white'>Doctor</p>
                <p className='text-white'>Fees</p>
                <p className='text-white'>Action</p>
            </div>
            {appointments.map((item, index) => (
                <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3.5fr_1fr_3fr_4fr_1fr_1fr] items-center text-gray-300 py-3 px-7 border-b border-gray-700 hover:bg-gray-800 bg-gray-900' key={index}>
                    <p className='max-sm:hidden text-white'>{index + 1}</p>
                    <div className='flex items-center gap-2'>
                        <img src={`https://prescripto-62tm.onrender.com${item.userData.image}`} className='w-8 rounded-full' alt="" />
                        <p className='text-white'>{item.userData.userName}</p>
                        <p className='text-white'>{item.userData.firstName}</p>
                        <p className='text-white'>{item.userData.lastName}</p>
                    </div>
                    <p className='max-sm:hidden text-white'>{item.userData.age}</p>
                    <p className='text-white'>{item.slotDate}, {item.slotTime}</p>
                    <div className='flex items-center gap-2'>
                        <img src={`https://prescripto-62tm.onrender.com${item.docData.image}`} className='w-8 rounded-full bg-gray-600' alt="" />
                        <p className='text-white'>{item.docData.name}</p>
                    </div>
                    <p className='text-white'>${item.amount}</p>
                    {item.cancelled ? 
                        <p className='text-red-400 text-xs font-medium'>Cancelled</p> : 
                        item.isCompleted ? 
                        <p className='text-green-500 text-xs font-medium'>Completed</p> : 
                        <>
                            <img onClick={() => cancelAppointment(item._id)} className='w-4 cursor-pointer' src={icons} alt="Cancel Appointment" />
                        </>
                    }
                </div>
            ))}
        </div>
    );
}

export default AllAppointments;
