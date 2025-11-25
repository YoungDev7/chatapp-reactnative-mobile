import { Stack } from "expo-router";
import { PaperProvider, MD3DarkTheme } from "react-native-paper";

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#1976d2",
    background: "#181818",
    surface: "#1f1f1f",
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="chat/[chatId]" options={{ headerShown: true }} />
      </Stack>
    </PaperProvider>
  );
}
