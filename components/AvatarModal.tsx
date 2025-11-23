import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: Math.min(360, width - 40),
    backgroundColor: "#1c1c1e",
    borderRadius: 12,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 8,
  },
  content: {
    marginTop: 12,
    alignItems: "center",
  },
  previewContainer: {
    marginBottom: 16,
  },
  preview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#333",
  },
  placeholderAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#666",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonGroup: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
  },
  removeButton: {
    backgroundColor: "#fff",
  },
  removeButtonText: {
    color: "#FF3B30",
    marginLeft: 8,
    fontWeight: "600",
  },
  footer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  footerButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: "transparent",
  },
  cancelButtonText: {
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#34C759",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
});

type AvatarModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (uri: string) => void;
  currentAvatar?: string;
};

export default function AvatarModal({
  visible,
  onClose,
  onSave,
  currentAvatar,
}: AvatarModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    currentAvatar || null
  );

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to upload photos."
        );
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images" as any,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera permissions to take photos."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (selectedImage) {
      onSave(selectedImage);
      onClose();
    }
  };

  const handleRemove = () => {
    setSelectedImage(null);
  };

  const handleClose = () => {
    setSelectedImage(currentAvatar || null);
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
            <Text style={styles.title}>Change Avatar</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.previewContainer}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.preview} />
              ) : (
                <View style={styles.placeholderAvatar}>
                  <Ionicons name="person" size={60} color="#fff" />
                </View>
              )}
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
                <Ionicons name="images" size={24} color="white" />
                <Text style={styles.actionButtonText}>Choose Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
                <Ionicons name="camera" size={24} color="white" />
                <Text style={styles.actionButtonText}>Take Photo</Text>
              </TouchableOpacity>

              {selectedImage && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.removeButton]}
                  onPress={handleRemove}
                >
                  <Ionicons name="trash" size={24} color="#FF3B30" />
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.footerButton, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.footerButton,
                styles.saveButton,
                !selectedImage && styles.disabledButton,
              ]}
              onPress={handleSave}
              disabled={!selectedImage}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
