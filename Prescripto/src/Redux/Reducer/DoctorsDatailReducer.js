import { GETDOCTORSDETAL } from "../Type/type";

const defaultState = {
    CompleteData: [],
};

export const DoctorsDatailReducer = (state = defaultState, action) => {
    switch (action.type) {
        case GETDOCTORSDETAL:
            return {
                ...state,  
                CompleteData: action.data,
            };
        default:
            return state;
    }
};
