import { useState } from "react";
import {
  Modal,
  View,
  Image,
  Alert,
} from "react-native";
import { Button, Text, IconButton, TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/styles/AvatarModal.styles";
import { AvatarModalProps } from "@/types/avatarModal";

export default function AvatarModal({
  visible,
  onClose,
  onSave,
  currentAvatar,
}: AvatarModalProps) {
  const [imageUrl, setImageUrl] = useState<string>(currentAvatar || "");
  const [isValidUrl, setIsValidUrl] = useState<boolean>(true);

  const validateUrl = (url: string) => {
    if (!url.trim()) {
      setIsValidUrl(true);
      return;
    }
    try {
      const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|bmp)(\?.*)?$/i;
      setIsValidUrl(urlPattern.test(url));
    } catch {
      setIsValidUrl(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    validateUrl(url);
  };

  const handleSave = () => {
    if (imageUrl.trim() && isValidUrl) {
      onSave(imageUrl);
      onClose();
    } else if (!imageUrl.trim()) {
      Alert.alert("Error", "Please enter an image URL");
    } else {
      Alert.alert("Error", "Please enter a valid image URL (jpg, jpeg, png, gif, webp, bmp)");
    }
  };

  const handleRemove = () => {
    setImageUrl("");
    setIsValidUrl(true);
  };

  const handleClose = () => {
    setImageUrl(currentAvatar || "");
    setIsValidUrl(true);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text variant="titleLarge" style={styles.title}>Change Avatar</Text>
            <IconButton
              icon="close"
              iconColor="white"
              size={24}
              onPress={handleClose}
            />
          </View>

          <View style={styles.content}>
            <View style={styles.previewContainer}>
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.preview} />
              ) : (
                <View style={styles.placeholderAvatar}>
                  <Ionicons name="person" size={60} color="#fff" />
                </View>
              )}
            </View>

            <TextInput
              mode="outlined"
              label="Image URL"
              value={imageUrl}
              onChangeText={handleUrlChange}
              placeholder="https://example.com/image.jpg"
              error={!isValidUrl}
              style={styles.input}
              outlineColor="#424242"
              activeOutlineColor="#1976d2"
              textColor="white"
              placeholderTextColor="#999"
              theme={{ colors: { onSurfaceVariant: '#999' } }}
            />

            {!isValidUrl && (
              <Text style={styles.errorText}>
                Please enter a valid image URL (jpg, jpeg, png, gif, webp, bmp)
              </Text>
            )}

            <View style={styles.buttonGroup}>
              {imageUrl && (
                <Button
                  mode="outlined"
                  icon="delete"
                  onPress={handleRemove}
                  style={styles.removeButton}
                  textColor="#FF3B30"
                >
                  Clear
                </Button>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              mode="text"
              onPress={handleClose}
              style={styles.footerButton}
              textColor="#999"
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              disabled={!imageUrl.trim() || !isValidUrl}
              style={styles.footerButton}
              buttonColor="#1976d2"
            >
              Save
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
