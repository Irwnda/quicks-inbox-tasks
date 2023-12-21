export type Task = {
  id: number;
  date: Date | null;
  title: string;
  description: string;
  status: 'done' | 'undone';
};

export const initialNewTask: Task = {
  id: -1,
  title: '',
  date: new Date(),
  description: '',
  status: 'undone',
};
