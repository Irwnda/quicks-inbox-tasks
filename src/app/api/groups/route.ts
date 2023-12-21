import { faker } from '@faker-js/faker';
import { NextResponse } from 'next/server';

import { getDateTimes } from '@/lib/helper';

import { Group } from '@/types/inbox';

export async function GET() {
  const groups: Group[] = [];
  const randomCount = Math.floor(Math.random() * 10) + 1;

  const dateTimes: Date[] = getDateTimes(randomCount);

  for (let i = 0; i < randomCount; i++) {
    const type = Math.floor(Math.random() * 2) % 2 === 0 ? 'group' : 'private';
    groups.push({
      id: i,
      name: faker.internet.userName(),
      type,
      numberOfParticipants:
        type === 'group' ? Math.floor(Math.random() * 10) + 1 : 2,
      lastChat: {
        sender: 0,
        message: faker.lorem.sentence(),
        datetime: dateTimes[i],
        status: Math.floor(Math.random() * 2) % 2 === 0 ? 'read' : 'unread',
      },
    });
  }
  return NextResponse.json(groups);
}
