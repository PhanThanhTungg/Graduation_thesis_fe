import { configureStore } from "@reduxjs/toolkit";

const dummyReducer = (state = {}, action: any) => state;

export const store = configureStore({
  reducer: {
    // Add your reducers here
    dummy: dummyReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;