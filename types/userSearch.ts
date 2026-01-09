import { User } from "@/utils/userUtils";

export interface UserSearchProps {
  selectedUsers: User[];
  onSelectUser: (user: User) => void;
  onRemoveUser: (userUid: string) => void;
  currentUserUid: string;
}