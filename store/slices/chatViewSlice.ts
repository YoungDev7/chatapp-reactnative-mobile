import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface Message {
  id?: string;
  text: string;
  senderName: string;
  senderAvatar?: string;
  createdAt?: string | number;
}

export interface ChatView {
  viewId: number;
  title: string;
  isLoading: boolean;
  messages: Message[];
  error: string | null;
}

/**
 * Async thunk to fetch all chat views.
 */
export const fetchChatViews = createAsyncThunk(
  'chatView/fetchChatViews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/chatviews');
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching chat views:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const responseData = (error && typeof error === 'object' && 'response' in error)
        ? (error as { response?: { data?: unknown } }).response?.data
        : undefined;
      return rejectWithValue(responseData || errorMessage);
    }
  }
);

/**
 * Async thunk to send a message to a chat view.
 */
export const sendMessage = createAsyncThunk(
  'chatView/sendMessage',
  async (
    { chatViewId, text }: { chatViewId: string; text: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/chatviews/${chatViewId}/messages`, { text });
      return { chatViewId, message: response.data };
    } catch (error: unknown) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const responseData = (error && typeof error === 'object' && 'response' in error)
        ? (error as { response?: { data?: unknown } }).response?.data
        : undefined;
      return rejectWithValue(responseData || errorMessage);
    }
  }
);

/**
 * Async thunk to fetch messages from the API.
 * Currently fetches all messages but is designed to support fetching messages for specific chat views.
 * 
 * @async
 * @function fetchMessages
 * @param {*} _ - Unused parameter (placeholder for future chatViewID parameter)
 * @param {Object} thunkAPI - Redux Toolkit thunk API object
 * @param {Function} thunkAPI.rejectWithValue - Function to return rejected value on error
 * @returns {Promise<Array>} Promise that resolves to array of message objects
 * @throws {Object} Returns rejected value with error data or message
 */
export const fetchMessages = createAsyncThunk(
    'chatView/fetchMessages',
  async (chatViewId: string = '1', { rejectWithValue }) => {
    try {
      const response = await api.get(`/chatviews/${chatViewId}/messages`);
      return { 
        chatViewId, 
        messages: response.data 
      };
    } catch (error: unknown) {
      console.error('Error fetching messages:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const responseData = (error && typeof error === 'object' && 'response' in error) 
        ? (error as { response?: { data?: unknown } }).response?.data 
        : undefined;
      return rejectWithValue(responseData || errorMessage);
    }
  }
);

// Unused for now, left for future use
/*
const _fetchChatViews = createAsyncThunk(
  'chatView/fetchChatViews',
  async () => {
    try {
      const response = await api.get('/chatViews');
      if(response.status === 200) {
        return response.data;
      }
    }catch (error) {
      console.error("error fetching chatViews:", error)
    }
  }
)
*/

/**
 * Redux slice for managing chat view state.
 * Handles a collection of chat views, each containing messages, loading state, and error state.
 * Currently operates primarily on the first chat view (index 0) but is structured to support multiple views.
 * 
 * @namespace chatViewSlice
 */
const chatViewSlice = createSlice({
    name: 'chatView',
    initialState: {
        chatViewCollection: [] as ChatView[],
        isLoadingChatViews: false,
        chatViewsError: null as string | null,
    },
    reducers: {
        setMessages: (state, action) => {
            const { viewId, messages } = action.payload;
            const view = state.chatViewCollection.find(v => v.viewId === viewId);
            if (view) {
                view.messages = messages;
            }
        },
        addMessage: (state, action) => {
            const { viewId, message } = action.payload;
            const view = state.chatViewCollection.find(v => v.viewId === viewId);
            if (view) {
                view.messages.push(message);
            }
        },
        addChatView: (state, action) => {
            state.chatViewCollection.push({
                viewId: action.payload.viewId,
                title: action.payload.title,
                isLoading: false,
                messages: [],
                error: null
            });
        }
    },
    extraReducers: (builder) => {
      builder
          // Fetch chat views
          .addCase(fetchChatViews.pending, (state) => {
              state.isLoadingChatViews = true;
              state.chatViewsError = null;
          })
          .addCase(fetchChatViews.fulfilled, (state, action) => {
              state.isLoadingChatViews = false;
              state.chatViewCollection = action.payload;
          })
          .addCase(fetchChatViews.rejected, (state, action) => {
              state.isLoadingChatViews = false;
              state.chatViewsError = action.error.message || 'Failed to fetch chat views';
          })

          // Fetch messages
          .addCase(fetchMessages.pending, (state, action) => {
              const chatViewId = action.meta.arg;
              const view = state.chatViewCollection.find(v => v.viewId === Number(chatViewId));
              if (view) {
                  view.isLoading = true;
                  view.error = null;
              }
          })
          .addCase(fetchMessages.fulfilled, (state, action) => {
              const { chatViewId, messages } = action.payload;
              const view = state.chatViewCollection.find(v => v.viewId === Number(chatViewId));
              if (view) {
                  view.messages = messages;
                  view.isLoading = false;
              }
          })
          .addCase(fetchMessages.rejected, (state, action) => {
              const chatViewId = action.meta.arg;
              const view = state.chatViewCollection.find(v => v.viewId === Number(chatViewId));
              if (view) {
                  view.isLoading = false;
                  view.error = action.error.message || 'Failed to fetch messages';
              }
          })

          // Send message
          .addCase(sendMessage.fulfilled, (state, action) => {
              const { chatViewId, message } = action.payload;
              const view = state.chatViewCollection.find(v => v.viewId === Number(chatViewId));
              if (view) {
                  view.messages.push(message);
              }
          });
    }
});

export const { setMessages, addMessage, addChatView } = chatViewSlice.actions;
export default chatViewSlice.reducer;