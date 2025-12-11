import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
    alignItems: "stretch",
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
    alignItems: "flex-end",
    gap: 10,
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
    alignSelf: "flex-start", // Fit to text content
    maxWidth: "80%", // Prevent overly wide bubbles
  },
  currentUserBubble: {
    backgroundColor: "#1976d2",
    alignSelf: "flex-end", // Fit to text content for current user
    maxWidth: "80%",
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
  timestampLeft: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },
  timestampRight: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },
  avatarHidden: {
    opacity: 0,
  },
});
