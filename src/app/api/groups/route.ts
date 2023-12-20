import { faker } from '@faker-js/faker';
import { NextResponse } from 'next/server';

import { Group } from '@/components/dummy/chats';

export async function GET() {
  const groups: Group[] = [];
  const randomCount = Math.floor(Math.random() * 10) + 1;

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
        datetime: faker.date.recent(),
        status: Math.floor(Math.random() * 2) % 2 === 0 ? 'read' : 'unread',
      },
    });
  }
  return NextResponse.json(groups);
}
