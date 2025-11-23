import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 24,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    maxWidth: 600,
    width: "100%",
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#0066FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    overflow: "hidden",
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0066FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 24,
  },
  infoSection: {
    gap: 0,
  },
  infoItem: {
    paddingVertical: 16,
  },
  infoLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
});
