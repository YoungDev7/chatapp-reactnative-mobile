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
import { chatService, Chat } from "../../services/chatService";
import SearchBar from "../../components/SearchBar";
import { styles } from "../../styles/chats.styles";

export default function ChatsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = async () => {
    try {
      setError(null);
      const data = await chatService.getChats();
      setChats(data);
    } catch (err) {
      console.error("Failed to fetch chats:", err);
      setError("Failed to load chats. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchChats();
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderChat = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        router.push(
          `/chat/${item.id}?chatTitle=${encodeURIComponent(item.name)}` as any
        )
      }
    >
      <Ionicons name="people" size={20} color="#fff" style={styles.chatIcon} />
      <View style={styles.chatInfo}>
        <Text style={styles.chatTitle}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
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

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
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
              {error ? "Pull to retry" : "No chats found"}
            </Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          // TODO: Navigate to create chat screen
          console.log("Create new chat");
        }}
        color="#fff"
      />
    </View>
  );
}
