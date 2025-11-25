import { router } from "expo-router";
import { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { TextInput, Button, Text, Surface } from "react-native-paper";
import { styles } from "./styles/register.styles";
import { authService } from "../services/authService";
// import { storageService } from "../services/storageService";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await authService.register({ username, email, password });
      Alert.alert("Success", "Registration successful! Please login.");
      router.replace("/login");
    } catch (error: any) {
      console.error("Registration failed:", error);
      const errorMessage = error.response?.data || "Registration failed. Please try again.";
      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text variant="displaySmall" style={styles.title}>Create Account</Text>
          {/* <Text variant="bodyLarge" style={styles.subtitle}>Sign up to get started</Text> */}

          <Surface style={styles.form} elevation={0}>
            <TextInput
              mode="outlined"
              label="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              style={styles.input}
              outlineColor="#424242"
              activeOutlineColor="#1976d2"
              textColor="white"
              theme={{ colors: { onSurfaceVariant: '#999' } }}
              disabled={loading}
            />

            <TextInput
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              outlineColor="#424242"
              activeOutlineColor="#1976d2"
              textColor="white"
              theme={{ colors: { onSurfaceVariant: '#999' } }}
              disabled={loading}
            />

            <TextInput
              mode="outlined"
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.input}
              outlineColor="#424242"
              activeOutlineColor="#1976d2"
              textColor="white"
              theme={{ colors: { onSurfaceVariant: '#999' } }}
              disabled={loading}
              right={
                <TextInput.Icon 
                  icon={showPassword ? "eye-off" : "eye"} 
                  color="#999" 
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            <TextInput
              mode="outlined"
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              style={styles.input}
              outlineColor="#424242"
              activeOutlineColor="#1976d2"
              textColor="white"
              theme={{ colors: { onSurfaceVariant: '#999' } }}
              disabled={loading}
              right={
                <TextInput.Icon 
                  icon={showConfirmPassword ? "eye-off" : "eye"} 
                  color="#999" 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />

            <Button 
              mode="contained" 
              onPress={handleRegister}
              style={styles.button}
              buttonColor="#1976d2"
              textColor="white"
              contentStyle={styles.buttonContent}
              loading={loading}
              disabled={loading}
            >
              Sign Up
            </Button>

            <Button 
              mode="text" 
              onPress={() => router.back()}
              textColor="#1976d2"
            >
              Already have an account? Login
            </Button>
          </Surface>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
