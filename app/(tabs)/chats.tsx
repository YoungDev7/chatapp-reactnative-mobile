import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { ActivityIndicator, FAB } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import SearchBar from "../../components/SearchBar";
import { styles } from "../../styles/chats.styles";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { store } from "@/store/store";
import { fetchChatViews, fetchMessages, selectSortedChats, addMessage, incrementUnreadCount } from "@/store/slices/chatViewSlice";
import socketService from "@/services/socketService";
import notificationService from "@/services/notificationService";
import type { Message } from "@/types/chatViewSliceTypes";

export default function ChatsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const subscribedChatIds = useRef<Set<string>>(new Set());
  const messageUnsubscribeRef = useRef<(() => void) | null>(null);
  
  const sortedChats = useAppSelector(selectSortedChats);
  const { isLoadingChatViews, chatViewsError } = useAppSelector(
    (state) => state.chatView
  );

  const fetchChats = async () => {
    try {
      const chatViews = await dispatch(fetchChatViews()).unwrap();
      
      const messagePromises = chatViews.map((chat: any) => 
        dispatch(fetchMessages(chat.id))
      );
      
      await Promise.all(messagePromises);
    } catch (err) {

    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleMessage = (message: Message) => {
      const chatId = message.chatViewId;
      if (!chatId) return;
      
      const currentlyDisplayedChat = store.getState().chatView.currentlyDisplayedChatView;
      
      dispatch(addMessage({ id: chatId, message }));
      
      if (chatId !== currentlyDisplayedChat) {
        dispatch(incrementUnreadCount(chatId));
        
        const state = store.getState();
        const chat = state.chatView.chatViewCollection.find(c => c.id === chatId);
        if (chat) {
          notificationService.showNotification(
            chat.title || 'New Message',
            `${message.senderName}: ${message.text}`,
            { chatId }
          );
        }
      }
    };

    messageUnsubscribeRef.current = socketService.onMessage(handleMessage);

    return () => {
      if (messageUnsubscribeRef.current) {
        messageUnsubscribeRef.current();
        messageUnsubscribeRef.current = null;
      }
    };
  }, [dispatch]);

  useEffect(() => {
    if (sortedChats.length === 0) return;

    const subscribeToChats = async () => {
      try {
        await socketService.connect();
      
        sortedChats.forEach(chat => {
          if (!subscribedChatIds.current.has(chat.id)) {
            socketService.subscribeToChat(chat.id);
            subscribedChatIds.current.add(chat.id);
          }
        });
      } catch (error) {
        console.error("Failed to setup WebSocket connections:", error);
      }
    };

    subscribeToChats();
  }, [sortedChats]);

  useFocusEffect(
    useCallback(() => {
      const reconnect = async () => {
        try {
          await socketService.connect();
          subscribedChatIds.current.forEach(chatId => {
            socketService.subscribeToChat(chatId);
          });
        } catch (error) {
          console.error("Failed to reconnect:", error);
        }
      };
      
      reconnect();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchChats();
  };

  const filteredChats = sortedChats.filter((chat) =>
    chat.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderChat = ({ item }: { item: typeof sortedChats[0] }) => {
    const lastMessage = item.messages && item.messages.length > 0 
      ? item.messages[item.messages.length - 1] 
      : null;
    const senderDisplayName = lastMessage?.senderName || '';
    const hasUnread = (item.unreadCount || 0) > 0;
    
    return (
      <TouchableOpacity
        style={[
          styles.chatItem,
          hasUnread && styles.chatItemUnread
        ]}
        onPress={() =>
          router.push(
            `/chat/${item.id}?chatTitle=${encodeURIComponent(item.title)}` as any
          )
        }
      >
        <Ionicons name="people" size={20} color="#fff" style={styles.chatIcon} />
        <View style={styles.chatInfo}>
          <Text style={[
            styles.chatTitle,
            hasUnread && { fontWeight: 'bold' }
          ]}>
            {item.title || 'Untitled Chat'}
          </Text>
          {lastMessage ? (
            <Text style={[
              styles.lastMessage,
              hasUnread && { fontWeight: 'bold' }
            ]} numberOfLines={1}>
              {senderDisplayName}: {lastMessage.text}
            </Text>
          ) : (
            <Text style={[styles.lastMessage, { fontStyle: 'italic', opacity: 0.6 }]} numberOfLines={1}>
              No messages yet
            </Text>
          )}
        </View>
        {hasUnread && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (isLoadingChatViews && sortedChats.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>Loading chats...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search chats..."
      />

      {chatViewsError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{chatViewsError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchChats}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredChats}
        renderItem={renderChat}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1976d2"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {chatViewsError ? "Pull to retry" : "No chats found"}
            </Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push("/chat/new" as any)}
        color="#fff"
      />
    </View>
  );
}
