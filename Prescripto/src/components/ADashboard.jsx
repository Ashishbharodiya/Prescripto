import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { AiOutlineUser } from 'react-icons/ai'; 
import { AiOutlineCalendar } from 'react-icons/ai'; 
import { MdCancel } from 'react-icons/md';        
import { FaRegHospital } from 'react-icons/fa';
import Swal from 'sweetalert2';

function ADashboard() {
  const [cookies, setCookie, removeCookie] = useCookies(['Atoken']);
  const Atoken = { headers: { Authorization: `Bearer ${cookies?.Atoken}` } };

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [dashData, setDashData] = useState({
    doctors: 0,
    appointments: 0,
    patients: 0,
    latestAppointments: [],
  });

  const [loading, setLoading] = useState(false); // Added loading state

  const getDashData = async () => {
    setLoading(true); // Set loading true while fetching
    try {
      const response = await axios.get('https://prescripto-66h4.onrender.com/api/admin/dashboard', Atoken);
      if (response.data.success) {
        setDashData(response.data.dashData);
      } else {
        console.log('Error fetching dashboard data');
      }
    } catch (error) {
      console.log('Error fetching dashboard data: ', error);
      Swal.fire('Error!', 'Failed to fetch dashboard data.', 'error');
    } finally {
      setLoading(false); // Set loading false after fetch
    }
  };

  const getAllAppointments = async () => {
    setLoading(true); // Set loading true while fetching
    try {
      const response = await axios.get('https://prescripto-66h4.onrender.com/api/admin/appointments', Atoken);
      if (response.data.success) {
        setAppointments(response.data.appointments.reverse());
      } else {
        console.log('Error fetching appointments');
      }
    } catch (error) {
      console.log('Error fetching appointments: ', error);
      Swal.fire('Error!', 'Failed to fetch appointments.', 'error');
    } finally {
      setLoading(false); // Set loading false after fetch
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
      reverseButtons: true,
      customClass: {
        popup: 'bg-gray-800 text-white border-2 border-gray-700 rounded-lg shadow-lg',
        title: 'text-xl font-semibold',
        content: 'text-lg',
        confirmButton: 'bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500',
        cancelButton: 'bg-gray-600 text-white hover:bg-gray-700 px-4 py-2 rounded-lg focus:ring-2 focus:ring-gray-500',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true); // Set loading true while canceling appointment
        try {
          const response = await axios.post('https://prescripto-66h4.onrender.com/api/admin/cancel-appointment', { id: appointmentId }, Atoken);
          
          if (response.data.success) {
            getAllAppointments(); // Refresh appointments
            Swal.fire('Cancelled!', 'The appointment has been cancelled.', 'success');
          } else {
            Swal.fire('Error!', 'Something went wrong, please try again.', 'error');
          }
        } catch (error) {
          Swal.fire('Error!', 'There was an issue with canceling the appointment.', 'error');
          console.log('Error canceling appointment: ', error);
        } finally {
          setLoading(false); // Set loading false after cancellation
        }
      }
    });
  };

  useEffect(() => {
    if (cookies?.Atoken) {
      getDashData();
      getAllAppointments();
    }
  }, [cookies?.Atoken]); 

  return dashData && (
    <div className='min-h-screen w-full sm:w-[90%] md:w-[80%] lg:w-[1200px] bg-gray-900 text-white'>
      <div className='p-4'>
        {/* Card section */}
        <div className='flex flex-wrap gap-3 justify-center sm:justify-start'>
          {/* Doctors Card */}
          <div className='flex items-center gap-2 bg-gray-800 p-4 min-w-[180px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-52 rounded border-2 border-gray-700 cursor-pointer hover:bg-gray-700 hover:scale-105 hover:text-white transition-all'>
            <AiOutlineUser className='w-16 text-white' />
            <div>
              <p className='text-xl font-semibold text-white'>{dashData.doctors}</p>
              <p className='text-gray-400'>Doctors</p>
            </div>
          </div>

          {/* Appointments Card */}
          <div className='flex items-center gap-2 bg-gray-800 p-4 min-w-[180px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-52 rounded border-2 border-gray-700 cursor-pointer hover:bg-gray-700 hover:scale-105 hover:text-white transition-all'>
            <AiOutlineCalendar className='w-14 text-white' />
            <div>
              <p className='text-xl font-semibold text-white'>{dashData.appointments}</p>
              <p className='text-gray-400'>Appointments</p>
            </div>
          </div>

          {/* Patients Card */}
          <div className='flex items-center gap-2 bg-gray-800 p-4 min-w-[180px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-52 rounded border-2 border-gray-700 cursor-pointer hover:bg-gray-700 hover:scale-105 hover:text-white transition-all'>
            <FaRegHospital className='w-14 text-white' />
            <div>
              <p className='text-xl font-semibold text-white'>{dashData.patients}</p>
              <p className='text-gray-400'>Patients</p>
            </div>
          </div>
        </div>

        {/* Latest Bookings Section */}
        <div className='bg-gray-800 mt-10'>
          <div className='flex items-center gap-2.5 px-4 py-4 rounded-t border border-gray-700'>
            <AiOutlineCalendar className='text-white' />
            <p className='font-semibold text-white'>Latest Bookings</p>
          </div>

          <div className='pt-4 border border-t-0 border-gray-700'>
            {dashData.latestAppointments.slice(0, 5).map((item, index) => (
              <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-700' key={index}>
                <img className='rounded-full w-14' src={`https://prescripto-66h4.onrender.com${item.docData.image}`} alt="" />
                <div className='flex-1 text-sm'>
                  <p className='text-white font-medium'>{item.docData.name}</p>
                  <p className='text-gray-400'>Booking on {item.slotDate}</p>
                </div>
                {item.cancelled ? 
                  <p className='text-red-400 text-xs font-medium'>Cancelled</p> : 
                  item.isCompleted ? 
                  <p className='text-green-500 text-xs font-medium'>Completed</p> : 
                  <MdCancel 
                    onClick={() => cancelAppointment(item._id)} 
                    className={`w-10 cursor-pointer text-white ${loading ? 'cursor-not-allowed' : ''}`} 
                    disabled={loading}  // Disable the cancel button while loading
                  />
                }
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ADashboard;
