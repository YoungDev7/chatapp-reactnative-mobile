import { styles } from "@/styles/searchBar.styles";
import { SearchBarProps } from "@/types/searchBar";
import { View } from "react-native";
import { Searchbar } from "react-native-paper";

export default function SearchBar({ value, onChangeText, placeholder = "Search..." }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        style={styles.searchbar}
        iconColor="#999"
        placeholderTextColor="#999"
        inputStyle={styles.input}
        theme={{ colors: { elevation: { level3: '#1f1f1f' } } }}
      />
    </View>
  );
}
