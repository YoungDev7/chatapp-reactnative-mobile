import { router } from "expo-router";
import { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { TextInput, Button, Text, Surface } from "react-native-paper";
import { styles } from "../../styles/login.styles";
import { authService } from "../../services/authService";
import { storageService } from "../../services/storageService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(email, password);
      console.log("Login successful:", response);
      
      // Store token
      if (response.access_token) {
        await storageService.saveToken(response.access_token);
        const tokenParts = response.access_token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        
        await storageService.saveUser({
          email: payload.sub || email,
          name: payload.name || email.split('@')[0],
          uid: payload.uid
        });
      }
      
      router.replace("/(tabs)/chats");
    } catch (error: any) {
      console.error("Login failed:", error);
      const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text variant="displaySmall" style={styles.title}>Login</Text>
        {/* <Text variant="bodyLarge" style={styles.subtitle}>Sign in to continue</Text> */}

        <Surface style={styles.form} elevation={0}>
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
            right={
              <TextInput.Icon 
                icon={showPassword ? "eye-off" : "eye"} 
                color="#999" 
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          <Button 
            mode="contained" 
            onPress={handleLogin}
            style={styles.button}
            buttonColor="#1976d2"
            contentStyle={styles.buttonContent}
            loading={loading}
            disabled={loading}
          >
            Login
          </Button>

          <Button 
            mode="text" 
            onPress={() => router.push("/auth/register")}
            textColor="#1976d2"
          >
            Don&apos;t have an account? Sign up
          </Button>
        </Surface>
      </View>
    </KeyboardAvoidingView>
  );
}
