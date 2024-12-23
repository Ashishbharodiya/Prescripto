import axios from "axios";

export const GetloginAction = (formData, Atoken) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        "https://prescripto-7.onrender.com/api/admin/registration", 
        formData, 
        Atoken 
      );

    } catch (error) {
      console.error('Error during registration:', error);
      throw new Error('Registration failed');
    }
  };
};
