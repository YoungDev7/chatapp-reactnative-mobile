import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { ActivityIndicator, FAB } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import SearchBar from "../../components/SearchBar";
import { styles } from "../../styles/chats.styles";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchChatViews, fetchMessages, selectSortedChats } from "@/store/slices/chatViewSlice";

export default function ChatsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  
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
            hasUnread && styles.chatTitleUnread
          ]}>
            {item.title || 'Untitled Chat'}
          </Text>
          {lastMessage ? (
            <Text style={[
              styles.lastMessage,
              hasUnread && styles.lastMessageUnread
            ]} numberOfLines={1}>
              {senderDisplayName}: {lastMessage.text}
            </Text>
          ) : (
            <Text style={[styles.lastMessage, { fontStyle: 'italic', opacity: 0.6 }]} numberOfLines={1}>
              No messages yet
            </Text>
          )}
        </View>
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
