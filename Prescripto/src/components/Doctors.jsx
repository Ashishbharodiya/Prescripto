import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Doctors() {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [filterDoc, setFilterDoc] = useState([]); 
  const [showFilter, setShowFilter] = useState(false);
  const [specialization, setSpecialization] = useState('');
  const navigate = useNavigate();

  const token = { headers: { Authorization: `Bearer ${cookies?.token}` } };

  const getAllDoctors = async () => {
    if (!cookies?.token) {
      Swal.fire('Unauthorized', 'Please login to view doctors.', 'error');
      return;
    }

    try {
      Swal.fire({
        title: 'Loading doctors...',
        text: 'Please wait while we fetch the doctors.',
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await axios.get('https://prescripto-3-ry9r.onrender.com/api/user/all-doctors', token);

      if (response.data.success) {
        setFilterDoc(response.data.doctors);
        Swal.close();
      } else {
        Swal.fire('Error', 'Failed to fetch doctors.', 'error');
      }
    } catch (error) {
      Swal.close(); 
      Swal.fire('Error', 'There was a problem fetching doctors. Please try again.', 'error');
    }
  };

  useEffect(() => {
    getAllDoctors();
  }, [cookies?.token]); 

  const filterDoctorsBySpecialization = () => {
    if (!specialization) return filterDoc; 
    return filterDoc.filter((doctor) => doctor.specialization === specialization);
  };

  const handleAppointmentBooking = (doctorId) => {
    Swal.fire({
      title: 'Do you want to book an appointment with this doctor?',
      text: 'Please confirm to proceed with the booking.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Book Appointment',
      cancelButtonText: 'No, Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/appointment/${doctorId}`);
        Swal.fire('Appointment Booked!', 'You will be redirected to the booking page.', 'success');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 w-[1200px] text-white flex flex-col items-center p-6">
      <p className="text-gray-300">Browse through the doctors' specialists.</p>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5 w-full">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-2 px-4 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white scale-105' : 'hover:scale-105 hover:bg-gray-700'}`}
        >
          Filters
        </button>

        <div className={`flex-col gap-4 text-sm text-gray-300 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          {['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist'].map((item) => (
            <p
              key={item}
              onClick={() => setSpecialization(item)}
              className={`w-[94vw] sm:w-auto pl-3 py-2 pr-16 border border-gray-500 rounded transition-all cursor-pointer ${specialization === item ? 'bg-[#3C3C3C] text-white' : 'hover:bg-gray-700'}`}
            >
              {item}
            </p>
          ))}
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filterDoctorsBySpecialization().map((item, index) => (
            <div
              onClick={() => handleAppointmentBooking(item._id)}  
              className="border border-[#4B4B4B] rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-500"
              key={index}
            >
              <img
                className="w-full h-56 object-cover bg-[#2C2C2C]"
                src={item.image ? `https://prescripto-3-ry9r.onrender.com${item.image}` : '/path/to/fallback-image.jpg'}
                alt={item.name}
              />
              <div className="p-4">
                <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-400'}`}>
                  <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-500'}`}></p>
                  <p>{item.available ? 'Available' : 'Not Available'}</p>
                </div>

                <p className="text-lg font-medium">{item.name}</p>
                <p className="text-sm text-gray-400">{item.specialization}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Doctors;
