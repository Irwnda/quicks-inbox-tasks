export type Chat = {
  id: number;
  sender: number;
  message: string;
  datetime: Date;
  replyTo: number | null;
  status: 'read' | 'unread';
};

export type User = {
  id: number;
  name: string;
};

export type Group = {
  id: number;
  type: 'group' | 'private';
  name: string;
  numberOfParticipants: number;
  lastChat?: Omit<Chat, 'id' | 'replyTo'>;
};

export type GroupChats = Group & {
  chats: Chat[];
};
