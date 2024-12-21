import axios from "axios";
import { GETDOCTORSDETAL } from "../Type/type";

export const DoctorDetailAction = (Atoken) => {
    return (dispatch) => {
        axios.get("https://prescripto-62tm.onrender.com/api/admin/all-doctors", {
            headers: { Authorization: `Bearer ${Atoken}` }
        }).then((res) => {
            console.log(res.data);
            dispatch({ type: GETDOCTORSDETAL, data: res.data.data });
        }).catch((err) => {
            console.error(err);
           
        });
    };
};
