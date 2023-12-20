import { faker } from '@faker-js/faker';
import { NextRequest, NextResponse } from 'next/server';

import { Chat } from '@/components/dummy/chats';

export async function GET(request: NextRequest) {
  const unreadMessages = Math.floor(Math.random() * 10) + 1;
  const chats: Chat[] = [];
  const readMessages = Math.floor(Math.random() * 10) + 1;
  const searchParams = new URL(request.nextUrl).searchParams;
  const numberOfParticipants = Number(searchParams.get('participants') ?? 5);

  const dateTimes: Date[] = [];

  for (let i = 0; i < unreadMessages + readMessages; i++) {
    const date = faker.date.recent({ days: 3 });
    dateTimes.push(date);
  }

  dateTimes.sort((a, b) => a.getTime() - b.getTime());

  for (let i = 0; i < unreadMessages + readMessages; i++) {
    const sender = Math.floor(Math.random() * numberOfParticipants);
    const message = faker.lorem.sentence(Math.floor(Math.random() * 3) + 1);
    const datetime = dateTimes[i];
    const replyTo = null;
    const status = i >= readMessages ? 'unread' : 'read';

    chats.push({
      id: i,
      sender,
      message,
      datetime,
      replyTo,
      status,
    });
  }
  return NextResponse.json(chats);
}
