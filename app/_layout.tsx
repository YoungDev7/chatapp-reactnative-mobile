import { Stack } from "expo-router";
import { store } from "../store/store";
import { PaperProvider, MD3DarkTheme } from "react-native-paper";
import { Provider } from "react-redux";
import { useEffect } from "react";
import notificationService from "../services/notificationService";

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#1976d2",
    background: "#181818",
    surface: "#1f1f1f",
  },
};

function RootLayoutContent() {
  useEffect(() => {
    notificationService.initialize().catch((error) => {
      console.error("Failed to initialize notifications:", error);
    });

    return () => {
      notificationService.cleanup();
    };
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="chat/[chatId]" options={{ headerShown: true }} />
      <Stack.Screen name="chat/new" options={{ headerShown: true }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <RootLayoutContent />
      </PaperProvider>
    </Provider>
  );
}

