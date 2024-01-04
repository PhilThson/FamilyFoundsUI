import { createSlice } from "@reduxjs/toolkit";
import { Notification, NotificationState } from "../models/Main";

const initState: NotificationState = {
  notification: undefined,
};

const uiSlice = createSlice({
  name: "ui",
  initialState: initState,
  reducers: {
    showNotification(state, action: { payload: Notification; type: string }) {
      state.notification = {
        status: action.payload.status,
        title: action.payload.title,
        message: action.payload.message,
      };
    },
  },
});

export const uiSliceActions = uiSlice.actions;
export default uiSlice.reducer;
