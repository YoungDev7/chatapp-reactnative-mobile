import { router } from "expo-router";
import { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useAppDispatch } from "@/store/hooks";
import { validateToken } from "@/store/slices/authSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          // Validate token with server
          await dispatch(validateToken()).unwrap();
          router.replace("/(tabs)/chats");
        } else {
          router.replace("/auth/login");
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        // Clear invalid token
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        router.replace("/auth/login");
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat App</Text>
      <ActivityIndicator size="large" color="#0066FF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
});
