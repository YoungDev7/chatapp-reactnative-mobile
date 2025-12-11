import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 375;

export const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: isSmallScreen ? 8 : 12,
    paddingVertical: isSmallScreen ? 6 : 8,
    paddingBottom: isSmallScreen ? 16 : 20,
    backgroundColor: "#1f1f1f",
    alignItems: "center",
    gap: isSmallScreen ? 6 : 8,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: isSmallScreen ? 16 : 20,
    borderWidth: 1,
    borderColor: "#444",
    paddingHorizontal: isSmallScreen ? 8 : 12,
    minHeight: isSmallScreen ? 32 : 36,
    maxHeight: isSmallScreen ? 80 : 90,
  },
  input: {
    backgroundColor: "transparent",
    flex: 1,
    fontSize: isSmallScreen ? 14 : 16,
    minHeight: isSmallScreen ? 32 : 36,
    maxHeight: isSmallScreen ? 60 : 70,
    textAlignVertical: "center",
  },
  inputContent: {
    paddingHorizontal: 5,
  },
  emojiButton: {
    margin: 0,
    padding: 4,
  },
  sendButton: {
    borderRadius: isSmallScreen ? 16 : 20,
    margin: 0,
    width: isSmallScreen ? 40 : 44,
    height: isSmallScreen ? 40 : 44,
  },
  emojiModalContainer: {
    flex: 1,
    backgroundColor: "#1f1f1f",
    marginTop: "auto",
    height: "50%",
  },
  emojiPickerHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 8,
  },
});
