import { NextResponse } from 'next/server';

import { getDateTimes } from '@/lib/helper';

import { Task } from '@/types/tasks';

export async function GET() {
  const taskCount = Math.floor(Math.random() * 10 + 1);
  const tasks: Task[] = [];

  const dateTimes: Date[] = getDateTimes(taskCount, 14, 'asc', 'future');

  for (let i = 0; i < taskCount; i++) {
    tasks.push({
      id: i,
      title: `Task ${i}`,
      date: dateTimes[i],
      description: `Description for Task ${i}`,
      status: Math.floor(Math.random() * 10) < 3 ? 'done' : 'undone',
    });
  }

  return NextResponse.json(tasks);
}
