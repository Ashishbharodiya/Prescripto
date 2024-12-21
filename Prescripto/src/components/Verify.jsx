import axios from 'axios';
import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Verify() {
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const token = { headers: { Authorization: `Bearer ${cookies?.token}` } };
   
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const appointmentId = searchParams.get("appointmentId");
    const navigate = useNavigate();

    const verifyStripe = async () => {
        try {
            const response = await axios.post(
                'https://prescripto-62tm.onrender.com/api/user/verifyStripe',
                { success, appointmentId },
                token
            );

            if (response.data.success) {
                console.log(response.data.message);
            } else {
                console.log('Payment failed');
            }

            navigate("/my-appointments");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (success && appointmentId) { 
            verifyStripe();
        }
    }, [success, appointmentId]); 

    return (
        <div className='min-h-[60vh] flex items-center justify-center'>
            <div className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-primary rounded-full animate-spin"></div>
        </div>
    );
}

export default Verify;
