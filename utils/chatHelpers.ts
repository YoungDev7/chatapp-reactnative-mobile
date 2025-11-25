import { chatService } from "../services/chatService";
import { storageService } from "../services/storageService";

/**
 * Loads the current user's information from storage
 * @returns User's name or empty string if not found
 */
export const loadCurrentUser = async (): Promise<string> => {
  try {
    const user = await storageService.getUser();
    return user?.name || "";
  } catch (error) {
    console.error("Failed to load user:", error);
    return "";
  }
};

/**
 * Fetches messages for a specific chat
 * @param chatId - The ID of the chat to fetch messages from
 * @returns Array of messages in reverse order (newest first for inverted list)
 */
export const fetchMessages = async (chatId: string) => {
  try {
    const data = await chatService.getMessages(chatId);
    return data.reverse();
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    throw error;
  }
};

/**
 * Sends a message to a chat
 * @param chatId - The ID of the chat to send the message to
 * @param message - The message text to send
 */
export const sendMessage = async (chatId: string, message: string) => {
  try {
    await chatService.sendMessage(chatId, message);
  } catch (error) {
    console.error("Failed to send message:", error);
    throw error;
  }
};
