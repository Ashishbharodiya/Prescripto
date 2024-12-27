import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { MdMoneyOff, MdEvent, MdPerson, MdCancel } from 'react-icons/md'; 
import { FaCheckCircle } from 'react-icons/fa'; 
import Swal from 'sweetalert2';

function Doctor() {
  const [cookies, setCookie, removeCookie] = useCookies(['Dtoken']);
  const Dtoken = { headers: { Authorization: `Bearer ${cookies?.Dtoken}` } };

  const [dashData, setDashData] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);  // Loading state

  const getDashData = async () => {
    setLoading(true);  // Set loading to true when fetching data
    try {
      const response = await axios.get('https://prescripto-66h4.onrender.com/api/doctor/dashboard', Dtoken);
      if (response.data.success) {
        setDashData(response.data.dashData);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to fetch doctor data',
          text: 'Something went wrong while fetching dashboard data. Please try again later.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while fetching doctor data.',
      });
    } finally {
      setLoading(false);  // Set loading to false after request completes
    }
  };

  const getAppointments = async () => {
    setLoading(true);  // Set loading to true when fetching data
    try {
      const response = await axios.get('https://prescripto-66h4.onrender.com/api/doctor/appointments', Dtoken);
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
    } finally {
      setLoading(false);  // Set loading to false after request completes
    }
  };

  const completeAppointment = async (appointmentId) => {
    setLoading(true);  // Set loading to true when completing appointment
    try {
      const response = await axios.post(
        'https://prescripto-66h4.onrender.com/api/doctor/complete-appointment',
        { docId: cookies.Dtoken, appointmentId },
        Dtoken
      );
      if (response.data.success) {
        getAppointments();
        getDashData();
        Swal.fire({
          icon: 'success',
          title: 'Appointment Completed',
          text: 'The appointment has been marked as completed.',
        });
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
    } finally {
      setLoading(false);  // Set loading to false after request completes
    }
  };

  const cancelAppointment = async (appointmentId) => {
    setLoading(true);  // Set loading to true when cancelling appointment
    try {
      const response = await axios.post(
        'https://prescripto-66h4.onrender.com/api/doctor/cancel-appointment',
        { docId: cookies.Dtoken, appointmentId },
        Dtoken
      );
      if (response.data.success) {
        getAppointments();
        getDashData();
        Swal.fire({
          icon: 'success',
          title: 'Appointment Cancelled',
          text: 'The appointment has been cancelled successfully.',
        });
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
    } finally {
      setLoading(false);  // Set loading to false after request completes
    }
  };

  useEffect(() => {
    if (cookies?.Dtoken) { 
      getDashData();
      getAppointments();
    }
  }, [cookies?.Dtoken]);

  return (
    dashData && (
      <div className='bg-gray-900 dark:bg-gray-800 w-full h-full'>
        <p className='p-4 text-center text-lg font-medium text-white bg-gray-900 dark:bg-gray-800'>
          Doctor Dashboard
        </p>

        <div className='flex flex-wrap gap-3'>
          {/* Dashboard Stats */}
          <div className='flex items-center gap-2 bg-gray-800 dark:bg-gray-800 p-4 min-w-52 rounded border-2 border-gray-800 dark:border-gray-700 cursor-pointer hover:scale-105 transition-all'>
            <MdMoneyOff className='w-14 h-14 text-gray-500 dark:text-gray-400' />
            <div>
              <p className='text-xl font-semibold text-white'>{`₹${dashData.earnings}`}</p>
              <p className='text-gray-400 dark:text-gray-300'>Earnings</p>
            </div>
          </div>

          <div className='flex items-center gap-2 bg-gray-800 dark:bg-gray-800 p-4 min-w-52 rounded border-2 border-gray-800 dark:border-gray-700 cursor-pointer hover:scale-105 transition-all'>
            <MdEvent className='w-14 h-14 text-gray-500 dark:text-gray-400' />
            <div>
              <p className='text-xl font-semibold text-white'>{dashData.appointments}</p>
              <p className='text-gray-400 dark:text-gray-300'>Appointments</p>
            </div>
          </div>

          <div className='flex items-center gap-2 bg-gray-800 dark:bg-gray-800 p-4 min-w-52 rounded border-2 border-gray-800 dark:border-gray-700 cursor-pointer hover:scale-105 transition-all'>
            <MdPerson className='w-14 h-14 text-gray-500 dark:text-gray-400' />
            <div>
              <p className='text-xl font-semibold text-white'>{dashData.patients}</p>
              <p className='text-gray-400 dark:text-gray-300'>Patients</p>
            </div>
          </div>
        </div>

        <div className='bg-gray-900 dark:bg-gray-800'>
          <div className='flex items-center bg-gray-800 gap-2.5 px-4 py-4 mt-10 rounded-t border border-gray-800 dark:border-gray-700'>
            <MdEvent className='w-6 h-6 text-gray-500 dark:text-gray-400 ' />
            <p className='font-semibold text-white'>Latest Bookings</p>
          </div>

          <div className='pt-4 border border-t-0 border-gray-800 dark:border-gray-700'>
            {loading ? (
              <div className="text-center text-white">Loading...</div>  {/* Display loading message */}
            ) : (
              dashData.latestAppointments.slice(0, 5).map((item, index) => (
                <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-800 dark:hover:bg-gray-700' key={index}>
                  <img className='rounded-full w-10' src={`https://prescripto-66h4.onrender.com${item.docData.image}`} alt="" />
                  <div className='flex-1 text-sm'>
                    <p className='text-white font-medium'>{item.userData.name}</p>
                    <p className='text-gray-400 dark:text-gray-300'>Booking on {item.slotDate}</p>
                  </div>

                  {item.cancelled
                    ? <p className='text-red-500 text-xs font-medium'>Cancelled</p>
                    : item.isCompleted
                      ? <p className='text-green-400 text-xs font-medium'>Completed</p>
                      : <div className='flex'>
                          <MdCancel onClick={() => cancelAppointment(item._id)} className='w-6 h-6 cursor-pointer text-red-500' />
                          <FaCheckCircle onClick={() => completeAppointment(item._id)} className='w-6 h-6 cursor-pointer text-green-400' />
                      </div>
                  }
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  );
}

export default Doctor;
