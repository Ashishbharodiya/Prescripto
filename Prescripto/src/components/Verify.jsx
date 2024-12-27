import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function Verify() {
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const token = { headers: { Authorization: `Bearer ${cookies?.token}` } };
   
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const appointmentId = searchParams.get("appointmentId");
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);  // Loading state

    const verifyStripe = async () => {
        try {
            setLoading(true);  // Set loading to true when verification starts
            
            const response = await axios.post(
                'https://prescripto-66h4.onrender.com/api/user/verifyStripe',
                { success, appointmentId },
                token
            );

            if (response.data.success) {
                Swal.fire({
                    title: 'Payment Verified!',
                    text: response.data.message || 'Your payment has been successfully verified.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                Swal.fire({
                    title: 'Payment Failed',
                    text: 'Something went wrong during the payment verification process.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }

            navigate("/my-appointments");  // Navigate to the appointments page after verification
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: 'Error!',
                text: 'Something went wrong while verifying your payment.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);  // Set loading to false after the process finishes
        }
    };

    useEffect(() => {
        if (success && appointmentId) { 
            verifyStripe();
        }
    }, [success, appointmentId]);

    return (
        <div className='min-h-[60vh] flex items-center justify-center'>
            {loading ? (
                <div className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-primary rounded-full animate-spin"></div>
            ) : (
                <p className="text-gray-500">Verifying your payment...</p>
            )}
        </div>
    );
}

export default Verify;
