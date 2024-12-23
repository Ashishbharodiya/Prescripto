import axios from "axios"
import { GETDOCTORSDETAL, GETUSERDETAIL } from "../Type/type";


export const UserDetailAction = (token)=> {
    return  (dispatch )=> {
        axios.get("https://prescripto-3-ry9r.onrender.com/api/user/Profile",token).then((res)=> {
            dispatch({type:GETUSERDETAIL,data1:res.data.data});
        })
    }
}

export const DoctorDetailAction = (Dtoken)=> {
    return  (dispatch )=> {
        axios.get("https://prescripto-3-ry9r.onrender.com/api/doctor/profile",Dtoken).then((res)=> {
            dispatch({type:GETUSERDETAIL,data1:res.data.data});
        })
    }
}



