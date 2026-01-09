export interface Message {
  id?: string;
  text: string;
  senderName: string;
  senderUid: string;
  chatViewId?: string;
  createdAt?: string | number;
}

export interface ChatView {
  id: string;
  title: string;
  isLoading: boolean;
  messages: Message[];
  error: string | null;
  lastSeenTimestamp?: number;
  unreadCount?: number;
}