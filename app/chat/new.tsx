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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createChatView, fetchChatViews } from "@/store/slices/chatViewSlice";
import UserSearch from "../../components/UserSearch";
import type { User } from "../../utils/userUtils";

export default function NewChatScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [title, setTitle] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelectUser = (user: User) => {
    if (user.uid === currentUser.uid) {
      setError("You cannot add yourself to the chat");
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
    setError("");
  };

  const handleRemoveUser = (userUid: string) => {
    setSelectedUsers(selectedUsers.filter((u) => u.uid !== userUid));
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("Chat title is required");
      return;
    }

    if (title.trim().length < 3) {
      setError("Chat title must be at least 3 characters");
      return;
    }

    if (selectedUsers.length === 0) {
      setError("Please add at least one user to the chat");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userUids = selectedUsers.map((user) => user.uid);
      await dispatch(createChatView({
        name: title.trim(),
        userUids
      })).unwrap();

      await dispatch(fetchChatViews()).unwrap();

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
          headerStyle: {
            backgroundColor: "#181818",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <Ionicons name="close" size={24} color="#fff" />
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
            <View style={styles.iconContainer}>
              <Ionicons name="chatbubble-ellipses" size={64} color="#1976d2" />
            </View>

            <Text style={styles.title}>Create a New Chat</Text>
          
            <View style={styles.form}>
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

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Add Users *</Text>
                <UserSearch
                  selectedUsers={selectedUsers}
                  onSelectUser={handleSelectUser}
                  onRemoveUser={handleRemoveUser}
                  currentUserUid={currentUser.uid || ""}
                />
              </View>

              {error && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={20} color="#ff6b6b" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

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
            disabled={loading || !title.trim() || selectedUsers.length === 0}
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
