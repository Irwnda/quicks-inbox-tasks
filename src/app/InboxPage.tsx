import { faker } from '@faker-js/faker';
import { Avatar, Button } from '@mantine/core';
import React from 'react';
import { FaArrowLeft } from 'react-icons/fa6';

import { cn } from '@/lib/utils';

import IconButton from '@/components/buttons/IconButton';

import LoadingComponent from '@/app/Loading';

import { Chat, Group, User } from '@/types/inbox';

export default function InboxPage() {
  const [page, setPage] = React.useState('group');
  const [selectedGroup, setSelectedGroup] = React.useState<Group | null>(null);

  if (page === 'group')
    return <GroupChats setPage={setPage} setSelectedGroup={setSelectedGroup} />;

  return <DetailedChats setPage={setPage} group={selectedGroup as Group} />;
}

function GroupChats(props: {
  setPage: React.Dispatch<React.SetStateAction<string>>;
  setSelectedGroup: React.Dispatch<React.SetStateAction<Group | null>>;
}) {
  const [chats, setChats] = React.useState<Group[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/groups')
      .then((res) => res.json())
      .then((data) => {
        setChats(data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading)
    return (
      <div>
        <LoadingComponent msg='Loading Chats...' />
      </div>
    );

  return (
    <div className='flex flex-col divide-y px-8 py-6'>
      {chats.map((chat) => (
        <Button
          variant='ghost'
          key={chat.id}
          onClick={() => {
            props.setPage('detailed');
            props.setSelectedGroup(chat);
          }}
          className='flex py-6'
        >
          {chat.type === 'private' ? (
            <Avatar
              size='xs'
              src={faker.image.avatar()}
              className='w-1/6 [&_img]:h-10 [&_img]:w-10 [&_img]:rounded-full'
            />
          ) : (
            <Avatar.Group display='flex' className='w-1/6'>
              {Array.from({
                length: Math.min(2, chat.numberOfParticipants),
              }).map((_, i) => (
                <Avatar
                  size='xs'
                  src={faker.image.avatar()}
                  className={cn(
                    '[&_img]:h-10 [&_img]:w-10 [&_img]:rounded-full',
                    i !== 0 && 'ml-[-10px]'
                  )}
                  key={i}
                />
              ))}
            </Avatar.Group>
          )}
          <div className='w-5/6 text-left'>
            <div className='flex items-center gap-4'>
              {chat.name}
              <span className='text-xs text-[#4F4F4F]'>
                {new Date(chat.lastChat?.datetime ?? '').toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  }
                )}
              </span>
            </div>
            <div className='mt-2 text-sm text-black'>
              <div className='font-bold'>{faker.person.fullName()}</div>
              <div className='font-normal'>{chat.lastChat?.message}</div>
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
}

const getUnique = (arr: number[]) => {
  const unique: number[] = [];
  arr.forEach((item) => {
    if (!unique.includes(item)) unique.push(item);
  });
  return unique;
};

const getUniqueDate = (arr: Date[]) => {
  const unique: string[] = [];
  arr.forEach((item) => {
    const strDate = new Date(item).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!unique.includes(strDate)) unique.push(strDate);
  });
  return unique;
};

const backgroundColors = [
  '#FCEED3',
  '#EEDCFF',
  '#D2F2EA',
  '#BB8B8E',
  '#FE8D85',
  '#E79DBD',
  '#A6C6DE',
  '#7DA0F2',
  '#8EBFE1',
  '#85CEFE',
];

const textColors = [
  '#E5A443',
  '#9B51E0',
  '#43B78D',
  '#673C3F',
  '#CA0F02',
  '#A4285E',
  '#326186',
  '#0A2463',
  '#2B70A1',
  '#027ACA',
];

function DetailedChats(props: {
  setPage: React.Dispatch<React.SetStateAction<string>>;
  group: Group;
}) {
  const [participants, setParticipants] = React.useState<number[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [, setFirstUnread] = React.useState<number>(-1);
  const [randomColors, setRandomBackgroundColors] = React.useState<number[]>(
    []
  );
  const [dates, setDates] = React.useState<string[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [chatWithSenders, setChatWithSenders] = React.useState<
    (Chat & {
      user: User;
    })[]
  >([]);

  React.useEffect(() => {
    setParticipants(getUnique(chats.map((chat) => chat.sender)));
    setDates(getUniqueDate(chats.map((chat) => chat.datetime)));
    setFirstUnread(
      chats.findIndex((chat) => chat.sender !== 0 && chat.status === 'unread')
    );
  }, [chats]);

  React.useEffect(() => {
    if (participants.length && dates.length) setIsLoading(false);
  }, [dates.length, participants.length]);

  React.useEffect(() => {
    fetch(`/api/chats?participants=${props.group.numberOfParticipants}`)
      .then((res) => res.json())
      .then((data) => {
        setChats(data);
      });

    fetch(`/api/users?count=${props.group.numberOfParticipants}`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });

    const colors: number[] = [];
    for (let i = 0; i < props.group.numberOfParticipants; i++) {
      colors.push(Math.floor(Math.random() * backgroundColors.length));
    }
    setRandomBackgroundColors(colors);
  }, [props.group.numberOfParticipants]);

  React.useEffect(() => {
    const chatWithSender = chats.map((chat) => {
      const sender = users.find((user) => user.id === chat.sender);
      return {
        ...chat,
        user: sender,
      } as Chat & { user: User };
    });
    setChatWithSenders(chatWithSender);
  }, [chats, users]);

  if (isLoading)
    return (
      <div>
        <LoadingComponent msg='Loading Chats...' />
      </div>
    );

  return (
    <div className='flex h-full flex-col overflow-hidden'>
      <div className='flex items-center border-b px-8 py-6'>
        <IconButton
          icon={FaArrowLeft}
          variant='ghost'
          className='text-gray-1'
          onClick={() => {
            props.setPage('group');
          }}
        />
        <div>
          <div className='text-blue-1'>{props.group.name}</div>
          <div className='text-gray-1 text-xs'>
            {participants.length} Participants
          </div>
        </div>
      </div>
      <div className='overflow-y-scroll'>
        {dates.map((date, index) => (
          <div key={index} className='py-4'>
            <div className='flex w-full items-center justify-between gap-4 px-8'>
              <div className='bg-gray-2 h-0.5 flex-grow'></div>
              <div className='text-gray-2 flex items-center justify-center bg-white text-sm font-bold'>
                {date}
              </div>
              <div className='bg-gray-2 h-0.5 flex-grow'></div>
            </div>
            <div className='flex w-full flex-col gap-2 px-8 py-2'>
              {chatWithSenders
                .filter((chat) => {
                  const strDate = new Date(chat.datetime).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  );
                  return strDate === date;
                })
                .map((chat) => (
                  <div
                    key={chat.id}
                    className={
                      chat.sender === 0
                        ? 'flex justify-end'
                        : 'flex justify-start'
                    }
                  >
                    <div className='w-4/5'>
                      <p
                        className={cn(
                          'rounded-[10px] py-2 text-sm',
                          //  text-[#E5A443]
                          chat.sender === 0 && 'text-right'
                        )}
                        style={{
                          color: textColors[randomColors[chat.sender]],
                        }}
                      >
                        {chat.sender === 0
                          ? 'You'
                          : chat.user?.name ?? 'No Name'}
                      </p>
                      <div
                        className={cn(
                          'text-gray-2 rounded-md p-[10px]'
                          // bg-[#FCEED3]
                        )}
                        style={{
                          backgroundColor:
                            backgroundColors[randomColors[chat.sender]],
                        }}
                      >
                        <div>{chat.message}</div>
                        <div className='mt-2 text-xs'>
                          {new Date(chat.datetime).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: false,
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
