import { useLocalSearchParams, Stack, useFocusEffect } from "expo-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { View, FlatList, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from "react-native";
import { Text } from "react-native-paper";
import { styles } from "../../styles/chatView.styles";
import { shouldDisplayAsLargeEmoji } from "../../utils/emojiHelper";
import { formatMessageTimestamp } from "../../utils/timestampUtils";
import ChatInput from "../../components/chat/ChatInput";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMessages, sendMessage, markChatAsRead, addMessage, setCurrentlyDisplayedChatView } from "@/store/slices/chatViewSlice";
import type { Message } from "@/types/chatViewSliceTypes";
import { Ionicons } from "@expo/vector-icons";
import socketService from "@/services/socketService";

export default function ChatViewScreen() {
  const { chatId, chatTitle } = useLocalSearchParams<{ chatId: string; chatTitle: string }>();
  const dispatch = useAppDispatch();
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  const currentUserName = useAppSelector((state) => state.auth.user.name || "");
  const currentUserUid = useAppSelector((state) => state.auth.user.uid || "");
  const userAvatars = useAppSelector((state) => state.chatView.userAvatars);
  const chatView = useAppSelector((state) => 
    state.chatView.chatViewCollection.find(v => v.id === chatId)
  );
  
  const messages = chatView?.messages || [];
  const loading = chatView?.isLoading || false;
  
  useEffect(() => {
    if (chatId) {
      dispatch(fetchMessages(chatId));
    }
  }, [chatId, dispatch]);

  useEffect(() => {
    if (!chatId) return;

    const subscribeToChat = async () => {
      try {
        await socketService.connect();
        socketService.subscribeToChat(chatId);
      } catch (error) {
        console.error("Failed to connect to WebSocket:", error);
      }
    };

    subscribeToChat();
  }, [chatId]);

  useFocusEffect(
    useCallback(() => {
      if (chatId) {
        dispatch(setCurrentlyDisplayedChatView(chatId));
        dispatch(markChatAsRead(chatId));
      }
      
      return () => {
        dispatch(setCurrentlyDisplayedChatView(null));
      };
    }, [chatId, dispatch])
  );


  const handleSend = async () => {
    if (!inputMessage.trim() || sending) return;

    const messageText = inputMessage.trim();
    setInputMessage("");
    setSending(true);
    
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      text: messageText,
      senderName: currentUserName,
      senderUid: currentUserUid,
      createdAt: new Date().toISOString()
    };
    
    dispatch(addMessage({ id: chatId, message: tempMessage }));
    
    try {
      await dispatch(sendMessage({ 
        chatViewId: chatId, 
        text: messageText
      })).unwrap();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isCurrentUser = item.senderUid === currentUserUid;
    const isLargeEmoji = shouldDisplayAsLargeEmoji(item.text);
    
    const previousMessage = index < messages.length - 1 ? messages[messages.length - 1 - (index + 1)] : null;
    const showSender = !previousMessage || previousMessage.senderUid !== item.senderUid;

    
    if (isCurrentUser) {
      return (
        <View>
          {item.createdAt && (
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
        </View>
      );
    }

    const initials = (item.senderName || 'U')
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 1);

    const senderAvatarLink = userAvatars[item.senderUid] || '';

    return (
      <View>
        {item.createdAt && (
          <Text variant="bodySmall" style={styles.timestampLeft}>
            {formatMessageTimestamp(item.createdAt)}
          </Text>
        )}
        <View style={[styles.messageContainer, styles.messageWithAvatar]}>
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