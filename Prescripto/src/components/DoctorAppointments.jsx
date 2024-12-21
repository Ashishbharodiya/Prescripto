import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { FaTimes, FaCheck } from 'react-icons/fa'; 
import Swal from 'sweetalert2';

function DoctorAppointments() {

  const [cookies, setCookie, removeCookie] = useCookies(['Dtoken']);
  const Dtoken = { headers: { Authorization: `Bearer ${cookies?.Dtoken}` } };

  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const response = await axios.get('https://prescripto-62tm.onrender.com/api/doctor/appointments', Dtoken);
      if (response.data.success) {
        setAppointments(response.data.appointments.reverse());
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to fetch appointments',
          text: 'Could not load appointments. Please try again later.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while fetching appointments.',
      });
    }
  };

  const completeAppointment = async (appointmentId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Once you complete the appointment, it cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, complete it!',
      cancelButtonText: 'No, keep it',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            'https://prescripto-62tm.onrender.com/api/doctor/complete-appointment',
            { docId: cookies.Dtoken, appointmentId },
            Dtoken
          );
          if (response.data.success) {
            getAppointments();
            Swal.fire(
              'Completed!',
              'The appointment has been completed successfully.',
              'success'
            );
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to mark appointment as completed. Please try again.',
            });
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while completing the appointment.',
          });
        }
      }
    });
  };

  const cancelAppointment = async (appointmentId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to cancel this appointment?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            'https://prescripto-62tm.onrender.com/api/doctor/cancel-appointment',
            { docId: cookies.Dtoken, appointmentId },
            Dtoken
          );
          if (response.data.success) {
            getAppointments();
            Swal.fire(
              'Cancelled!',
              'The appointment has been cancelled successfully.',
              'success'
            );
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to cancel appointment. Please try again.',
            });
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while cancelling the appointment.',
          });
        }
      }
    });
  };

  useEffect(() => {
    if (cookies?.Dtoken) { 
      getAppointments();
    }
  }, [cookies?.Dtoken]);

  return (
    <div className='w-full max-w-6xl doctor'>
      <p className='p-4 text-center text-lg font-medium text-white bg-gray-900'>
        All Appointments
      </p>

      <div className='bg-gray-900 border rounded text-sm max-h-[80vh]'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_3fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b border-gray-700 bg-gray-900 text-white'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.map((item, index) => (
          <div
            className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_3fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-400 py-3 px-6 border-b border-gray-700 bg-gray-900 hover:bg-gray-800'
            key={index}
          >
            <p className='max-sm:hidden'>{index}</p>

            <div className='flex items-center gap-1'>
              <img
                src={`https://prescripto-62tm.onrender.com${item.userData.image}`}
                className='w-8 rounded-full'
                alt=''
              />
              <p>{item.userData.userName}</p>
              <p>{item.userData.firstName}</p>
              <p>{item.userData.lastName}</p>
            </div>

            <div>
              <p className='text-xs inline border border-primary px-2 rounded-full'>
                {item.payment ? 'CANCEL' : 'CASH'}
              </p>
            </div>

            <p className='max-sm:hidden'>{item.userData.age}</p>
            <p>
              {item.slotDate}, {item.slotTime}
            </p>
            <p>{item.amount}</p>

            {item.cancelled ? (
              <p className='text-red-400 text-xs font-medium'>Cancelled</p>
            ) : item.isCompleted ? (
              <p className='text-green-500 text-xs font-medium'>Completed</p>
            ) : (
              <div className='flex'>
                <FaTimes
                  onClick={() => cancelAppointment(item._id)}
                  className='w-10 cursor-pointer text-red-500'
                />
                <FaCheck
                  onClick={() => completeAppointment(item._id)}
                  className='w-10 cursor-pointer text-green-500'
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorAppointments;
