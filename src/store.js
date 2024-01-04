import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import podcastReducer from "./slices/podcastsSlice";
import editReducer from "./slices/editSlice"

export default configureStore({
    reducer:{
        user:userReducer,
        podcasts:podcastReducer,
        edit:editReducer
    }
})