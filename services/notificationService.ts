import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api';
import axios from 'axios';

// Configure how notifications are handled when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface NotificationHandler {
  onNotificationReceived?: (notification: Notifications.Notification) => void;
  onNotificationResponse?: (response: Notifications.NotificationResponse) => void;
}

class NotificationService {
  private handlers: NotificationHandler[] = [];
  private expoPushToken: string | null = null;
  private notificationSubscription: Notifications.EventSubscription | null = null;
  private responseSubscription: Notifications.EventSubscription | null = null;

  async initialize(): Promise<void> {
    // Request permissions and get push token
    const token = await this.getPushToken();
    if (token) {
      this.expoPushToken = token;
      await this.sendTokenToBackend(token);
    }

    // Set up notification listeners
    this.setupNotificationListeners();

    // Handle notification when app starts from closed state
    const lastNotification = await Notifications.getLastNotificationResponseAsync();
    if (lastNotification) {
      this.handleNotificationResponse(lastNotification);
    }
  }

  private async getPushToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        console.log('Push notifications are not supported on web');
        return null;
      }

      if (!Device.isDevice) {
        console.log('Push notifications require a physical device');
        return null;
      }

      // Request permissions for iOS
      if (Platform.OS === 'ios') {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          console.log('Failed to get push token for notifications');
          return null;
        }
      }

      // For Android, permissions are handled automatically
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });

        await Notifications.setNotificationChannelAsync('messages', {
          name: 'Messages',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          sound: 'default',
        });
      }

      const token = await Notifications.getExpoPushTokenAsync();
      console.log('Expo push token:', token.data);
      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  private async sendTokenToBackend(token: string): Promise<void> {
    try {
      const authToken = await AsyncStorage.getItem('accessToken');
      if (!authToken) return;

      await axios.post(
        `${API_CONFIG.BASE_URL}/users/push-token`,
        { expoPushToken: token },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log('Push token sent to backend');
    } catch (error) {
      console.error('Error sending push token to backend:', error);
    }
  }

  private setupNotificationListeners(): void {
    // Listen for notifications when app is in foreground
    this.notificationSubscription = Notifications.addNotificationReceivedListener(
      (notification: Notifications.Notification) => {
        this.handleNotificationReceived(notification);
      }
    );

    // Listen for notification taps
    this.responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response: Notifications.NotificationResponse) => {
        this.handleNotificationResponse(response);
      }
    );
  }

  private handleNotificationReceived(notification: Notifications.Notification): void {
    console.log('Notification received:', notification);
    this.handlers.forEach((handler) => {
      if (handler.onNotificationReceived) {
        handler.onNotificationReceived(notification);
      }
    });
  }

  private handleNotificationResponse(
    response: Notifications.NotificationResponse
  ): void {
    
    this.handlers.forEach((handler) => {
      if (handler.onNotificationResponse) {
        handler.onNotificationResponse(response);
      }
    });

    // You can navigate to the chat here if needed
    // This will be handled by the component that subscribes to notifications
  }

  registerHandler(handler: NotificationHandler): () => void {
    this.handlers.push(handler);

    // Return unsubscribe function
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler);
    };
  }

  async sendTestNotification(): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test Notification',
          body: 'This is a test notification',
          data: { chatId: 'test' },
        },
        trigger: null
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  }

  async showNotification(title: string, body: string, data?: Record<string, unknown>): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: 'default',
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  cleanup(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.remove();
    }
    if (this.responseSubscription) {
      this.responseSubscription.remove();
    }
    this.handlers = [];
  }

  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }
}

export default new NotificationService();
