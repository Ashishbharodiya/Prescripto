import axios from "axios"
import { GETDOCTORDETAIL, GETDOCTORSDETAL, GETUSERDETAIL } from "../Type/type";


export const DoctorDetailAction = (Dtoken)=> {
    return  (dispatch )=> {
        axios.get("https://prescripto-66h4.onrender.com/api/doctor/profile",Dtoken).then((res)=> {
            dispatch({type:GETDOCTORDETAIL,data1:res.data.data});
        })
    }
}



