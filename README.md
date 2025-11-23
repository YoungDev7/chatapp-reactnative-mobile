# Chat Mobile App

A React Native mobile chat application built with Expo Router.

## Project Structure

```
app/
├── (tabs)/              # Main app screens (protected)
│   ├── _layout.tsx     # Tab navigation layout
│   ├── index.tsx       # Chats list screen
│   └── profile.tsx     # User profile screen
├── _layout.tsx         # Root layout
├── index.tsx           # Splash/loading screen
├── login.tsx           # Login screen
└── register.tsx        # Registration screen
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npx expo start
```

3. Run on different platforms:
   - Press `w` to open in web browser
   - Press `i` to open in iOS Simulator
   - Press `a` to open in Android Emulator
   - Scan QR code with Expo Go app on your phone

## Features

### Authentication

- Login screen with username/password
- Registration screen with validation
- Splash screen with auto-redirect

### Chat

- Chat list view with search functionality
- Mock chat data structure ready for backend integration

### Profile

- User profile display
- Settings menu structure
- Logout functionality

## TODO

- [ ] Implement actual authentication API calls
- [ ] Add WebSocket connection for real-time messaging
- [ ] Create individual chat view screen
- [ ] Add message sending functionality
- [ ] Implement user avatar upload
- [ ] Add push notifications
- [ ] Store authentication state (AsyncStorage or SecureStore)
- [ ] Add loading states and error handling
- [ ] Implement profile editing
- [ ] Add chat creation functionality

## Tech Stack

- React Native
- Expo Router (file-based routing)
- TypeScript
- Expo Vector Icons (Ionicons)
