import { router } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/profile.styles";
import AvatarModal from "../../components/AvatarModal";

export default function ProfileScreen() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  // TODO: Get user data from auth context/store
  const user = {
    name: "Username",
    email: "user@example.com"
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
              onPress={() => {
                // TODO: Implement logout logic (clear tokens, etc.)
                router.replace("/login");
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
