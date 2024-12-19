import { GETUSERDETAIL } from "../Type/type";

const defoultState = {
   GetUserDetail : [],
}


export const UserDatailReducer = (state=defoultState,action)=> {
        switch (action.type) {
            case GETUSERDETAIL:
                {
                  GetUserDetail:  state.GetUserDetail.push(action.data1)
                }
               return  {
                 GetUserDetail:state.GetUserDetail
               };
        
            default:
                return state;
        }
}