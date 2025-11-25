import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    width: "100%",
    maxWidth: 500,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 24,
  },
  previewContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  preview: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "white",
  },
  placeholderAvatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#0066FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  buttonGroup: {
    gap: 12,
  },
  input: {
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0066FF",
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  removeButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  removeButtonText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  footerButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#666",
  },
  cancelButtonText: {
    color: "#999",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#0066FF",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#333",
    opacity: 0.5,
  },
});
