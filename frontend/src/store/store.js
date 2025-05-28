import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/index.js";


export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;