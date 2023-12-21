import { faker } from '@faker-js/faker';
import { Avatar, Menu, TextInput } from '@mantine/core';
import React from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { FaArrowLeft } from 'react-icons/fa6';
import { HiX } from 'react-icons/hi';

import { cn } from '@/lib/utils';

import Button from '@/components/buttons/Button';
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
    <div className='flex h-full overflow-hidden py-6 pl-8'>
      <div className='w-full divide-y overflow-y-scroll'>
        {chats.map((chat) => (
          <Button
            variant='ghost'
            key={chat.id}
            onClick={() => {
              props.setPage('detailed');
              props.setSelectedGroup(chat);
            }}
            className='flex w-full py-6'
          >
            {chat.type === 'private' ? (
              <Avatar.Group display='flex' className='w-1/6'>
                <Avatar
                  src={faker.image.avatar()}
                  className='[&_img]:h-10 [&_img]:w-10 [&_img]:rounded-full'
                />
              </Avatar.Group>
            ) : (
              <Avatar.Group display='flex' className='w-1/6'>
                {Array.from({
                  length: Math.min(2, chat.numberOfParticipants),
                }).map((_, i) => (
                  <Avatar
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
  const [firstUnread, setFirstUnread] = React.useState<number>(-1);
  const [lastUserMessageIndex, setLastUserMessageIndex] = React.useState(-1);
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
  const [isNewMessageTextVisible, setIsNewMessageTextVisible] =
    React.useState(false);
  const [newUserMessage, setNewUserMessage] = React.useState('');
  const [messageReply, setMessageReply] = React.useState<
    | (Chat & {
        user: User;
      })
    | null
  >(null);

  const newMessageRef = React.useRef<HTMLDivElement>(null);
  const textInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (newMessageRef.current) {
      newMessageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 1,
      };

      const callback: IntersectionObserverCallback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsNewMessageTextVisible(true);
          } else {
            setIsNewMessageTextVisible(false);
          }
        });
      };

      const observer = new IntersectionObserver(callback, options);

      if (newMessageRef.current) {
        observer.observe(newMessageRef.current);
      }

      // Cleanup the observer on component unmount
      return () => observer.disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMessageRef.current]);

  React.useEffect(() => {
    setFirstUnread(-1);
    setParticipants(getUnique(chats.map((chat) => chat.sender)));
    setDates(getUniqueDate(chats.map((chat) => chat.datetime)));
    setLastUserMessageIndex(
      chats.length -
        chats
          .slice()
          .reverse()
          .findIndex((chat) => chat.sender === 0)
    );
  }, [chats]);

  React.useEffect(() => {
    const unreadChats = chats.slice(lastUserMessageIndex);
    if (unreadChats.length > 0) {
      setFirstUnread(unreadChats[0].id);
    }
  }, [chats, lastUserMessageIndex]);

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
      <div className='relative overflow-y-scroll'>
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
                  <>
                    {chat.id === firstUnread && (
                      <div
                        className='mt-2 flex w-full items-center justify-between gap-4'
                        ref={newMessageRef}
                        key='new-message'
                      >
                        <div className='h-0.5 flex-grow bg-[#EB5757]'></div>
                        <div className='flex items-center justify-center bg-white text-sm font-bold text-[#EB5757]'>
                          New Message
                        </div>
                        <div className='h-0.5 flex-grow bg-[#EB5757]'></div>
                      </div>
                    )}
                    <BubbleChat
                      key={chat.id}
                      chat={chat}
                      chats={chats}
                      randomColors={randomColors}
                      textColors={textColors}
                      backgroundColors={backgroundColors}
                      setMessageReply={setMessageReply}
                    />
                  </>
                ))}
            </div>
          </div>
        ))}
      </div>
      <Button
        variant='ghost'
        onClick={() => {
          if (newMessageRef.current) {
            newMessageRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        }}
        className={cn(
          'text-blue-1 absolute bottom-20 left-1/2 rounded-md bg-[#E9F3FF] px-4 py-2 text-sm font-bold',
          (isNewMessageTextVisible || firstUnread === -1) && 'hidden'
        )}
        style={{ transform: 'translateX(-50%)' }}
      >
        New Message
      </Button>
      <form
        className='relative flex items-end justify-between gap-4 px-8 py-4'
        onSubmit={(e) => {
          e.preventDefault();
          const newChat: Chat = {
            id: chats.length + 1,
            message: newUserMessage,
            sender: 0,
            datetime: new Date(),
            replyTo: messageReply?.id ?? null,
            status: 'read',
          };
          setMessageReply(null);
          const newChats = [...chats, newChat];
          setChats(newChats);
          setNewUserMessage('');
          setFirstUnread(-1);
        }}
      >
        <div className='w-full'>
          <div
            className={cn(
              'bg-gray-6 absolute bottom-12 rounded-t-lg px-4 py-2',
              messageReply ? 'block' : 'hidden'
            )}
            style={{
              width: textInputRef.current?.offsetWidth ?? 0,
            }}
          >
            <div className='flex justify-between'>
              <div className='text-sm font-bold'>
                Replying to{' '}
                {messageReply?.user.id ? messageReply?.user.name : 'You'}
              </div>
              <button
                className='text-gray-1 text-sm'
                onClick={() => {
                  setMessageReply(null);
                }}
                type='button'
              >
                <HiX />
              </button>
            </div>
            <p className='line-clamp-3 text-xs'>
              {messageReply?.message ?? ''}
            </p>
          </div>
          <TextInput
            ref={textInputRef}
            placeholder='Type a new message'
            value={newUserMessage}
            onChange={(e) => {
              setNewUserMessage(e.currentTarget.value);
            }}
          />
        </div>
        <Button type='submit' className='h-fit'>
          Send
        </Button>
      </form>
    </div>
  );
}

function BubbleChat({
  chat,
  chats,
  randomColors,
  textColors,
  backgroundColors,
  setMessageReply,
}: {
  chat: Chat & { user: User };
  chats: Chat[];
  randomColors: number[];
  textColors: string[];
  backgroundColors: string[];
  setMessageReply: React.Dispatch<
    React.SetStateAction<(Chat & { user: User }) | null>
  >;
}) {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div
      key={chat.id}
      className={chat.sender === 0 ? 'flex justify-end' : 'flex justify-start'}
    >
      <div className='w-4/5'>
        <p
          className={cn(
            'mt-2 rounded-[10px] text-sm',
            //  text-[#E5A443]
            chat.sender === 0 && 'text-right'
          )}
          style={{
            color: textColors[randomColors[chat.sender]],
          }}
        >
          {chat.sender === 0 ? 'You' : chat.user?.name ?? 'No Name'}
        </p>
        <div
          className={cn(
            'bg-gray-5 my-2 rounded-md px-4 py-2 text-sm',
            chat.replyTo ? 'block' : 'hidden'
          )}
        >
          {chats.find((c) => c.id === chat.replyTo)?.message ??
            'This message has been deleted.'}
        </div>
        <div
          className={cn('flex gap-2', chat.sender === 0 && 'flex-row-reverse')}
        >
          <div
            className={cn(
              'text-gray-2 rounded-md p-[10px]'
              // bg-[#FCEED3]
            )}
            style={{
              backgroundColor: backgroundColors[randomColors[chat.sender]],
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
          <div>
            <Menu opened={showMenu} onChange={setShowMenu}>
              <Menu.Target>
                <Button variant='ghost'>
                  <BsThreeDots size='1rem' />
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>Share</Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  onClick={() => {
                    setMessageReply(chat);
                  }}
                >
                  Reply
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
}
