import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    editObj:null
};

const editSlice = createSlice({
    name:"edit",
    initialState,
    reducers:{
        setEditObj:(state,action)=>{
            state.editObj = action.payload;
        },
    }
});

export const {setEditObj} = editSlice.actions;
export default editSlice.reducer;