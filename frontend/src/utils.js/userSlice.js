import { createSlice } from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:"user",
    initialState:{},
    reducers:{
        addUser:(state,action)=>{
            return {...action.payload}
        },
         updateUser: (state, action) => ({ ...state, ...action.payload }),
    }
})

export const{addUser,updateUser}=userSlice.actions
export default userSlice.reducer