import SockJS from 'sockjs-client';
import { Client, Frame, IMessage } from '@stomp/stompjs';
import { API_CONFIG } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '../store/slices/chatViewSlice';

class SocketService {
  private stompClient: Client | null = null;
  private subscribedChats: Set<string> = new Set();
  private messageCallbacks: ((message: Message) => void)[] = [];
  private isConnecting = false;
  private connectionPromise: Promise<void> | null = null;

  async connect(): Promise<void> {
    if (this.stompClient?.connected) {
      return Promise.resolve();
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.isConnecting = true;

    this.connectionPromise = new Promise<void>(async (resolve, reject) => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          this.isConnecting = false;
          this.connectionPromise = null;
          reject(new Error('No token available'));
          return;
        }

        const socket = new SockJS(`${API_CONFIG.BASE_URL.replace('/api/v1', '')}/ws`);
        
        this.stompClient = new Client({
          webSocketFactory: () => socket as any,
          connectHeaders: {
            Authorization: `Bearer ${token}`
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          onConnect: (frame: Frame) => {
            this.isConnecting = false;
            resolve();
          },
          onStompError: (frame: Frame) => {
            this.isConnecting = false;
            this.connectionPromise = null;
            reject(new Error('WebSocket connection error'));
          },
          onWebSocketClose: () => {
            this.isConnecting = false;
            this.connectionPromise = null;
            this.subscribedChats.clear();
          }
        });

        this.stompClient.activate();
      } catch (error) {
        this.isConnecting = false;
        this.connectionPromise = null;
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  subscribeToChat(chatId: string): void {
    if (!this.stompClient?.connected) {
      return;
    }

    if (this.subscribedChats.has(chatId)) {
      return;
    }

    const destination = `/user/queue/chatview/${chatId}`;
    this.stompClient.subscribe(destination, (message: IMessage) => {
      try {
        const receivedMessage: Message = JSON.parse(message.body);
        
        this.messageCallbacks.forEach(callback => callback(receivedMessage));
      } catch (error) {
      }
    });

    this.subscribedChats.add(chatId);
  }

  onMessage(callback: (message: Message) => void): () => void {
    this.messageCallbacks.push(callback);
    
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      this.subscribedChats.clear();
    }
  }
}

export default new SocketService();
