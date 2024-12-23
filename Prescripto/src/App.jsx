import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import OtpVerification from './components/OtpVerification';
import EmailVerification from './components/EmailVerification';
import ForgetPassword from './components/ForgetPassword';
import { useCookies } from 'react-cookie';
import Profile from './components/Profile';
import ARegistrationForm from './components/ARegistrationForm';
import ALoginForm from './components/ALoginForm';
import AddDoctor from './components/AddDoctor';
import DoctorsList from './components/DoctorsList';
import DLoginForm from './components/DLoginForm';
import Doctor from './components/Doctor';
import Dprofile from './components/Dprofile';
import Doctors from './components/Doctors';
import Appointment from './components/Appointment';
import MyAppointments from './components/MyAppointments';
import Verify from './components/Verify';
import ADashboard from './components/ADashboard';
import AllAppointments from './components/AllAppointments';
import DoctorAppointments from './components/DoctorAppointments';
import Dsidebar from './components/Dsidebar';
import Navbar from './components/Navbar';
import Asidebar from './components/Asidebar';
import Anavbar from './components/Anavbar';
import Usidebar from './components/Usidebar';
import Udashboard from './components/Udashboard';
import Dnavbar from './components/Dnavbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [cookies] = useCookies(['token', 'Atoken', 'Dtoken']);

  return (
    <BrowserRouter>

        {!cookies.token ? (
          <>
            <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/verify-otp/:id" element={<OtpVerification />} />
            <Route path="/verifyEmail" element={<EmailVerification />} />
            <Route path="/forgetPassword/:id/:resetpasswordToken" element={<ForgetPassword />} />
            </Routes>
          </>
        ) : (
          <>
            <div>
            <ToastContainer />
            <Navbar/>  
            <div  className='flex w-full h-full '>
            <Usidebar />
            <Routes>
            <Route path="/" element={<Navigate to="/user/dashboard" />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/user/dashboard" element={<Udashboard />} />
            <Route path="/doctors/:speciality" element={<Doctors />} />
            <Route path="/appointment/:docId" element={<Appointment />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
            <Route path="/verify" element={<Verify />} />
            </Routes>
                </div>
              </div>
          </>
        )}

        {!cookies.Atoken ? (
          <>
               <Routes>
            <Route path="/admin" element={<Navigate to="/admin/login" />} />
            <Route path="/admin/login" element={<ALoginForm />} />
            </Routes>
          </>
        ) : (
          <>
             <div>
              <Anavbar />
             <div  className='flex w-full h-full '>
                <Asidebar />
              <Routes>
            <Route path="/admin/*" element={<Navigate to="/admin/dashboard" />} />
            <Route path="/admin/register" element={<ARegistrationForm />} />
            <Route path="/admin/doctors" element={<AddDoctor />} />
            <Route path="/admin/all-doctors" element={<DoctorsList />} />
            <Route path="/admin/dashboard" element={<ADashboard />} />
            <Route path="/admin/all-appointments" element={<AllAppointments />} />
            </Routes>
             </div>
             </div>
          </>
        )}

        {!cookies.Dtoken ? (
          <>
            <Routes>
            <Route path="/doctor" element={<Navigate to="/doctor/login" />} />
            <Route path="/doctor/login" element={<DLoginForm />} />
            </Routes>
            
          </>
        ) : (
          <>
            <div>
            <Dnavbar/>
            <div  className='flex w-full h-full '>
            <Dsidebar />
           <Routes>
            <Route path="/doctor/*" element={<Navigate to="/doctor-dashboard" />} />
            <Route path="/doctor-dashboard" element={<Doctor />} />
            <Route path="/doctor-profile" element={<Dprofile />} />
            <Route path="/doctor-appointments" element={<DoctorAppointments />} />
            </Routes>
           </div>
              </div>
          </>
        )}
    </BrowserRouter>
  );
}

export default App;
