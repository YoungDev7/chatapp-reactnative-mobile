import { View } from "react-native";
import { TextInput, IconButton } from "react-native-paper";
import { styles } from "../../styles/ChatInput.styles";

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
  sending?: boolean;
}

export default function ChatInput({
  value,
  onChangeText,
  onSend,
  disabled = false,
  sending = false,
}: ChatInputProps) {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          mode="outlined"
          placeholder="Aa"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={value}
          onChangeText={onChangeText}
          multiline
          style={styles.input}
          contentStyle={styles.inputContent}
          outlineStyle={{ borderWidth: 0 }}
          textColor="white"
          disabled={disabled}
        />
        <IconButton
          icon="emoticon-happy-outline"
          iconColor="rgba(255, 255, 255, 0.5)"
          size={22}
          onPress={() => {}}
          style={styles.emojiButton}
          disabled={disabled}
        />
      </View>
      <IconButton
        icon="send"
        mode="contained"
        containerColor={!value.trim() ? "rgba(25, 118, 210, 0.5)" : "#1976d2"}
        iconColor="white"
        size={22}
        onPress={onSend}
        disabled={!value.trim() || disabled || sending}
        loading={sending}
        style={styles.sendButton}
      />
    </View>
  );
}
