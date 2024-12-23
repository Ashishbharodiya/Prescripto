import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function Appointment() {
    const { docId } = useParams();
    const [cookies, setCookie, removeCookie] = useCookies(['token', 'userId']);
    const token = { headers: { Authorization: `Bearer ${cookies?.token}` } };
    const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const [doctors, setDoctors] = useState([]);
    const [docInfo, setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const getAllDoctors = async () => {
        try {
            const response = await axios.get('https://prescripto-3-ry9r.onrender.com/api/user/all-doctors', token);
            if (response.data.success) {
                setDoctors(response.data.doctors);
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Could not fetch doctors data.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Something went wrong while fetching doctors.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const fetchDocInfo = async () => {
        const doctor = doctors.find((doc) => doc._id === docId);
        if (doctor) {
            setDocInfo(doctor);
        } else {
            Swal.fire({
                title: 'Error!',
                text: 'Doctor not found.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    useEffect(() => {
        if (doctors.length === 0) {
            getAllDoctors();
        }
    }, [doctors]);

    useEffect(() => {
        if (doctors.length > 0) {
            fetchDocInfo();
        }
    }, [doctors, docId]);

    const getAvailable = async () => {
        setDocSlots([]);
        let today = new Date();
        let slotArray = [];

        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            let endTime = new Date();
            endTime.setDate(today.getDate() + i);
            endTime.setHours(21, 0, 0, 0); 

            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 9 ? currentDate.getHours() + 1 : 9);
                currentDate.setMinutes(currentDate.getMinutes() > 15 ? 15 : 0);
            } else {
                currentDate.setHours(9); 
                currentDate.setMinutes(0);
            }

            let timeSlots = [];

            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                let day = currentDate.getDate();
                let month = currentDate.getMonth() + 1;
                let year = currentDate.getFullYear();

                const slotDate = `${day}_${month}_${year}`;
                const slotTime = formattedTime;

                const isSlotAvailable = !docInfo.slots_booked?.[slotDate]?.includes(slotTime);

                if (isSlotAvailable) {
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime,
                    });
                }

                currentDate.setMinutes(currentDate.getMinutes() + 15);
            }

            if (timeSlots.length) {
                slotArray.push({
                    date: currentDate,
                    availableSlots: timeSlots,
                });
            }

            setDocSlots((prev) => [...prev, timeSlots]);
        }
    };

    useEffect(() => {
        if (docInfo) {
            getAvailable();
        }
    }, [docInfo]);

    const bookAppointment = async () => {
        if (!token) {
            Swal.fire({
                title: 'Error!',
                text: 'You need to login first!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return navigate('/login');
        }

        const date = docSlots[slotIndex][0].datetime;
        if (!date) {
            return;
        }

        let day = date.getDate();
        let month = date.getMonth() + 1; 
        let year = date.getFullYear();

        const slotDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;

        try {
            setLoading(true);
            const response = await axios.post(
                'https://prescripto-3-ry9r.onrender.com/api/user/book-appointment',
                {
                    docId,
                    slotDate,
                    slotTime,
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );

            if (response.data.success) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Your appointment has been booked.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                setTimeout(() => navigate('/my-appointments'), 2000); 
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Booking appointment failed. Try again later.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while booking the appointment.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gray-900 w-[970px]">
            {docInfo ? (
              <div>
                <div className="flex flex-col sm:flex-row gap-4 bg-gray-800 p-6 rounded-lg shadow-lg">
                  <div>
                    <img
                      className="w-full sm:max-w-72 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
                      src={docInfo.image ? `https://prescripto-62tm.onrender.com${docInfo.image}` : '/path/to/fallback-image.jpg'}
                      alt={`${docInfo.name}'s photo`}
                    />
                  </div>
                  <div className="flex-1 border border-[#555555] rounded-lg p-8 py-7 bg-[#1f1f1f] mx-2 sm:mx-0 mt-[-80px] sm:mt-0 shadow-md">
                    <p className="flex items-center gap-2 text-3xl font-medium text-white pb-3 ">{docInfo.name}</p>
                    <div className="flex items-center gap-2 mt-1 text-gray-400 pb-3 ">
                      <p>{docInfo.degree} - {docInfo.specialization}</p>
                      <button className="py-0.5 px-2 border text-xs rounded-full text-gray-800 text-white">{docInfo.experience}</button>
                    </div>
                    <div className='pb-3'>
                      <p className="flex items-center gap-1 text-sm font-medium text-[#E2E2E2] mt-3">About</p>
                      <p className="text-sm text-gray-300 max-w-[700px] mt-1">{docInfo.about}</p>
                    </div>
                    <p className="text-gray-400 font-medium mt-4">Appointment fee: <span className="text-gray-200"> ₹{docInfo.fees}</span></p>
                  </div>
                </div>
              
                <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[#D1D1D1]">
                  <p className="text-gray-100">Booking slots</p>
                  <div className="flex gap-3 items-center w-full mt-3 overflow-x-auto hover:overflow-x-scroll transition-all bg-gray-800 rounded-lg p-4">
                    {docSlots.length &&
                      docSlots.map((item, index) => (
                        <div
                          onClick={() => setSlotIndex(index)}
                          key={index}
                          className={`text-center py-6 min-w-16 rounded-full cursor-pointer transition-all transform hover:scale-110 ${slotIndex === index ? 'bg-primary text-white' : 'border border-[#555555] text-gray-300'}`}
                        >
                          <p>{item[0] && week[item[0].datetime.getDay()]}</p>
                          <p>{item[0] && item[0].datetime.getDate()}</p>
                        </div>
                    ))}
                </div>

                {docSlots.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-medium text-lg text-gray-100">Select a time slot:</h3>
                    <div className="flex gap-4 mt-4 overflow-x-auto hover:overflow-x-scroll transition-all bg-gray-700 p-4 rounded-lg">
                      {docSlots[slotIndex].map((slot, index) => (
                        <div
                          key={index}
                          className={`p-3 border rounded-lg cursor-pointer transition-transform transform hover:scale-105 hover:bg-gray-600 ${slotTime === slot.time ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400'}`}
                          onClick={() => {
                            setSlotTime(slot.time);
                          }}
                        >
                          <p className="text-lg font-medium">{slot.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {slotTime && docSlots.length > 0 && (
                <div className="mt-4 text-center text-gray-300">
                    <p className="text-lg">Selected Appointment:</p>
                    <p className="font-medium text-lg text-white">{docSlots[slotIndex][0].datetime.toLocaleDateString()} | {slotTime}</p>
                </div>
              )}
              
              <div className="mt-8 text-center">
                <button
                  onClick={bookAppointment}
                  className="bg-primary text-white px-6 py-2 rounded-lg transition-all transform hover:scale-110 disabled:bg-gray-600"
                  disabled={!slotTime || loading}
                >
                  {loading ? 'Booking...' : 'Book Appointment'}
                </button>
              </div>
            </div>
          ) : null}
        </div>
    );
}

export default Appointment;
