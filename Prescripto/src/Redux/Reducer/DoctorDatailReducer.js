import { GETDOCTORDETAIL } from "../Type/type";

const defaultState = {
  GetDoctorDetail: [],
};

export const DoctorDatailReducer = (state = defaultState, action) => {
  switch (action.type) {
    case GETDOCTORDETAIL:
      return {
        ...state,
        GetDoctorDetail: [...action.data1],
      };

    default:
      return state;
  }
};
