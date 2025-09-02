import {configureStore} from "@reduxjs/toolkit"
import authReducer from "./authSlice.js"
import locationReducer from "./locationSlice.js"

const store = configureStore({
    reducer:{
        auth:authReducer,
        location:locationReducer
    }
})

export default store