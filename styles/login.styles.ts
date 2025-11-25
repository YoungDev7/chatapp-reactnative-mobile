import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "white",
    marginBottom: 8,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#999",
    marginBottom: 40,
  },
  form: {
    gap: 16,
    backgroundColor: "transparent",
  },
  input: {
    backgroundColor: "#1f1f1f",
  },
  button: {
    marginTop: 8,
    borderRadius: 4,
  },
  buttonContent: {
    paddingVertical: 6,
  },
});
