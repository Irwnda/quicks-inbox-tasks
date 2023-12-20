export const user: User[] = [
  {
    id: 0,
    name: 'Claren',
  },
  {
    id: 1,
    name: 'Mary Hilda',
  },
  {
    id: 2,
    name: 'Obaidullah Amarkhil',
  },
];

export const groups: GroupChats[] = [
  {
    id: 1,
    type: 'group',
    name: 'I-589 - AMARKHIL, Obaidullah [Affirmative Filling with ZNH]',
    numberOfParticipants: 3,
    chats: [
      {
        id: 1,
        sender: 1,
        message: 'Just Fill me in for this updates yea?',
        datetime: new Date(new Date(new Date().getDate() - 2).setHours(19, 32)),
        replyTo: null,
        status: 'read',
      },
      {
        id: 2,
        sender: 0,
        message:
          "No worries. It will be completed ASAP. I've asked him yesterday.",
        datetime: new Date(
          new Date(new Date().getDate() - 2).setHours(19, 32, 50)
        ),
        replyTo: null,
        status: 'read',
      },
      {
        id: 3,
        sender: 1,
        message:
          'Hello Obaidullah, I will be your case advisor for case #029290. I have assigned some homework for you to fill. Please keep up with the due dates. Should you have any questions, you can message me anytime. Thanks.',
        datetime: new Date(new Date(new Date().getDate() - 1).setHours(19, 33)),
        replyTo: null,
        status: 'read',
      },
      {
        id: 4,
        sender: 0,
        message:
          'Please contact Mary for questions regarding the case bcs she will be managing your forms from now on! Thanks Mary.',
        datetime: new Date(new Date(new Date().getDate() - 1).setHours(19, 37)),
        replyTo: null,
        status: 'read',
      },
      {
        id: 5,
        sender: 1,
        message: 'Sure thing, Claren.',
        datetime: new Date(new Date(new Date().getDate() - 1).setHours(19, 44)),
        replyTo: null,
        status: 'read',
      },
      {
        id: 6,
        sender: 2,
        message: "Morning. I'll try to do them. Thanks",
        datetime: new Date(new Date(new Date().getDate()).setHours(8, 33)),
        replyTo: null,
        status: 'unread',
      },
    ],
  },
  {
    id: 2,
    type: 'private',
    name: 'Fast Visa Support',
    numberOfParticipants: 2,
    chats: [
      {
        id: 7,
        sender: 0,
        message: 'Hello, how can I help you?',
        datetime: new Date(new Date(new Date().getDate()).setHours(8, 33)),
        replyTo: null,
        status: 'read',
      },
    ],
  },
];

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
