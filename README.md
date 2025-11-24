# Chat Application - Mobile

A cross-platform mobile chat application built with React Native and Expo. Features JWT authentication, real-time messaging via WebSocket, and a modern mobile-first design with native platform capabilities.

## 🚀 Technologies Used

- **React Native** - Cross-platform mobile framework
- **Expo SDK 54** - Development platform and tools
- **Expo Router 6** - File-based navigation
- **TypeScript** - Type-safe development
- **Expo Image Picker** - Camera and photo library access
- **Ionicons** - Native-looking icons

## 📋 Features

- User registration and login with JWT authentication
- Real-time messaging via WebSocket/STOMP
- Tab-based navigation (Chats, Profile)
- User profile with avatar upload
- Camera and photo library integration
- Chat list with search functionality
- Splash screen with auto-redirect
- Type-safe codebase with TypeScript
- Cross-platform support (iOS, Android, Web)

## 🏗️ Project Structure

```
app/
├── (tabs)/                      # Tab-based screens (protected)
│   ├── _layout.tsx             # Tab navigation layout
│   ├── index.tsx               # Chats list screen
│   └── profile.tsx             # User profile screen
├── styles/
│   └── profile.styles.ts       # Profile screen styles
├── _layout.tsx                 # Root navigation layout
├── index.tsx                   # Splash/loading screen
├── login.tsx                   # Login screen
└── register.tsx                # Registration screen

components/
├── AvatarModal.tsx             # Photo upload modal
└── AvatarModal.styles.ts       # Avatar modal styles

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

## 💬 Real-time Messaging (Planned)

The application will use WebSocket/STOMP for real-time communication:

- Connection setup on app launch
- Messages sent to `/app/chat` endpoint
- Real-time updates received from `/topic/messages`
- Automatic reconnection on network changes

## 📱 Key Features

### Profile Screen

Located in [`app/(tabs)/profile.tsx`](<app/(tabs)/profile.tsx>):

- User information display
- Avatar with photo upload capability
- Profile editing (in progress)
- Logout functionality

### Avatar Upload Modal

Component in [`components/AvatarModal.tsx`](components/AvatarModal.tsx):

- Camera capture with expo-image-picker
- Photo library selection
- Image preview before save
- Permission handling for camera and media library
- Image cropping (square aspect ratio)

### Chat List

Located in [`app/(tabs)/index.tsx`](<app/(tabs)/index.tsx>):

- Search functionality
- Real-time chat updates
- Mock data structure ready for backend integration
- Pull-to-refresh support

## 🎨 Styling

- **StyleSheet API** - React Native styling system
- **Separate style files** - Component-specific `.styles.ts` files
- **Dark theme** - Consistent dark color scheme
  - Main background: `#1a1a1a`
  - Secondary background: `#2a2a2a`
  - Accent color: `#0066FF`
  - Text: `#ffffff`
- **Responsive design** - Adapts to different screen sizes

## 📋 Dependencies

### Production Dependencies

- `expo` - Expo framework (v54)
- `expo-router` - File-based navigation (v6)
- `react-native` - React Native framework
- `expo-image-picker` - Camera and photo library access
- `@expo/vector-icons` - Icon library
- `react-native-safe-area-context` - Safe area handling
- `react-native-screens` - Native navigation primitives

### Development Dependencies

- `typescript` - TypeScript compiler
- `@babel/core` - JavaScript compiler
- `eslint` - Code linting
- Various type definitions (`@types/*`)

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
