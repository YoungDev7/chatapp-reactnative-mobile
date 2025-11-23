import { router } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // TODO: Implement login logic
    console.log("Login:", username, password);
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#666"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.link}>
              Don t have an account? <Text style={styles.linkBold}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    marginBottom: 40,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: "white",
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    backgroundColor: "#0066FF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
  linkBold: {
    color: "#0066FF",
    fontWeight: "600",
  },
});
