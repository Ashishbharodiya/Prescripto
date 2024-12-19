import { combineReducers } from "redux";
import { UserDatailReducer } from "./UserDatailReducer";
import { DoctorsDatailReducer } from "./DoctorsDatailReducer";
import { DoctorDatailReducer } from "./DoctorDatailReducer";








export const rootReducer = combineReducers({
    userDetail: UserDatailReducer,
    doctorsDetail: DoctorsDatailReducer,
    DoctorDetail: DoctorDatailReducer  // Ensure this matches the state name you're accessing in the component
});
