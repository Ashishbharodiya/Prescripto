import axios from 'axios';
import React, { useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


function AddDoctor() {
    let [hobbies,setHobbies] = useState ([]);
    const [obj, setObj] = useState({});
    const [blank,setblank] = useState({})
    const navigate = useNavigate();

    const [cookies] = useCookies(['Atoken']);
    const Atoken = { headers: { Authorization: `Bearer ${cookies?.Atoken}` } };



    const SignupData = (e) => {
             if (e.target.name === "hobbies"){  
                if (e.target.checked){
                    hobbies.push(e.target.value);
                    setHobbies([...hobbies]);
                    obj.hobbies = hobbies; 
                     console.log(hobbies);
              }
              else{
                     hobbies = obj.hobbies.filter ((x)=>x !== e.target.value)
                    setHobbies([...hobbies]);
                     obj.hobbies = hobbies; 
             }   
             }
             else if (e.target.name === 'profileImage') {
                         obj.profileImage = e.target.files[0];
                     } else  {
          obj[e.target.name] = e.target.value;
          blank[e.target.name] = "";
    
        }
        setObj({ ...obj });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setblank({...blank});
    
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
    
        try {
        const response = await axios.post('http://localhost:5000/api/admin/add-doctor', formData, Atoken);
     

        console.log('Registration successful:', response.data);
    
          Swal.fire({
            title: 'Registration Successful!',
            text: 'You have been registered successfully.',
            icon: 'success',
            confirmButtonText: 'OK',
          });
    
          setObj({});
          setObj({...blank});
         
    
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: 'There was an issue with your registration. Please try again later.',
            icon: 'error',
            confirmButtonText: 'Try Again',
          });
        }
      };

  return (
     <>
 <form action="" onSubmit={handleSubmit} className="space-y-6 p-6 bg-gray-800 w-[1200px] shadow-md rounded-lg" autoComplete='off'>
 <p className="text-2xl text-center font-semibold text-gray-100 transition-transform transform hover:scale-1 hover:text-blue-400 ">
  Add Doctor
</p>  
  <div className="flex flex-col  hover:text-blue-400">
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

      <div>
        <label className="block text-sm font-medium text-gray-200 hover:text-blue-400">Email</label>
        <input
          type="email"
          name="email"
          onChange={SignupData}
          value={obj.email}
          required
          className="w-full p-3 border border-gray-600 bg-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 hover:text-blue-400">Password</label>
        <input
          type="password"
          name="password"
          onChange={SignupData}
          value={obj.password}
          required
          className="w-full p-3 border border-gray-600 bg-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 hover:text-blue-400">Specialization</label>
        <select
          name="specialization"
          onChange={SignupData}
          value={obj.specialization}
          required
          className="w-full p-3 border border-gray-600 bg-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Specialization</option>
          <option value="General physician " className=' hover:text-blue-400'>General physician</option>
          <option value="Gynecologist "  className=' hover:text-blue-400'>Gynecologist</option>
          <option value="Dermatologist"  className=' hover:text-blue-400'>Dermatologist</option>
          <option value="Pediatricians "  className=' hover:text-blue-400'>Pediatricians</option>
          <option value="Neurologist"  className=' hover:text-blue-400'>Neurologist</option>
          <option value="Gastroenterologist"  className=' hover:text-blue-400'>Gastroenterologist</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 hover:text-blue-400">Contact Number</label>
        <input
          type="text"
          name="contactNumber"
          onChange={SignupData}
          value={obj.contactNumber}
          required
          className="w-full p-3 border border-gray-600 bg-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 hover:text-blue-400">Address</label>
        <input
          type="text"
          name="address"
          onChange={SignupData}
          value={obj.address}
          required
          className="w-full p-3 border border-gray-600 bg-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-200 hover:text-blue-400">Gender</label>
        <select
          name="gender"
          onChange={SignupData}
          value={obj.gender}
          required
          className="w-full p-3 border border-gray-600 bg-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 hover:text-blue-400">Degree</label>
        <input
          type="text"
          name="degree"
          onChange={SignupData}
          value={obj.degree}
          required
          className="w-full p-3 border border-gray-600 bg-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 hover:text-blue-400 ">Experience</label>
        <input
          type="text"
          name="experience"
          onChange={SignupData}
          value={obj.experience}
          required
          className="w-full p-3 border border-gray-600 bg-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 hover:text-blue-400 ">About</label>
        <textarea
          name="about"
          onChange={SignupData}
          value={obj.about}
          required
          className="w-full p-3 border border-gray-600 bg-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 hover:text-blue-400">Fees</label>
        <input
          type="number"
          name="fees"
          onChange={SignupData}
          value={obj.fees}
          required
          className="w-full p-3 border border-gray-600 bg-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 hover:text-blue-400 ">Availability Days</label>
        <div className="space-y-2">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
            <label key={day} className="flex items-center text-gray-100 hover:text-blue-400">
              <input
                type="checkbox"
                value={day}
                checked={obj.hobbies?.includes(day)}
                onChange={SignupData}
                name="hobbies"
                className="mr-2 hover:text-blue-400"
              />
              {day}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 hover:text-blue-400">Availability Time</label>
        <input
          type="text"
          name="availabilityTime"
          onChange={SignupData}
          value={obj.availabilityTime}
          required
          className="w-full p-3 border border-gray-600 bg-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  </div>

  <button
    type="submit"
    className="w-full py-3 mt-4 bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700 transition duration-300"
  >
    Add Doctor
  </button>
</form>
      </>

  )
}

export default AddDoctor





