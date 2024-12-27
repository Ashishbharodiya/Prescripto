import axios from 'axios';
import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate, useSearchParams } from 'react-router-dom';

function verifyStripe() {
 
        const [cookies, setCookie, removeCookie] = useCookies(['token']);
        const token = { headers: { Authorization: `Bearer ${cookies?.token}` } };
       
        const [searchParams, setSearchParams] = useSearchParams()
        const success = searchParams.get("success")
        const appointmentId = searchParams.get("appointmentId")
        const navigate = useNavigate()

        const verifyStripe = async () => {

            try {
    
                const response = await axios.get('https://prescripto-66h4.onrender.com/api/user/verifyStripe', { success, appointmentId }, token);

                if (response.data.success) {
                    console.log(response.data.doctors);
                  } else{
                     console.log('error');  
                  }
                navigate("/my-appointments")
            } catch (error) {
                toast.error(error.message)
                console.log(error)
            }
        }

        useEffect(() => {
            if (token, appointmentId, success) {
                verifyStripe()
            }
        }, [token])

  return (
    <div className='min-h-[60vh] flex items-center justify-center'>
    <div className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-primary rounded-full animate-spin"></div>
    </div>
  )
}

export default verifyStripe



