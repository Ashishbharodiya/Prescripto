import axios from "axios"
import { GETDOCTORSDETAL, GETUSERDETAIL } from "../Type/type";


export const UserDetailAction = (token)=> {
    return  (dispatch )=> {
        axios.get("http://localhost:5000/api/user/Profile",token).then((res)=> {
            dispatch({type:GETUSERDETAIL,data1:res.data.data});
        })
    }
}

export const DoctorDetailAction = (Dtoken)=> {
    return  (dispatch )=> {
        axios.get("http://localhost:5000/api/doctor/profile",Dtoken).then((res)=> {
            dispatch({type:GETUSERDETAIL,data1:res.data.data});
        })
    }
}



