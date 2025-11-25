import { useLocalSearchParams, Stack } from "expo-router";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { chatService, Message } from "../../services/chatService";

export default function ChatViewScreen() {
  const { chatId, chatTitle } = useLocalSearchParams<{ chatId: string; chatTitle: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  const fetchMessages = async () => {
    try {
      const data = await chatService.getMessages(chatId);
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputMessage.trim() || sending) return;

    setSending(true);
    try {
      await chatService.sendMessage(chatId, inputMessage.trim());
      setInputMessage("");
      await fetchMessages(); // Refresh messages
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderName === "currentUser"; // TODO: Get from auth context
    
    return (
      <View style={[styles.messageContainer, isCurrentUser && styles.currentUserMessage]}>
        {!isCurrentUser && (
          <Text style={styles.senderName}>{item.senderName}</Text>
        )}
        <View style={[styles.messageBubble, isCurrentUser && styles.currentUserBubble]}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
        {isCurrentUser && (
          <Text style={styles.senderNameRight}>you</Text>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: chatTitle || "Chat",
          headerStyle: { backgroundColor: "#1f1f1f" },
          headerTintColor: "#fff",
        }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => item.id || index.toString()}
          contentContainerStyle={styles.messagesList}
          inverted={false}
        />

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Aa"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={inputMessage}
              onChangeText={setInputMessage}
              multiline
            />
          </View>
          <TouchableOpacity
            style={[styles.sendButton, !inputMessage.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputMessage.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="paper-plane" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#181818",
    justifyContent: "center",
    alignItems: "center",
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: "70%",
    alignSelf: "flex-start",
  },
  currentUserMessage: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  senderName: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 13,
    marginBottom: 4,
    marginLeft: 15,
  },
  senderNameRight: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 13,
    marginTop: 4,
    marginRight: 15,
    textAlign: "right",
  },
  messageBubble: {
    backgroundColor: "#4c4c4c",
    borderRadius: 17,
    padding: 8,
    paddingHorizontal: 12,
  },
  currentUserBubble: {
    backgroundColor: "#1976d2",
  },
  messageText: {
    color: "white",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#1f1f1f",
    alignItems: "center",
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: "#424242",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#666",
    paddingHorizontal: 14,
    minHeight: 35,
    justifyContent: "center",
  },
  input: {
    color: "white",
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 35,
    height: 35,
    borderRadius: 4,
    backgroundColor: "#1976d2",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
