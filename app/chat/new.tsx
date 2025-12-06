import { useState } from "react";
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import { Button } from "react-native-paper";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/newChat.styles";

export default function NewChatScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("Chat title is required");
      return;
    }

    if (title.trim().length < 3) {
      setError("Chat title must be at least 3 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // TODO: Dispatch action to create chat
      // const result = await dispatch(createChat({
      //   title: title.trim(),
      //   description: description.trim(),
      // })).unwrap();

      // For now, just navigate back
      console.log("Creating chat:", { title, description });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to chats
      router.back();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create chat"
      );
      console.error("Error creating chat:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Create New Chat",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <Ionicons name="close" size={24} color="#1976d2" />
            </TouchableOpacity>
          ),
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header Icon */}
            <View style={styles.iconContainer}>
              <Ionicons name="chatbubble-ellipses" size={64} color="#1976d2" />
            </View>

            {/* Title */}
            <Text style={styles.title}>Create a New Chat</Text>
            <Text style={styles.subtitle}>
              Start a conversation with your team
            </Text>

            {/* Form */}
            <View style={styles.form}>
              {/* Chat Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Chat Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter chat name"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={title}
                  onChangeText={(text) => {
                    setTitle(text);
                    setError("");
                  }}
                  editable={!loading}
                  maxLength={100}
                />
                <Text style={styles.charCount}>
                  {title.length}/100
                </Text>
              </View>

              {/* Description Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter chat description"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  editable={!loading}
                  maxLength={500}
                />
                <Text style={styles.charCount}>
                  {description.length}/500
                </Text>
              </View>

              {/* Error Message */}
              {error && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={20} color="#ff6b6b" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Info Box */}
              <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={20} color="#1976d2" />
                <Text style={styles.infoText}>
                  You can add more members to this chat after creation.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <Button
            mode="contained"
            onPress={handleCreate}
            loading={loading}
            disabled={loading || !title.trim()}
            style={styles.createButton}
            labelStyle={styles.createButtonLabel}
          >
            {loading ? "Creating..." : "Create Chat"}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
