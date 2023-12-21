export type Task = {
  id: number;
  title: string;
  date: Date;
  description: string;
  status: 'done' | 'undone';
};
