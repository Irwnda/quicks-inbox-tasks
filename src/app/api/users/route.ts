import { faker } from '@faker-js/faker';
import { NextRequest, NextResponse } from 'next/server';

import { User } from '@/types/inbox';

export async function GET(request: NextRequest) {
  const searchParams = new URL(request.nextUrl).searchParams;
  const count = Number(searchParams.get('count') ?? 5);
  const users: User[] = [];

  for (let i = 0; i < count; i++) {
    users.push({
      id: i,
      name: faker.person.fullName(),
    });
  }

  return NextResponse.json(users);
}
