import axios from "axios";
import { GETDOCTORSDETAL } from "../Type/type";

export const DoctorDetailAction = (Atoken) => {
    return (dispatch) => {
        axios.get("http://localhost:5000/api/admin/all-doctors", {
            headers: { Authorization: `Bearer ${Atoken}` }
        }).then((res) => {
            console.log(res.data);
            dispatch({ type: GETDOCTORSDETAL, data: res.data.data });
        }).catch((err) => {
            console.error(err);
            // Handle error if needed (optional)
        });
    };
};
