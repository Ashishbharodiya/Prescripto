import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Swal from 'sweetalert2';

function MyAppointments() {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const token = { headers: { Authorization: `Bearer ${cookies?.token}` } };

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [payment, setPayment] = useState('');

  const getUserAppointments = async () => {
    try {
      const response = await axios.get('https://prescripto-3-ry9r.onrender.com/api/user/appointments', token);

      if (response.data.success) {
        if (response.data.appointments && response.data.appointments.length > 0) {
          setAppointments(response.data.appointments.reverse());
        } else {
          Swal.fire({
            title: 'No Appointments',
            text: 'You have no appointments scheduled.',
            icon: 'info',
            confirmButtonText: 'OK',
          });
        }
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch appointments.',
          icon: 'error',
          confirmButtonText: 'Try Again',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong while fetching appointments.',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  const getAllDoctors = async () => {
    try {
      const response = await axios.get('https://prescripto-3-ry9r.onrender.com/api/user/all-doctors', token);
      if (response.data.success) {
        setDoctors(response.data.doctors);
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Could not fetch doctor details.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong while fetching doctor details.',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const response = await axios.post('https://prescripto-3-ry9r.onrender.com/api/user/cancel-appointment', { appointmentId }, token);

      if (response.data.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Appointment has been cancelled.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        getUserAppointments();
        getAllDoctors();
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to cancel appointment.',
          icon: 'error',
          confirmButtonText: 'Try Again',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong while cancelling the appointment.',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  const paidAppointment = async (appointmentId) => {
    try {
      const response = await axios.post('https://prescripto-3-ry9r.onrender.com/api/user/cash-payment', { appointmentId }, token);

      if (response.data.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Payment received for the appointment.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        getUserAppointments();
        getAllDoctors();
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to process the payment.',
          icon: 'error',
          confirmButtonText: 'Try Again',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong while processing the payment.',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  useEffect(() => {
    getUserAppointments();
  }, []);

  return (
    <div className="bg-gray-900 w-[1900px] text-white min-h-screen">
      <p className='py-5 text-center pb-3 text-lg font-medium text-gray-300 border-b border-gray-600'>My Appointments</p>

      <div>
        {appointments.length === 0 ? (
          <p className="text-gray-400">No appointments found.</p>
        ) : (
          appointments.map((appointment, index) => (
            <div
              key={index}
              className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:flex sm:gap-6 py-4 border-b border-gray-700'
            >
              <div className="relative rounded-lg overflow-hidden bg-[#1e1e1e] shadow-lg flex justify-center items-center group">
                <img
                  className="w-24 h-24 sm:w-36 sm:h-36 object-cover transition-transform duration-300 group-hover:scale-105"
                  src={appointment.docData.image ? `https://prescripto-3-ry9r.onrender.com${appointment.docData.image}` : '/path/to/fallback-image.jpg'}
                  alt="Doctor"
                />
                <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <div className='flex-1 text-sm text-[#B0B0B0]'>
                <p className='text-[#F0F0F0] text-base font-semibold'>{appointment.docData.name}</p>
                <p>{appointment.docData.specialization}</p>
                <p className='text-[#D1D1D1] font-medium mt-1'>Address:</p>
                <p>{appointment.docData.address}</p>
                <p className='mt-1'>
                  <span className='text-sm text-[#9E9E9E] font-medium'>Date & Time:</span> {appointment.slotDate} | {appointment.slotTime}
                </p>
              </div>
              <div className='flex flex-col gap-2 justify-end text-sm text-center'>
                {!appointment.cancelled && !appointment.payment && !appointment.isCompleted && payment !== appointment._id &&
                  <button
                    onClick={() => paidAppointment(appointment._id)}
                    className='text-[#A5A5A5] sm:min-w-48 py-2 border border-green-500 rounded hover:bg-green-500 hover:text-white transition-all duration-300'
                  >
                    Pay
                  </button>
                }

                {!appointment.cancelled && appointment.payment &&
                  <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>
                    Paid Appointment
                  </button>
                }

                {!appointment.cancelled && !appointment.isCompleted &&
                  <button
                    onClick={() => cancelAppointment(appointment._id)}
                    className='text-[#A5A5A5] sm:min-w-48 py-2 border border-[#B34D4D] rounded hover:bg-[#B34D4D] hover:text-white transition-all duration-300'
                  >
                    Cancel Appointment
                  </button>
                }

                {appointment.cancelled && !appointment.isCompleted &&
                  <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>
                    Appointment Cancelled
                  </button>
                }
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyAppointments;
