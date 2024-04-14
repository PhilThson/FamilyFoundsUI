import { createSlice } from "@reduxjs/toolkit";
import { INotification, NotificationState } from "../models/Main";

const initState: NotificationState = {
  notification: undefined,
};

const uiSlice = createSlice({
  name: "ui",
  initialState: initState,
  reducers: {
    showNotification(state, action: { payload: INotification; type: string }) {
      state.notification = {
        status: action.payload.status,
        title: action.payload.title,
        message: action.payload.message,
      };
    },
    clearNotification(state) {
      state.notification = undefined;
    },
  },
});

export const uiSliceActions = uiSlice.actions;
export default uiSlice.reducer;
