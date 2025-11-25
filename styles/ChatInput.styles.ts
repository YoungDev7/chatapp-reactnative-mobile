import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    paddingBottom: 16,
    backgroundColor: "#1f1f1f",
    alignItems: "center",
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#424242",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#666",
    minHeight: 44,
  },
  input: {
    backgroundColor: "transparent",
    flex: 1,
    fontSize: 16,
    minHeight: 44,
  },
  inputContent: {
    paddingHorizontal: 12,
  },
  emojiButton: {
    margin: 0,
  },
  sendButton: {
    borderRadius: 4,
    margin: 0,
    width: 44,
    height: 44,
  },
});
