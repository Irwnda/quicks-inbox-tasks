'use client';

import { faker } from '@faker-js/faker';
import { Avatar } from '@mantine/core';
import Head from 'next/head';
import * as React from 'react';
import { BsLightningChargeFill } from 'react-icons/bs';
import { FaArrowLeft } from 'react-icons/fa6';
import { ImSpinner2 } from 'react-icons/im';
import { PiChatsDuotone } from 'react-icons/pi';
import { RiBookReadLine } from 'react-icons/ri';

import { cn } from '@/lib/utils';

import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import { Chat, Group, User } from '@/components/dummy/chats';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

export default function HomePage() {
  const [showMenu, setShowMenu] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState<'inbox' | 'tasks' | ''>(
    ''
  );

  const mainRef = React.useRef<HTMLDivElement>(null);

  const [elementWidth, setElementWidth] = React.useState(0);

  React.useEffect(() => {
    if (mainRef.current) {
      setElementWidth(mainRef.current.offsetWidth * 0.5);
    }
  }, [mainRef]);
  return (
    <main className='relative flex-grow border-l border-gray-400' ref={mainRef}>
      <Head>
        <title>Quicks Inbox and Tasks</title>
      </Head>

      <div>
        <IconButton
          onClick={() => {
            activeMenu !== 'tasks' && setActiveMenu('tasks');
            activeMenu !== 'inbox' && setShowMenu(!showMenu);
          }}
          icon={RiBookReadLine}
          variant='ghost'
          className={cn(
            'fixed bottom-4 h-16 w-16 rounded-full bg-white text-[#F8B76B]',
            showMenu && ['right-44'],
            !showMenu && [
              activeMenu === 'inbox'
                ? 'right-28'
                : 'right-4 !bg-[#F8B76B] !text-white',
            ],
            'transition-all duration-300',
            activeMenu === 'tasks' && 'z-50'
          )}
          classNames={{
            icon: 'w-8 h-8',
          }}
        />
        <IconButton
          onClick={() => {
            activeMenu !== 'inbox' && setActiveMenu('inbox');
            activeMenu !== 'tasks' && setShowMenu(!showMenu);
          }}
          icon={PiChatsDuotone}
          variant='ghost'
          className={cn(
            'fixed bottom-4 h-16 w-16 rounded-full bg-white text-[#8885FF]',
            showMenu && ['right-24'],
            !showMenu && [
              activeMenu === 'tasks'
                ? 'right-28'
                : 'right-4 !bg-[#8885FF] !text-white',
            ],
            'transition-all duration-300',
            activeMenu === 'inbox' && 'z-50'
          )}
          classNames={{
            icon: 'w-8 h-8',
          }}
        />
        <div
          className={cn(
            'fixed bottom-4 right-8 h-16 w-16 rounded-full bg-gray-700 transition-all duration-300',
            activeMenu !== '' && !showMenu ? 'block' : 'hidden'
          )}
        ></div>
        <IconButton
          onClick={() => {
            setActiveMenu('');
            setShowMenu(!showMenu);
          }}
          icon={BsLightningChargeFill}
          className={cn(
            'bg-blue-1 fixed bottom-4 right-4 h-16 w-16 rounded-full'
          )}
          classNames={{
            icon: 'w-8 h-8',
          }}
        />

        <PageWrapper
          activeMenu={activeMenu}
          elementWidth={elementWidth}
          showMenu={showMenu}
          menuType='inbox'
        >
          <InboxPage />
        </PageWrapper>

        <PageWrapper
          activeMenu={activeMenu}
          elementWidth={elementWidth}
          showMenu={showMenu}
          menuType='tasks'
        >
          <TasksPage />
        </PageWrapper>
      </div>
    </main>
  );
}

function PageWrapper({
  activeMenu,
  children,
  elementWidth,
  showMenu,
  menuType,
}: {
  activeMenu: 'inbox' | 'tasks' | '';
  children: React.ReactNode;
  elementWidth: number;
  showMenu: boolean;
  menuType: 'inbox' | 'tasks';
}) {
  return (
    <div
      className={cn(
        'fixed bottom-24 right-4 max-h-[737px] max-w-[734px] overflow-hidden rounded bg-white transition-all duration-300',
        activeMenu === menuType && !showMenu ? 'opacity-100' : 'p-0 opacity-50'
      )}
      style={
        activeMenu === menuType && !showMenu
          ? {
              width: elementWidth,
              height: '70vh',
            }
          : {
              width: 0,
              height: 0,
            }
      }
    >
      {children}
    </div>
  );
}

function InboxPage() {
  const [isLoading, _] = React.useState(false);
  const [page, setPage] = React.useState('group');
  const [selectedGroup, setSelectedGroup] = React.useState<Group | null>(null);

  if (isLoading)
    return (
      <div>
        <LoadingComponent msg='Loading Chats...' />
      </div>
    );

  if (page === 'group')
    return <GroupChats setPage={setPage} setSelectedGroup={setSelectedGroup} />;

  return <DetailedChats setPage={setPage} group={selectedGroup as Group} />;
}

function GroupChats(props: {
  setPage: React.Dispatch<React.SetStateAction<string>>;
  setSelectedGroup: React.Dispatch<React.SetStateAction<Group | null>>;
}) {
  const [chats, setChats] = React.useState<Group[]>([]);

  React.useEffect(() => {
    fetch('/api/groups')
      .then((res) => res.json())
      .then((data) => {
        setChats(data);
      });
  }, []);

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
  '#885053',
  '#FE5F55',
  '#DA6C9C',
  '#A6C6DE',
  '#7DA0F2',
  '#8EBFE1',
  '#85CEFE',
];

const textColors = [
  '#E5A443',
  '#9B51E0',
  '#43B78D',
  '#2E2F2F',
  '#E53D00',
  '#82204A',
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

function TasksPage() {
  const [isLoading, _] = React.useState(true);
  return (
    <div>{isLoading && <LoadingComponent msg='Loading Task List...' />}</div>
  );
}

function LoadingComponent({ msg }: { msg: string }) {
  return (
    <div
      className={cn(
        'absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-lg text-gray-400'
      )}
    >
      <ImSpinner2 className='animate-spin text-4xl' />
      <span>{msg}</span>
    </div>
  );
}
