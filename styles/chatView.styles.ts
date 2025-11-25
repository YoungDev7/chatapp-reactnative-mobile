import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#181818",
    justifyContent: "center",
    alignItems: "center",
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: "70%",
    alignSelf: "flex-start",
  },
  currentUserMessage: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  senderName: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 13,
    marginBottom: 4,
    marginLeft: 12,
  },
  senderNameRight: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 13,
    marginBottom: 4,
    marginRight: 12,
    textAlign: "right",
  },
  messageBubble: {
    backgroundColor: "#4c4c4c",
    borderRadius: 17,
    padding: 8,
    paddingHorizontal: 12,
  },
  currentUserBubble: {
    backgroundColor: "#1976d2",
  },
  messageText: {
    color: "white",
    fontSize: 16,
  },
  emojiOnlyText: {
    fontSize: 48,
    lineHeight: 56,
  },
  emojiOnlyBubble: {
    backgroundColor: "transparent",
    padding: 4,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#1f1f1f",
    alignItems: "center",
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
  },
  sendButton: {
    width: 35,
    height: 35,
    borderRadius: 4,
    backgroundColor: "#1976d2",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
