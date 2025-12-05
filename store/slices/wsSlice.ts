import { createSlice } from '@reduxjs/toolkit';
import type { Client } from '@stomp/stompjs';

export const wsSlice = createSlice({
  name: 'ws',
  initialState: {
    stompClient: null as Client | null,
    connectionStatus: 'disconnected', // 'connecting', 'connected', 'disconnected', 'error'
  },
  reducers: {
    setStompClient: (state, action) => {
        state.stompClient = action.payload;
    },
    setConnectionStatus: (state, action) => {
        state.connectionStatus = action.payload;
    },
  },
});

export const { setStompClient, setConnectionStatus } = wsSlice.actions;
export default wsSlice.reducer;