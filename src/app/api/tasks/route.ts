import { faker } from '@faker-js/faker';
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
      title: faker.lorem.sentence(5),
      date: dateTimes[i],
      description: Array.from({ length: Math.floor(Math.random() * 3 + 1) })
        .map(() => faker.lorem.sentence())
        .join(' '),
      status: Math.floor(Math.random() * 10) < 3 ? 'done' : 'undone',
    });
  }

  return NextResponse.json(tasks);
}
