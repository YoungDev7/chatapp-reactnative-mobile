import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit';
import api from '../../services/api';
import type { RootState } from '../store';

export interface Message {
  id?: string;
  text: string;
  senderName: string;
  senderUid: string;
  createdAt?: string | number;
}

export interface ChatView {
  id: string;
  title: string;
  isLoading: boolean;
  messages: Message[];
  error: string | null;
  lastSeenTimestamp?: number;
  unreadCount?: number;
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
    { rejectWithValue, getState }
  ) => {
    try {
      console.log('📤 Sending message to chatViewId:', chatViewId);
      
      // Log Redux auth state for debugging
      const state = getState() as any;
      console.log('Auth state:', {
        hasToken: !!state.auth.token,
        userUid: state.auth.user.uid,
        userName: state.auth.user.name
      });
      
      // Include createdAt timestamp as backend expects it
      const messagePayload = {
        text,
        createdAt: new Date().toISOString()
      };
      
      const response = await api.post(`/chatviews/${chatViewId}/messages`, messagePayload);
      console.log('✅ Message sent successfully:', response.data);
      return { chatViewId, message: response.data };
    } catch (error: unknown) {
      // Enhanced error logging for debugging 403 and other errors
      const axiosError = error as any;
      console.error('❌ Error sending message:', {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        message: axiosError.message,
        chatViewId,
        headers: axiosError.config?.headers
      });
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const responseData = (error && typeof error === 'object' && 'response' in error)
        ? (error as { response?: { data?: unknown } }).response?.data
        : undefined;
      return rejectWithValue(responseData || errorMessage);
    }
  }
);

/**
 * Async thunk to create a new chat view.
 */
export const createChatView = createAsyncThunk(
  'chatView/createChatView',
  async ({ name, userUids }: { name: string; userUids: string[] }, { rejectWithValue }) => {
    try {
      await api.post('/chatviews', { name, userUids });
      // No need to return anything - the chat list will be refreshed
    } catch (error: unknown) {
      console.error('Error creating chatview:', error);
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
        userAvatars: {} as Record<string, string>,
    },
    reducers: {
        setMessages: (state, action) => {
            const { id, messages } = action.payload;
            const view = state.chatViewCollection.find(v => v.id === id);
            if (view) {
                view.messages = messages;
            }
        },
        addMessage: (state, action) => {
            const { id, message } = action.payload;
            const view = state.chatViewCollection.find(v => v.id === id);
            if (view) {
                // Prevent duplicate messages
                const isDuplicate = view.messages.some(
                    m => m.id === message.id || 
                    (m.text === message.text && m.senderUid === message.senderUid && m.createdAt === message.createdAt)
                );
                if (!isDuplicate) {
                    view.messages.push(message);
                    // Increment unread count if user is not viewing this chat
                    view.unreadCount = (view.unreadCount || 0) + 1;
                }
            }
        },
        markChatAsRead: (state, action) => {
            const chatId = action.payload;
            const view = state.chatViewCollection.find(v => v.id === chatId);
            if (view) {
                view.unreadCount = 0;
                view.lastSeenTimestamp = Date.now();
            }
        },
        addChatView: (state, action) => {
            state.chatViewCollection.push({
                id: action.payload.id,
                title: action.payload.title,
                isLoading: false,
                messages: [],
                error: null,
                unreadCount: 0,
                lastSeenTimestamp: Date.now()
            });
        },
        addUserAvatars: (state, action) => {
            const userAvatarsObj = action.payload;
            Object.entries(userAvatarsObj).forEach(([userId, avatarUrl]) => {
                state.userAvatars[userId] = avatarUrl as string;
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
              // Map the backend response to ensure each chat view has required fields
              state.chatViewCollection = action.payload.map((chatView: any) => {
                  // Store user avatars for this chat view
                  if (chatView.userAvatars) {
                      Object.entries(chatView.userAvatars).forEach(([userId, avatarUrl]) => {
                          state.userAvatars[userId] = avatarUrl as string;
                      });
                  }
                  return {
                      id: chatView.id,
                      title: chatView.name || chatView.title || 'Untitled Chat',
                      isLoading: false,
                      messages: [],
                      error: null,
                      unreadCount: 0,
                      lastSeenTimestamp: Date.now()
                  };
              });
          })
          .addCase(fetchChatViews.rejected, (state, action) => {
              state.isLoadingChatViews = false;
              state.chatViewsError = action.error.message || 'Failed to fetch chat views';
          })

          // Fetch messages
          .addCase(fetchMessages.pending, (state, action) => {
              const chatViewId = action.meta.arg;
              let view = state.chatViewCollection.find(v => v.id === chatViewId);
              if (!view) {
                  // Create a placeholder chat view if it doesn't exist
                  view = {
                      id: chatViewId,
                      title: 'Loading...',
                      isLoading: true,
                      messages: [],
                      error: null,
                      unreadCount: 0,
                      lastSeenTimestamp: Date.now()
                  };
                  state.chatViewCollection.push(view);
              } else {
                  view.isLoading = true;
                  view.error = null;
              }
          })
          .addCase(fetchMessages.fulfilled, (state, action) => {
              const { chatViewId, messages } = action.payload;
              const view = state.chatViewCollection.find(v => v.id === chatViewId);
              if (view) {
                  view.messages = messages;
                  view.isLoading = false;
              }
          })
          .addCase(fetchMessages.rejected, (state, action) => {
              const chatViewId = action.meta.arg;
              const view = state.chatViewCollection.find(v => v.id === chatViewId);
              if (view) {
                  view.isLoading = false;
                  view.error = action.error.message || 'Failed to fetch messages';
              }
          })


          .addCase(sendMessage.pending, (state, action) => {

          })
          .addCase(sendMessage.fulfilled, (state, action) => {
              const { chatViewId, message } = action.payload;
              const view = state.chatViewCollection.find(v => v.id === chatViewId);
              if (view && message) {
                  // Check if message already exists (from WebSocket)
                  const exists = view.messages.some(m => m.id === message.id);
                  if (!exists) {
                      view.messages.push(message);
                  }
              }
          })
          .addCase(sendMessage.rejected, (state, action) => {
          });
    }
});

export const { setMessages, addMessage, markChatAsRead, addChatView, addUserAvatars } = chatViewSlice.actions;

// Selector to get chats sorted by most recent message
export const selectSortedChats = createSelector(
  [(state: RootState) => state.chatView.chatViewCollection],
  (chats) => {
    return [...chats].sort((a, b) => {
      const aLastMessage = a.messages.length > 0 
        ? a.messages[a.messages.length - 1] 
        : null;
      const bLastMessage = b.messages.length > 0 
        ? b.messages[b.messages.length - 1] 
        : null;
      
      // If both have messages, sort by createdAt (newest first)
      if (aLastMessage && bLastMessage) {
        const aTime = aLastMessage.createdAt 
          ? new Date(aLastMessage.createdAt).getTime() 
          : 0;
        const bTime = bLastMessage.createdAt 
          ? new Date(bLastMessage.createdAt).getTime() 
          : 0;
        return bTime - aTime; // Descending order (newest first)
      }
      
      // Chats with messages come before chats without
      if (aLastMessage && !bLastMessage) return -1;
      if (!aLastMessage && bLastMessage) return 1;
      
      // Both have no messages, maintain current order
      return 0;
    });
  }
);

export default chatViewSlice.reducer;