import { router } from "expo-router";
import { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function Index() {
  useEffect(() => {
    // TODO: Check if user is authenticated
    // For now, redirect to login after 1 second
    const timeout = setTimeout(() => {
      router.replace("/login");
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

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
