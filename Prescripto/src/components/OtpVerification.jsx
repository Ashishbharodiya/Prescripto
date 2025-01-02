import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["token", "user"]);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    Swal.fire({
      title: "Verifying...",
      text: "Please wait while we verify your OTP.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: {
        popup: "bg-gray-800",
        title: "text-lg font-semibold text-white",
        content: "text-white",
        confirmButton: "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
      },
    });

    try {
      const response = await axios.post("https://prescripto-66h4.onrender.com/api/user/verify-otp", {
        id: id,
        otp: otp,
      });

      setLoading(false);
      Swal.close();

      if (response.data.status) {
        const { token, data } = response.data;

        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 24);

        setCookie("token", token, { path: "/", expires: expiryDate });
        setCookie("user", JSON.stringify(data), { path: "/", expires: expiryDate });

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(data));

        Swal.fire({
          title: "Success!",
          text: "OTP verified successfully!",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            popup: "bg-gray-800",
            title: "text-lg font-semibold text-white",
            content: "text-white",
            confirmButton: "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
          },
        }).then(() => {
          navigate("/user/dashboard");
        });
      } else {
        Swal.fire({
          title: "Invalid OTP",
          text: response.data.message || "The OTP you entered is incorrect. Please try again.",
          icon: "error",
          confirmButtonText: "Try Again",
          customClass: {
            popup: "bg-gray-800",
            title: "text-lg font-semibold text-white",
            content: "text-white",
            confirmButton: "bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500",
          },
        });
      }
    } catch (error) {
      setLoading(false);
      Swal.close();

      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred while verifying your OTP. Please try again later.";

      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup: "bg-gray-800",
          title: "text-lg font-semibold text-white",
          content: "text-white",
          confirmButton: "bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500",
        },
      });
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-900">
      <div className="bg-gray-900 p-10 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white mb-8">OTP Verification</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300">Enter the 6-digit OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              maxLength="6"
              required
              className="mt-2 p-3 w-full border-2 border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter OTP"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
