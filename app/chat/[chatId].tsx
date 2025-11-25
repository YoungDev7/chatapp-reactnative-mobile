import { useLocalSearchParams, Stack } from "expo-router";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { Message } from "../../services/chatService";
import { styles } from "../../styles/chatView.styles";
import { shouldDisplayAsLargeEmoji } from "../../utils/emojiHelper";
import { 
  loadCurrentUser as loadUser, 
  fetchMessages as getMessages, 
  sendMessage as postMessage 
} from "../../utils/chatHelpers";
import ChatInput from "../../components/chat/ChatInput";

export default function ChatViewScreen() {
  const { chatId, chatTitle } = useLocalSearchParams<{ chatId: string; chatTitle: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    const userName = await loadUser();
    setCurrentUserName(userName);
  };

  const fetchMessages = useCallback(async () => {
    try {
      const data = await getMessages(chatId);
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    if (chatId) {
      fetchMessages();
    }
  }, [chatId, fetchMessages]);

  const handleSend = async () => {
    if (!inputMessage.trim() || sending) return;

    setSending(true);
    try {
      await postMessage(chatId, inputMessage.trim());
      setInputMessage("");
      await fetchMessages(); 
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderName === currentUserName;
    const isLargeEmoji = shouldDisplayAsLargeEmoji(item.text);
    
    if (isCurrentUser) {
      return (
        <View style={[styles.messageContainer, styles.currentUserMessage]}>
          <Text variant="bodySmall" style={styles.senderNameRight}>
            you
          </Text>
          <View style={[
            styles.messageBubble,
            styles.currentUserBubble,
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
    }

    // Other users' messages (left side, with avatar)
    const initials = item.senderName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 1);

    return (
      <View style={[styles.messageContainer, styles.messageWithAvatar]}>
        <View style={styles.avatarContainer}>
          {item.senderAvatar ? (
            <Image 
              source={{ uri: item.senderAvatar }} 
              style={styles.avatar}
            />
          ) : (
            <Text style={styles.avatarPlaceholder}>{initials}</Text>
          )}
        </View>
        <View style={styles.messageContent}>
          <Text variant="bodySmall" style={styles.senderName}>
            {item.senderName}
          </Text>
          <View style={[
            styles.messageBubble,
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
          headerBackTitle: "chats",
        }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => item.id || index.toString()}
          contentContainerStyle={styles.messagesList}
          inverted={true}
        />

        <ChatInput
          value={inputMessage}
          onChangeText={setInputMessage}
          onSend={handleSend}
          disabled={false}
          sending={sending}
        />
      </KeyboardAvoidingView>
    </>
  );
}