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
  messageWithAvatar: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#424242",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
  },
  avatarPlaceholder: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    fontWeight: "600",
  },
  messageContent: {
    flex: 1,
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
});
