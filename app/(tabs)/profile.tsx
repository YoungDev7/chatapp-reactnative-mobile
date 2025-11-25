import { router } from "expo-router";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/profile.styles";
import AvatarModal from "../../components/AvatarModal";
import { storageService } from "../../services/storageService";
import { authService } from "../../services/authService";

export default function ProfileScreen() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState({
    name: "Loading...",
    email: "Loading..."
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await storageService.getUser();
      if (userData) {
        setUser({
          name: userData.name || "Nothing",
          email: userData.email || "No email"
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleAvatarPress = () => {
    setModalVisible(true);
  };

  const handleAvatarSave = (uri: string) => {
    setAvatarUrl(uri);
    // TODO: Upload to backend
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centerContainer}>
          <View style={styles.card}>
            <View style={styles.avatarSection}>
              <View style={styles.avatarWrapper}>
                <View style={styles.avatarContainer}>
                  {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                  ) : (
                    <Ionicons name="person" size={60} color="#fff" />
                  )}
                </View>
                <TouchableOpacity 
                  style={styles.cameraButton}
                  onPress={handleAvatarPress}
                >
                  <Ionicons name="camera" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoSection}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Username</Text>
                <Text style={styles.infoValue}>{user.name}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email || 'Not provided'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={async () => {
                try {
                  await authService.logout();
                  await storageService.clearAuth();
                  router.replace("/login");
                } catch (error) {
                  console.error("Logout error:", error);
                  // Clear local storage even if backend call fails
                  await storageService.clearAuth();
                  router.replace("/login");
                }
              }}
            >
              <Ionicons name="log-out-outline" size={24} color="#ff4444" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <AvatarModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAvatarSave}
        currentAvatar={avatarUrl || undefined}
      />
    </View>
  );
}
