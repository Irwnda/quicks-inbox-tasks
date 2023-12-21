export type Task = {
  id: number;
  date: Date | null;
  title: string;
  description: string;
  status: 'done' | 'undone';
  stickers: Sticker[];
};

export const initialNewTask: Task = {
  id: -1,
  title: '',
  date: new Date(),
  description: '',
  status: 'undone',
  stickers: [],
};

export type Sticker = {
  id: number;
  title: string;
  backgroundColor: string;
};

export const initialStickers: Sticker[] = [
  {
    id: 1,
    title: 'Important ASAP',
    backgroundColor: '#E5F1FF',
  },
  {
    id: 2,
    title: 'Offline Meeting',
    backgroundColor: '#FDCFA4',
  },
  {
    id: 3,
    title: 'Virtual Meeting',
    backgroundColor: '#F9E9C3',
  },
  {
    id: 4,
    title: 'ASAP',
    backgroundColor: '#AFEBDB',
  },
  {
    id: 5,
    title: 'Client Related',
    backgroundColor: '#CBF1C2',
  },
  {
    id: 6,
    title: 'Self Task',
    backgroundColor: '#CFCEF9',
  },
  {
    id: 7,
    title: 'Appointments',
    backgroundColor: '#F9E0FD',
  },
  {
    id: 8,
    title: 'Court Related',
    backgroundColor: '#9DD0ED',
  },
];
