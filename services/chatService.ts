import api from './api';

export interface Chat {
  viewId: string;
  title: string;
  messages?: Message[];
}

export interface Message {
  id?: string;
  text: string;
  senderName: string;
  createdAt?: string;
}

export const chatService = {
  /**
   * Fetch all chats/chat views
   */
  async getChats(): Promise<Chat[]> {
    try {
      const response = await api.get('/chatview');
      return response.data;
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  },

  /**
   * Fetch messages for a specific chat
   */
  async getMessages(chatViewId: string): Promise<Message[]> {
    try {
      const response = await api.get(`/chatview/${chatViewId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  /**
   * Send a message to a chat
   */
  async sendMessage(chatViewId: string, text: string): Promise<Message> {
    try {
      const response = await api.post(`/chatview/${chatViewId}/messages`, {
        text,
        createdAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
};
