import { useLocalSearchParams, Stack } from "expo-router";
import { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { styles } from "../../styles/chatView.styles";
import { shouldDisplayAsLargeEmoji } from "../../utils/emojiHelper";
import ChatInput from "../../components/chat/ChatInput";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMessages, sendMessage, fetchChatViews, type Message } from "@/store/slices/chatViewSlice";

export default function ChatViewScreen() {
  const { chatId, chatTitle } = useLocalSearchParams<{ chatId: string; chatTitle: string }>();
  const dispatch = useAppDispatch();
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  const currentUserName = useAppSelector((state) => state.auth.user.name || "");
  const chatViewCollection = useAppSelector((state) => state.chatView.chatViewCollection);
  const chatView = useAppSelector((state) => 
    state.chatView.chatViewCollection.find(v => v.id === chatId)
  );
  
  const messages = chatView?.messages || [];
  const loading = chatView?.isLoading || false;

  console.log('ChatViewScreen - chatId:', chatId);
  console.log('ChatViewScreen - chatView found:', !!chatView);
  console.log('ChatViewScreen - messages count:', messages.length);
  console.log('ChatViewScreen - loading:', loading);

  // Load chat views first if not loaded
  useEffect(() => {
    if (chatViewCollection.length === 0) {
      console.log('Loading chat views...');
      dispatch(fetchChatViews());
    }
  }, [dispatch, chatViewCollection.length]);

  useEffect(() => {
    if (chatId) {
      console.log('Fetching messages for chatId:', chatId);
      // Fetch messages regardless of whether chatView exists
      dispatch(fetchMessages(chatId));
    }
  }, [chatId, dispatch]);

  const handleSend = async () => {
    if (!inputMessage.trim() || sending) return;

    setSending(true);
    try {
      await dispatch(sendMessage({ 
        chatViewId: chatId, 
        text: inputMessage.trim() 
      })).unwrap();
      setInputMessage("");
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
          data={[...messages].reverse()}
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