export type AvatarModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (uri: string) => void;
  currentAvatar?: string;
};
