import { faker } from '@faker-js/faker';
import { NextRequest, NextResponse } from 'next/server';

import { getDateTimes } from '@/lib/helper';

import { Chat } from '@/types/inbox';

export async function GET(request: NextRequest) {
  const unreadMessages = Math.floor(Math.random() * 10) + 1;
  const chats: Chat[] = [];
  const readMessages = Math.floor(Math.random() * 10) + 1;
  const searchParams = new URL(request.nextUrl).searchParams;
  const numberOfParticipants = Number(searchParams.get('participants') ?? 5);

  const dateTimes: Date[] = getDateTimes(unreadMessages + readMessages);

  for (let i = 0; i < unreadMessages + readMessages; i++) {
    const sender = Math.floor(Math.random() * numberOfParticipants);
    const message = Array.from({
      length: Math.floor(Math.random() * 2) + 1,
    })
      .map(() => faker.lorem.sentence())
      .join(' ');
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
