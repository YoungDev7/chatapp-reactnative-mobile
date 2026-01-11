import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
    paddingVertical: 12,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.3)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    gap: 8,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 14,
    flex: 1,
  },
  resultsContainer: {
    maxHeight: 200,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    marginBottom: 16,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  resultEmail: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
  },
  selectedContainer: {
    backgroundColor: "rgba(25, 118, 210, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(25, 118, 210, 0.3)",
    borderRadius: 8,
    padding: 12,
  },
  selectedTitle: {
    color: "#1976d2",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 6,
    marginBottom: 8,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedName: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 2,
  },
  selectedEmail: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 13,
  },
});
