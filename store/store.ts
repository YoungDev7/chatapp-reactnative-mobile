import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import wsSlice from './slices/wsSlice';
import chatViewSlice from './slices/chatViewSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ws: wsSlice,
    chatView: chatViewSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'ws/setStompClient'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;