import { useLocalSearchParams, Stack } from "expo-router";
import { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, Text } from "react-native-paper";
import { styles } from "../../styles/chatView.styles";
import { shouldDisplayAsLargeEmoji } from "../../utils/emojiHelper";
import { formatMessageTimestamp, shouldShowTimestamp } from "../../utils/timestampUtils";
import ChatInput from "../../components/chat/ChatInput";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMessages, sendMessage, fetchChatViews, type Message } from "@/store/slices/chatViewSlice";
import { Ionicons } from "@expo/vector-icons";

export default function ChatViewScreen() {
  const { chatId, chatTitle } = useLocalSearchParams<{ chatId: string; chatTitle: string }>();
  const dispatch = useAppDispatch();
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  const currentUserName = useAppSelector((state) => state.auth.user.name || "");
  const currentUserUid = useAppSelector((state) => state.auth.user.uid);
  const chatViewCollection = useAppSelector((state) => state.chatView.chatViewCollection);
  const userAvatars = useAppSelector((state) => state.chatView.userAvatars);
  const chatView = useAppSelector((state) => 
    state.chatView.chatViewCollection.find(v => v.id === chatId)
  );
  
  const messages = chatView?.messages || [];
  const loading = chatView?.isLoading || false;
  
  useEffect(() => {
    if (chatViewCollection.length === 0) {
      console.log('Loading chat views...');
      dispatch(fetchChatViews());
    }
  }, [dispatch, chatViewCollection.length]);

  useEffect(() => {
    if (chatId) {
      dispatch(fetchMessages(chatId));
    }
  }, [chatId, dispatch]);

  // Auto-scroll to bottom (newest messages) when messages change
  // Since FlatList is inverted, scrolling to index 0 shows newest messages
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      // Small delay to ensure layout is complete
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ 
          index: 0, 
          animated: true,
          viewPosition: 0
        });
      }, 100);
    }
  }, [messages.length]);

  const handleSend = async () => {
    if (!inputMessage.trim() || sending) return;

    setSending(true);
    try {
      await dispatch(sendMessage({ 
        chatViewId: chatId, 
        text: inputMessage.trim() 
      })).unwrap();
      setInputMessage("");
      
      // Scroll to show the new message (index 0 in inverted list)
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ 
          index: 0, 
          animated: true,
          viewPosition: 0
        });
      }, 100);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isCurrentUser = item.senderName === currentUserName;
    const isLargeEmoji = shouldDisplayAsLargeEmoji(item.text);
    
    // Get previous message (remember FlatList is inverted, so index-1 is actually the next message in time)
    const previousMessage = index < messages.length - 1 ? messages[messages.length - 1 - (index + 1)] : null;
    
    // Show sender name only if:
    // - First message in chat, OR
    // - Previous message is from different sender
    const showSender = !previousMessage || previousMessage.senderName !== item.senderName;
    
    // Always show avatar for other users' messages (not current user)
    // For current user, never show avatar
    
    // Show timestamp based on time difference and sender change
    const showTimestampDisplay = shouldShowTimestamp(
      item.createdAt || '',
      previousMessage?.createdAt || null,
      item.senderName,
      previousMessage?.senderName || null
    );
    
    if (isCurrentUser) {
      return (
        <>
          {showTimestampDisplay && item.createdAt && (
            <Text variant="bodySmall" style={styles.timestampRight}>
              {formatMessageTimestamp(item.createdAt)}
            </Text>
          )}
          <View style={[styles.messageContainer, styles.currentUserMessage]}>
            {showSender && (
              <Text variant="bodySmall" style={styles.senderNameRight}>
                you
              </Text>
            )}
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
        </>
      );
    }

    // Other users' messages (left side, with avatar)
    const initials = item.senderName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 1);

    // Look up sender's avatar from userAvatars map using senderUid
    const senderAvatarLink = userAvatars[item.senderUid] || '';

    return (
      <>
        {showTimestampDisplay && item.createdAt && (
          <Text variant="bodySmall" style={styles.timestampLeft}>
            {formatMessageTimestamp(item.createdAt)}
          </Text>
        )}
        <View style={[styles.messageContainer, styles.messageWithAvatar]}>
          {/* Always show avatar for other users */}
          <View style={styles.avatarContainer}>
            {senderAvatarLink ? (
              <Image 
                source={{ uri: senderAvatarLink }} 
                style={styles.avatar}
              />
            ) : (
              <Text style={styles.avatarPlaceholder}>{initials}</Text>
            )}
          </View>
          <View style={styles.messageContent}>
            {showSender && (
              <Text variant="bodySmall" style={styles.senderName}>
                {item.senderName}
              </Text>
            )}
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
      </>
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
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Ionicons 
                name="people" 
                size={26} 
                color="#fff" 
              />
              <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700" }}>
                {chatTitle || "Chat"}
              </Text>
            </View>
          ),
          headerBackButtonDisplayMode: "minimal",
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
          onScrollToIndexFailed={(info) => {
            // Fallback if scrollToIndex fails
            setTimeout(() => {
              flatListRef.current?.scrollToOffset({ 
                offset: 0, 
                animated: true 
              });
            }, 100);
          }}
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