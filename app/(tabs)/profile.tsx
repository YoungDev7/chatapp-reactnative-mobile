import { router } from "expo-router";
import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/profile.styles";
import AvatarModal from "../../components/AvatarModal";
import { handleLogout, setAvatar } from "@/store/slices/authSlice";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import api from "@/services/api";

export default function ProfileScreen() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await api.get('/user/avatar');
        if (response.data?.avatarLink) {
          setAvatarUrl(response.data.avatarLink);
          dispatch(setAvatar(response.data.avatarLink));
        }
      } catch (error: any) {
        // Silent error for missing avatars
      }
    };

    if (user.uid) {
      if (user.avatarLink) {
        setAvatarUrl(user.avatarLink);
      } else {
        fetchAvatar();
      }
    }
  }, [user.uid, user.avatarLink, dispatch]);

  const handleAvatarPress = () => {
    setModalVisible(true);
  };

  const handleAvatarSave = async (uri: string) => {
    setLoading(true);
    try {
      await api.patch('/user/avatar', { avatarLink: uri });
      setAvatarUrl(uri);
      dispatch(setAvatar(uri));
      Alert.alert("Success", "Avatar updated successfully!");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update avatar. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Ionicons name="camera" size={20} color="white" />
                  )}
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
                  await dispatch(handleLogout()).unwrap();
                  router.replace("/auth/login");
                } catch (error) {
                  router.replace("/auth/login");
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
