import { useLocalSearchParams, Stack } from "expo-router";
import { useState, useEffect } from "react";
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, IconButton, ActivityIndicator, Text } from "react-native-paper";
import { chatService, Message } from "../../services/chatService";
import { storageService } from "../../services/storageService";
import { styles } from "../../styles/chatView.styles";
import { shouldDisplayAsLargeEmoji } from "../../utils/emojiHelper";

export default function ChatViewScreen() {
  const { chatId, chatTitle } = useLocalSearchParams<{ chatId: string; chatTitle: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserName, setCurrentUserName] = useState<string>("");

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  const loadCurrentUser = async () => {
    try {
      const user = await storageService.getUser();
      if (user?.name) {
        setCurrentUserName(user.name);
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  };

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
    const isCurrentUser = item.senderName === currentUserName;
    const isLargeEmoji = shouldDisplayAsLargeEmoji(item.text);
    
    return (
      <View style={[styles.messageContainer, isCurrentUser && styles.currentUserMessage]}>
        <Text variant="bodySmall" style={isCurrentUser ? styles.senderNameRight : styles.senderName}>
          {isCurrentUser ? "you" : item.senderName}
        </Text>
        <View style={[
          styles.messageBubble,
          isCurrentUser && styles.currentUserBubble,
          isLargeEmoji && styles.emojiOnlyBubble
        ]}>
          <Text 
            variant="bodyMedium" 
            style={[styles.messageText, isLargeEmoji && styles.emojiOnlyText]}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
          <ActivityIndicator animating={true} size="large" color="#1976d2" />
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
              mode="outlined"
              placeholder="Aa"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={inputMessage}
              onChangeText={setInputMessage}
              multiline
              style={{ backgroundColor: "transparent" }}
              outlineColor="#666"
              activeOutlineColor="#1976d2"
              textColor="white"
            />
          </View>
          <IconButton
            icon="send"
            mode="contained"
            containerColor={!inputMessage.trim() ? "rgba(25, 118, 210, 0.5)" : "#1976d2"}
            iconColor="white"
            size={20}
            onPress={handleSend}
            disabled={!inputMessage.trim() || sending}
            loading={sending}
          />
        </View>
      </KeyboardAvoidingView>
    </>
  );
}


