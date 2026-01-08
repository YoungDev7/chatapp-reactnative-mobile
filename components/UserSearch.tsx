import { useState, useCallback, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { searchUser, type User } from "../utils/userUtils";
import { styles } from "../styles/userSearch.styles";

interface UserSearchProps {
  selectedUsers: User[];
  onSelectUser: (user: User) => void;
  onRemoveUser: (userUid: string) => void;
  currentUserUid: string;
}

export default function UserSearch({
  selectedUsers,
  onSelectUser,
  onRemoveUser,
  currentUserUid,
}: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search for users with debounce
  const searchUsers = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      setError(null);
      try {
        const foundUser = await searchUser(query);

        if (!foundUser) {
          setSearchResults([]);
          setError(null);
          return;
        }

        // Don't show already selected users or current user in search results
        const isAlreadySelected = selectedUsers.some(
          (u) => u.uid === foundUser.uid
        );
        const isCurrentUser = foundUser.uid === currentUserUid;
        setSearchResults(
          isAlreadySelected || isCurrentUser ? [] : [foundUser]
        );
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to search users";
        console.error("Error searching users:", err);
        setError(errorMsg);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [selectedUsers, currentUserUid]
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchUsers]);

  const handleSelectUser = (user: User) => {
    onSelectUser(user);
    setSearchQuery("");
    setSearchResults([]);
    setError(null);
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="rgba(255, 255, 255, 0.5)"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users by name or email..."
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {isSearching && <ActivityIndicator size="small" color="#1976d2" />}
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.uid}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleSelectUser(item)}
              >
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{item.name}</Text>
                  <Text style={styles.resultEmail}>{item.email}</Text>
                </View>
                <Ionicons name="add-circle" size={24} color="#1976d2" />
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Selected Users */}
      {selectedUsers.length > 0 && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedTitle}>Selected Users:</Text>
          <FlatList
            data={selectedUsers}
            keyExtractor={(item) => item.uid}
            renderItem={({ item }) => (
              <View style={styles.selectedItem}>
                <View style={styles.selectedInfo}>
                  <Text style={styles.selectedName}>{item.name}</Text>
                  <Text style={styles.selectedEmail}>{item.email}</Text>
                </View>
                <TouchableOpacity onPress={() => onRemoveUser(item.uid)}>
                  <Ionicons name="close-circle" size={24} color="#ff6b6b" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}
