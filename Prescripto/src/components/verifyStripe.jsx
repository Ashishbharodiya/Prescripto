import axios from 'axios';
import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function VerifyStripe() {
    const [cookies] = useCookies(['token']);
    const token = { headers: { Authorization: `Bearer ${cookies?.token}` } };
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const appointmentId = searchParams.get("appointmentId");
    const navigate = useNavigate();

    const verifyStripe = async () => {
        try {
            const response = await axios.get('https://prescripto-62tm.onrender.com/api/user/verifyStripe', { 
                params: { success, appointmentId },
                headers: token.headers
            });

            if (response.data.success) {
                Swal.fire({
                    title: 'Payment Verified!',
                    text: 'Your payment has been successfully processed.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'bg-gray-800 text-white',
                        title: 'text-xl font-semibold text-white',
                        content: 'text-white',
                        confirmButton: 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
                    },
                }).then(() => {
                    navigate("/my-appointments");
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'There was an issue verifying your payment. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'Try Again',
                    customClass: {
                        popup: 'bg-gray-800 text-white',
                        title: 'text-xl font-semibold text-white',
                        content: 'text-white',
                        confirmButton: 'bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500',
                    },
                }).then(() => {
                    navigate("/my-appointments");
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while verifying the payment. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'bg-gray-800 text-white',
                    title: 'text-xl font-semibold text-white',
                    content: 'text-white',
                    confirmButton: 'bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500',
                },
            });
            console.error('Verification failed:', error);
        }
    };

    useEffect(() => {
        if (success && appointmentId) {
            verifyStripe();
        }
    }, [success, appointmentId]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-primary rounded-full animate-spin"></div>
        </div>
    );
}

export default VerifyStripe;
