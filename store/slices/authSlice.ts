import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';

/**
 * Async thunk to handle user login.
 * Sends login request to server and updates authentication state.
 */
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/authenticate', { email, password });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

/**
 * Async thunk to handle user registration.
 * Sends registration request to server.
 */
export const register = createAsyncThunk(
  'auth/register',
  async (
    { username, email, password }: { username: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

/**
 * Async thunk to validate the current authentication token.
 * 
 * Checks if a token exists in localStorage and validates it with the server.
 * Used during app initialization to verify existing authentication state.
 * 
 * @returns {Promise} Promise resolving to validation result or rejection with error
 */
export const validateToken = createAsyncThunk(
  'auth/validateToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error("no token found in storage");
      }
      await api.get('/auth/validate-token');
      
      // Load user data from storage to get avatar
      const userStr = await AsyncStorage.getItem('user');
      let avatarLink = null;
      if (userStr) {
        const user = JSON.parse(userStr);
        avatarLink = user.avatarLink || null;
      }
      
      return { token, avatarLink };

    } catch (error: unknown) {
      console.error("Error validating token", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const responseData = (error && typeof error === 'object' && 'response' in error) 
        ? (error as { response?: { data?: unknown } }).response?.data 
        : undefined;
      return rejectWithValue(responseData || errorMessage);
    }
  }
);

/**
 * Async thunk to handle user logout.
 * 
 * Sends logout request to server and clears authentication state.
 * Ensures cleanup even if server request fails.
 * 
 * @returns {Promise} Promise that always clears auth state regardless of server response
 */
export const handleLogout = createAsyncThunk(
  'auth/handleLogout',
  async(_, {dispatch} ) => {
    try{
      await api.post('/auth/logout');
      dispatch(clearAuth());
    }catch(error){
      console.error("logout error: " + error);
      dispatch(clearAuth());
    }
  }
);

const parseJWT = (token: string) => {
  try {
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));

    return {
      email: payload.sub,
      name: payload.name,
      uid: payload.uid
    };
    
  } catch (error: unknown) {
    throw new Error("Error parsing JWT token: " + (error instanceof Error ? error.message : String(error)));
  }
};

type User = {
  email: string | null;
  name: string | null;
  uid: string | null;
  avatarLink?: string | null;
}

type AuthState = {
  token: string | null;
  user: User;
  isValidating: boolean;
  loginError: string | null;
  loginLoading: boolean;
}

const updateUserFromToken = (state: AuthState, token: string | null) => {
  if (token) {
    try {
      state.user = { ...parseJWT(token), avatarLink: state.user.avatarLink };
    } catch (error) {
      console.error(error);
      state.user = { email: null, name: null, uid: null, avatarLink: null };
    }
  } else {
    state.user = { email: null, name: null, uid: null, avatarLink: null };
  }
};

const clearAuthState = (state: AuthState) => {
  state.token = null;
  state.user = { email: null, name: null, uid: null, avatarLink: null };
  state.isValidating = false;
  AsyncStorage.multiRemove(['accessToken', 'user']).catch(console.error);
};

/**
 * Authentication slice for managing user authentication state.
 * 
 * Manages:
 * - JWT access token storage and persistence
 * - User data extracted from JWT tokens
 * - Token validation and refresh logic
 * - Login/logout state management
 * - Authentication loading states
 * 
 * Features:
 * - Automatic token validation on app load
 * - localStorage persistence for tokens
 * - JWT parsing for user information extraction
 * - Logout with server notification
 */
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null as string | null,
    user: {
      email: null,
      name: null,
      uid: null,
      avatarLink: null
    },
    isValidating: false,
    loginError: null as string | null,
    loginLoading: false,
  },
  reducers: {
    setToken: (state, action) => {
      const newToken = action.payload;
      state.token = newToken;
      
      if (newToken) {
        AsyncStorage.setItem('accessToken', newToken).catch(console.error);
        updateUserFromToken(state, newToken);
        if (state.user.uid) {
          AsyncStorage.setItem('user', JSON.stringify(state.user)).catch(console.error);
        }
      } else {
        AsyncStorage.multiRemove(['accessToken', 'user']).catch(console.error);
      }
    },
    clearAuth: (state) => {
      clearAuthState(state);
    },
    setValidating: (state, action) => {
      state.isValidating = action.payload;
    },
    setUser: (state, action) => {
      const token = action.payload;
      updateUserFromToken(state, token);
    },
    setAvatar: (state, action) => {
      state.user.avatarLink = action.payload;
      if (state.user.uid) {
        AsyncStorage.setItem('user', JSON.stringify(state.user)).catch(console.error);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateToken.pending, (state) => {
        state.isValidating = true;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.isValidating = false;
        const { token, avatarLink } = action.payload;
        state.token = token;
        updateUserFromToken(state, token);
        if (avatarLink) {
          state.user.avatarLink = avatarLink;
        }
      })
      .addCase(validateToken.rejected, (state) => {
        clearAuthState(state);
      })

      .addCase(login.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.loginError = null;
        const token = action.payload.access_token;
        state.token = token;
        AsyncStorage.setItem('accessToken', token).catch(console.error);
        updateUserFromToken(state, token);
        if (state.user.uid) {
          AsyncStorage.setItem('user', JSON.stringify(state.user)).catch(console.error);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = (action.payload as string) || 'Login failed';
        clearAuthState(state);
      })

      .addCase(register.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loginLoading = false;
        state.loginError = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = (action.payload as string) || 'Registration failed';
      });
  }
});

export const { setToken, setUser, clearAuth, setValidating, setAvatar } = authSlice.actions;
export default authSlice.reducer;