# Chat Application - Mobile

A cross-platform mobile chat application built with React Native and Expo. Features JWT authentication, real-time messaging, Material Design 3 UI components, and a modern mobile-first design with native platform capabilities.

## 🚀 Technologies Used

- **React Native** - Cross-platform mobile framework
- **Expo SDK 54** - Development platform and tools
- **Expo Router 6** - File-based navigation
- **React Native Paper** - Material Design 3 components
- **TypeScript** - Type-safe development
- **Expo Image Picker** - Camera and photo library access
- **Ionicons** - Native-looking icons
- **AsyncStorage** - Local data persistence

## 📋 Features

- User registration and login with JWT authentication
- Real-time chat messaging with message history
- Material Design 3 UI with React Native Paper
- Advanced message display:
  - User messages on right (blue), others on left (gray)
  - Avatar display for other users with initials fallback
  - Large emoji display (≤3 emojis shown at 48px without bubble)
  - Proper chat scrolling (inverted FlatList)
- Tab-based navigation (Chats, Profile)
- User profile with avatar upload and editing
- Camera and photo library integration
- Chat list with search functionality
- Chat input with emoji button and send button
- Splash screen with auto-redirect
- Type-safe codebase with TypeScript
- Cross-platform support (iOS, Android, Web)

## 🏗️ Project Structure

```
app/
├── (tabs)/                      # Tab-based screens (protected)
│   ├── _layout.tsx             # Tab navigation layout
│   ├── index.tsx               # Chats list screen (chats.tsx)
│   └── profile.tsx             # User profile screen
├── chat/
│   └── [chatId].tsx            # Dynamic chat view screen
├── _layout.tsx                 # Root navigation layout
├── index.tsx                   # Splash/loading screen
├── login.tsx                   # Login screen
└── register.tsx                # Registration screen

components/
├── chat/
│   ├── ChatInput.tsx           # Message input component
│   └── ChatMessage.tsx         # Message display component
├── styles/
│   ├── ChatInput.styles.ts    # Chat input styles
│   └── profile.styles.ts      # Profile screen styles
└── AvatarModal.tsx            # Photo upload modal

services/
├── authService.ts              # Authentication API calls
├── chatService.ts              # Chat and messaging API calls
└── storageService.ts           # AsyncStorage wrapper

styles/
├── chatView.styles.ts          # Chat view screen styles
└── index.css                   # Global styles

types/
├── chatMessage.ts              # Message type definitions
└── custom.d.ts                 # Custom type declarations

utils/
├── chatHelpers.ts              # Chat utility functions
└── emojiHelper.ts              # Emoji detection and validation

Configuration Files:
├── app.json                    # Expo configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── expo-env.d.ts              # Expo environment types
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v22 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Studio (for emulators)
- Expo Go app (for physical device testing)

### Development Setup

1. **Clone the repository structure**

   ```bash
   # Create parent directory
   mkdir chat-application
   cd chat-application

   # Clone all repositories
   git clone <mobile-repository-url> chatapp-reactnative-mobile
   git clone <frontend-repository-url> chatapp-react-frontend
   git clone <backend-repository-url> chatapp-spring-backend
   ```

2. **Install dependencies**

   ```bash
   cd chatapp-reactnative-mobile
   npm install
   ```

3. **Environment Configuration**

   ```bash
   # Copy example environment file (if available)
   cp .env.example .env
   ```

   Configure the following variables in `.env`:

   ```env
   EXPO_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
   EXPO_PUBLIC_WS_BASE_URL=http://localhost:8080/ws
   ```

4. **Start development server**

   ```bash
   npx expo start
   ```

5. **Run on different platforms**
   - Press `w` to open in web browser
   - Press `i` to open in iOS Simulator (Mac only)
   - Press `a` to open in Android Emulator
   - Scan QR code with Expo Go app on your physical device

### Verify Installation

- Web: `http://localhost:8081`
- iOS Simulator: Press `i` in terminal
- Android Emulator: Press `a` in terminal
- Physical Device: Scan QR code with Expo Go

## 🔧 Configuration

### Expo Configuration

App configuration in [`app.json`](app.json):

```json
{
  "expo": {
    "name": "chatapp",
    "slug": "chatapp",
    "version": "1.0.0",
    "platforms": ["ios", "android", "web"]
  }
}
```

### Navigation Structure

File-based routing with Expo Router:

- **Root Stack** (`app/_layout.tsx`) - Authentication flow
- **Tab Navigator** (`app/(tabs)/_layout.tsx`) - Main app screens
- **Dynamic Routes** - Supports nested navigation patterns

## 🔐 Authentication Flow

1. User opens app → Splash screen (`app/index.tsx`)
2. Auto-redirect to login if not authenticated
3. User logs in via `app/login.tsx` or registers via `app/register.tsx`
4. JWT tokens received and stored (AsyncStorage/SecureStore)
5. Navigate to protected tab screens
6. Automatic token refresh on expiration

## 💬 Messaging Architecture

The application communicates with the Spring Boot backend for messaging:

- **Message Fetching**: REST API `GET /chatviews/{id}/messages`
- **Message Sending**: Currently using REST API (backend WebSocket integration pending)
- **Message Display**: 
  - Inverted FlatList for chat-like scrolling
  - Messages sorted with newest at bottom
  - Auto-scroll to latest messages on load
- **Future Enhancement**: WebSocket/STOMP for real-time updates (matching web frontend)

## 📱 Key Features

### Chat View Screen

Located in [`app/chat/[chatId].tsx`](app/chat/[chatId].tsx):

- **Message Display**:
  - User messages aligned right with blue background (#1976d2)
  - Other users' messages aligned left with gray background (#4c4c4c)
  - Avatar display (32x32) for other users with initials fallback
  - Sender name labels ("you" for current user)
  - Large emoji display (≤3 emojis: 48px, transparent background)
  - Inverted FlatList for proper chat scrolling behavior
- **Chat Input** (separate component):
  - Material Design text input with dark theme
  - Emoji button inside input field
  - Square send button (44x44) with proper sizing
  - Loading state during message sending
- **Backend Integration**:
  - Fetches messages from REST API
  - JWT authentication with Bearer tokens
  - Error handling and loading states

### Chat Input Component

Component in [`components/chat/ChatInput.tsx`](components/chat/ChatInput.tsx):

- Reusable message input component
- Integrated emoji button (placeholder for future emoji picker)
- Send button with disabled/sending states
- Matches web frontend design patterns
- Separate style file for maintainability

### Emoji Detection

Utility in [`utils/emojiHelper.ts`](utils/emojiHelper.ts):

- `isOnlyEmojis()` - Checks if text contains only emojis
- `countEmojis()` - Counts emoji characters in text
- `shouldDisplayAsLargeEmoji()` - Returns true if ≤3 emojis only
- Used for special large emoji display in messages

### Chat Helpers

Utility in [`utils/chatHelpers.ts`](utils/chatHelpers.ts):

- `loadCurrentUser()` - Loads user info from storage
- `fetchMessages()` - Fetches and reverses messages for display
- `sendMessage()` - Sends message to chat via API
- Centralized error handling and logging

### Profile Screen

Located in [`app/(tabs)/profile.tsx`](<app/(tabs)/profile.tsx>):

- User information display
- Avatar with photo upload capability
- Profile editing functionality
- Logout with token cleanup

### Avatar Upload Modal

Component in [`components/AvatarModal.tsx`](components/AvatarModal.tsx):

- Camera capture with expo-image-picker
- Photo library selection
- Image preview before save
- Permission handling for camera and media library
- Image cropping (square aspect ratio)

### Chat List

Located in [`app/(tabs)/index.tsx`](<app/(tabs)/index.tsx>):

- List of user's active chats
- Search functionality
- Navigation to individual chat views
- FAB (Floating Action Button) for creating new chats
- Backend integration with JWT auth

## 🎨 Styling

- **React Native Paper** - Material Design 3 components
- **StyleSheet API** - React Native styling system
- **Separate style files** - Component-specific `.styles.ts` files
- **Dark theme** - Consistent dark color scheme
  - Main background: `#181818`
  - Secondary background: `#1f1f1f`
  - Chat input background: `#424242`
  - User message bubble: `#1976d2` (blue)
  - Other message bubble: `#4c4c4c` (gray)
  - Text: `#ffffff`
- **Message styling**:
  - Message containers with 70% max width
  - Rounded corners (borderRadius 12)
  - Avatar circles (32x32) with centered initials
  - Large emoji text (48px) without background
- **Responsive design** - Adapts to different screen sizes

## 📋 Dependencies

### Production Dependencies

- `expo` - Expo framework (v54)
- `expo-router` - File-based navigation (v6)
- `react-native` - React Native framework
- `react-native-paper` - Material Design 3 components
- `expo-image-picker` - Camera and photo library access
- `@expo/vector-icons` - Icon library
- `react-native-safe-area-context` - Safe area handling
- `react-native-screens` - Native navigation primitives
- `@react-native-async-storage/async-storage` - Local storage
- `axios` - HTTP client for API calls

### Development Dependencies

- `typescript` - TypeScript compiler
- `@babel/core` - JavaScript compiler
- `eslint` - Code linting
- Various type definitions (`@types/*`)

## 🔗 Backend Integration

The mobile app connects to the Spring Boot backend:

- **Base URL**: Configure in environment or hardcoded in services
- **Authentication**: JWT Bearer tokens stored in AsyncStorage
- **Endpoints Used**:
  - `POST /auth/register` - User registration
  - `POST /auth/login` - User login
  - `GET /chatviews` - List user's chats
  - `GET /chatviews/{id}/messages` - Fetch chat messages
  - `POST /chatviews/{id}/messages` - Send message (pending backend support)
  - `GET /users/me` - Get current user info
  - `PUT /users/me` - Update user profile

### Known Issues

- **Message Sending**: Backend currently only supports WebSocket for sending messages, but mobile app uses REST API. Either:
  - Backend needs REST POST endpoint for `/chatviews/{id}/messages`
  - Mobile app needs WebSocket/STOMP implementation (like web frontend)

## 🚀 Deployment

### Build for Production

#### iOS

```bash
# Development build
eas build --platform ios --profile development

# Production build
eas build --platform ios --profile production
```

#### Android

```bash
# Development build
eas build --platform android --profile development

# Production build (APK)
eas build --platform android --profile production
```

#### Web

```bash
npm run build
npx serve dist
```

### App Stores

- **Apple App Store**: Follow iOS build process and submit via App Store Connect
- **Google Play Store**: Generate signed APK/AAB and submit via Play Console

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler cache issues**

   ```bash
   npx expo start --clear
   ```

2. **iOS Simulator not opening**

   - Ensure Xcode is installed (Mac only)
   - Check Xcode command line tools: `xcode-select --install`

3. **Android Emulator issues**

   - Verify Android Studio installation
   - Check emulator is running: `adb devices`

4. **Module resolution errors**

   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`

5. **Image picker permissions**
   - Check app permissions in device settings
   - Ensure permission requests are in app.json

### Debug Mode

Enable remote debugging:

- Shake device/emulator to open developer menu
- Select "Debug Remote JS"
- Or press `j` in Expo terminal

## 📚 Documentation

Additional documentation available in related repositories:

- [Backend Documentation](https://github.com/YoungDev7/chatapp-spring-backend) - API integration guides
- [Frontend Documentation](https://github.com/YoungDev7/chatapp-react-frontend) - Web UI patterns

## 🔗 Related Projects

- [Backend Repository](https://github.com/YoungDev7/chatapp-spring-backend) - Spring Boot backend
- [Frontend Repository](https://github.com/YoungDev7/chatapp-react-frontend) - React web frontend

---

**Note**: This mobile app is designed to work with the corresponding Spring Boot backend and shares feature parity with the React web frontend. Ensure the backend is running for full functionality.
