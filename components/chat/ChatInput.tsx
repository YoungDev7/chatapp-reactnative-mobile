import { View, Animated, Easing } from "react-native";
import { TextInput, IconButton } from "react-native-paper";
import { useState, useRef, useEffect } from "react";
import EmojiPicker from "rn-emoji-keyboard";
import { styles } from "../../styles/ChatInput.styles";
import { ChatInputProps } from "../../types/chatInput";  

export default function ChatInput({
  value,
  onChangeText,
  onSend,
  disabled = false,
  sending = false,
}: ChatInputProps) {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const sendButtonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (sending) {
      Animated.sequence([
        Animated.timing(sendButtonScale, {
          toValue: 0.95,
          duration: 100,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(sendButtonScale, {
          toValue: 1,
          duration: 100,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [sending, sendButtonScale]);

  const handleEmojiSelect = (emoji: any) => {
    onChangeText(value + emoji.emoji);
  };

  const handleSend = () => {
    if (!value.trim()) return;
    onSend();
  };

  const isSendDisabled = !value.trim() || disabled || sending;

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          mode="outlined"
          placeholder="Type a message..."
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          value={value}
          onChangeText={onChangeText}
          multiline
          maxLength={1000}
          style={styles.input}
          contentStyle={styles.inputContent}
          outlineStyle={{ borderWidth: 0 }}
          textColor="white"
          disabled={disabled || sending}
          editable={!disabled && !sending}
        />
        <IconButton
          icon="emoticon-happy-outline"
          iconColor={disabled ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.6)"}
          size={25}
          onPress={() => !disabled && setIsEmojiPickerOpen(true)}
          style={styles.emojiButton}
          disabled={disabled}
        />
      </View>

      <Animated.View style={{ transform: [{ scale: sendButtonScale }] }}>
        <IconButton
          icon={sending ? "loading" : "send"}
          mode="contained"
          containerColor={isSendDisabled ? "rgba(25, 118, 210, 0.9)" : "#1976d2"}
          iconColor="white"
          onPress={handleSend}
          disabled={isSendDisabled}
          style={styles.sendButton}
        />
      </Animated.View>

      <EmojiPicker
        onEmojiSelected={handleEmojiSelect}
        open={isEmojiPickerOpen}
        onClose={() => setIsEmojiPickerOpen(false)}
        theme={{
          backdrop: "#00000099",
          knob: "#ffffff",
          container: "#1f1f1f",
          header: "#ffffff",
          skinTonesContainer: "#2a2a2a",
          category: {
            icon: "#ffffff",
            container: "#000000",
          },
        }}
      />
    </View>
  );
}