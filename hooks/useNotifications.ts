import { useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import notificationService from '../services/notificationService';

interface UseNotificationsOptions {
  onNotificationReceived?: (notification: Notifications.Notification) => void;
  onNotificationResponse?: (response: Notifications.NotificationResponse) => void;
}

/**
 * Hook for handling notifications in components
 * 
 * @param options - Configuration object with callbacks
 * @returns Void
 * 
 * @example
 * useNotifications({
 *   onNotificationReceived: (notification) => {
 *     console.log('Notification received:', notification);
 *   },
 *   onNotificationResponse: (response) => {
 *     console.log('Notification tapped:', response);
 *   },
 * });
 */
export function useNotifications(options?: UseNotificationsOptions) {
  useEffect(() => {
    if (!options?.onNotificationReceived && !options?.onNotificationResponse) {
      return;
    }

    const unsubscribe = notificationService.registerHandler({
      onNotificationReceived: options?.onNotificationReceived,
      onNotificationResponse: options?.onNotificationResponse,
    });

    return unsubscribe;
  }, [options?.onNotificationReceived, options?.onNotificationResponse]);
}

/**
 * Hook to get the current expo push token
 * 
 * @returns The expo push token string or null
 */
export function usePushToken(): string | null {
  return notificationService.getExpoPushToken();
}

/**
 * Hook to send a test notification
 * 
 * @returns Function to send a test notification
 */
export function useSendTestNotification() {
  return useCallback(async () => {
    await notificationService.sendTestNotification();
  }, []);
}
