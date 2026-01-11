# Chat Application - Mobile

A cross-platform mobile chat application built with React Native and Expo. Features JWT authentication, real-time messaging, Material Design 3 UI components, and a modern mobile-first design with native platform capabilities.

## 🚀 Technologies Used

- **React Native 0.76+** - Cross-platform mobile framework
- **Expo SDK 52** - Development platform with managed workflow
- **TypeScript 5.x** - Type-safe development
- **Expo Router 4.x** - File-based navigation system
- **React Native Paper 5.x** - Material Design 3 UI components
- **Redux Toolkit** - Centralized state management
- **AsyncStorage** - Local data persistence
- **Axios** - HTTP client for API calls
- **SockJS + STOMP.js** - WebSocket real-time messaging
- **Expo Image Picker** - Camera and photo library access
- **Ionicons** - Vector icon library

## 📋 Features

- JWT-based authentication (login, register, token refresh)
- Real-time messaging via WebSocket/STOMP
- Chat list with search and sorting by recent messages
- Material Design 3 UI with dark theme
- User profile management with avatar upload
- Camera and photo library integration
- Message features:
  - User messages (right, blue) vs others (left, gray)
  - Avatar display with initials fallback
  - Large emoji display (≤3 emojis at 48px)
  - Timestamps above each message
  - Auto-scroll to newest messages
- Unread message indicators
- Tab-based navigation (Chats, Profile)
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
- Expo CLI
- iOS Simulator (macOS) or Android Studio (for emulators)
- Expo Go app (for physical devices)

### Development Setup

1. **Clone repository**
   ```bash
   git clone <mobile-repository-url> chatapp-reactnative-mobile
   cd chatapp-reactnative-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Create `config/api.ts` or use environment variables:
   ```typescript
   export const API_CONFIG = {
     BASE_URL: 'http://localhost:8080/api/v1',
     WS_URL: 'http://localhost:8080/ws'
   };
   ```

4. **Start development server**
   ```bash
   npx expo start
   ```

5. **Run on platform**
   - Press `w` for web browser
   - Press `i` for iOS Simulator (macOS only)
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go for physical device

## 📱 Testing on iOS Simulator (macOS Only)

### Quick Start

1. **Install Xcode**
   ```bash
   xcode-select --install
   sudo xcodebuild -license accept
   ```

2. **Launch Simulator**
   ```bash
   npx expo start
   # Press 'i' to open iOS Simulator
   ```

### Common Shortcuts
- **Reload**: Cmd+R
- **Developer Menu**: Cmd+D or Cmd+Ctrl+Z
- **Rotate Device**: Cmd+Left/Right Arrow
- **Toggle Keyboard**: Cmd+K
- **Home Button**: Cmd+Shift+H

### Testing Features
- **Photo Library**: Drag & drop images into simulator
- **Camera**: Not available (requires physical device)
- **Push Notifications**: Use Expo push tool
- **Debug Logs**: `npx react-native log-ios`

### Troubleshooting
```bash
# Clear cache
npx expo start --clear

# Reset simulator
xcrun simctl erase all
```

## 🏛️ Architecture

### Application Layers
```
React Native (JS/TS) → Expo Framework → Native Bridge → iOS/Android/Web
```

### Design Patterns
- **Flux/Redux** - Unidirectional data flow for state management
- **Component Composition** - Reusable UI components
- **File-based Routing** - Convention over configuration
- **Service Layer** - Separated business logic and API calls

### Why Expo + React Native?
- ✅ Single codebase for iOS, Android, Web
- ✅ Fast development with hot reload
- ✅ Large ecosystem and community
- ✅ OTA updates without app store
- ✅ Strong TypeScript support

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

## 💬 Messaging & Real-time

- **Message Fetching**: REST API `GET /chatviews/{id}/messages`
- **Message Sending**: REST API `POST /chatviews/{id}/messages` + WebSocket broadcast
- **Real-time Updates**: WebSocket/STOMP subscription to `/topic/chatview/{chatId}`
- **Optimistic Updates**: Messages shown instantly before server confirmation
- **Auto-scroll**: Inverted FlatList with newest messages at bottom

## 🔗 Backend Integration

### API Endpoints
- `POST /auth/register` - User registration
- `POST /auth/authenticate` - User login (returns JWT)
- `GET /chatviews` - List user's chats
- `GET /chatviews/{id}/messages` - Fetch messages
- `POST /chatviews/{id}/messages` - Send message
- `GET /users/me` - Get current user
- `PATCH /user/avatar` - Update avatar

### WebSocket
- **Connect**: `ws://localhost:8080/ws?token=<JWT>`
- **Subscribe**: `/topic/chatview/{chatId}` - Receive messages
- **Send**: `/app/chatview/{chatId}` - Send message

## 🚀 Deployment

### Production Builds

```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production

# Web
npm run build
npx serve dist
```

## 🐛 Troubleshooting

```bash
# Clear Metro cache
npx expo start --clear

# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules && npm install

# View iOS logs
npx react-native log-ios

# View Android logs
npx react-native log-android
```

### Common Issues
- **iOS Simulator not opening**: `xcode-select --install`
- **Android Emulator issues**: Check `adb devices`
- **Permission errors**: Check app permissions in device settings

## 🔗 Related Projects

- [Backend Repository](https://github.com/YoungDev7/chatapp-spring-backend) - Spring Boot backend
- [Frontend Repository](https://github.com/YoungDev7/chatapp-react-frontend) - React web frontend

---

**Note**: This mobile app is designed to work with the corresponding Spring Boot backend and shares feature parity with the React web frontend. Ensure the backend is running for full functionality.
