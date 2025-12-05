import { router } from "expo-router";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { TextInput, Button, Text, Surface } from "react-native-paper";
import { styles } from "../../styles/login.styles";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { loginLoading } = useAppSelector((state) => state.auth);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    dispatch(login({ email, password }))
      .unwrap()
      .then(() => {
        router.replace("/(tabs)/chats");
      })
      .catch((errorMessage) => {
        Alert.alert("Login Failed", errorMessage || "Login failed. Please check your credentials.");
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text variant="displaySmall" style={styles.title}>Login</Text>

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
            loading={loginLoading}
            disabled={loginLoading}
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
