'use client';

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
import { Chat, Group, groups } from '@/components/dummy/chats';

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
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [selectedGroup, setSelectedGroup] = React.useState<Group | null>(null);

  if (isLoading)
    return (
      <div>
        <LoadingComponent msg='Loading Chats...' />
      </div>
    );

  if (page === 'group')
    return (
      <GroupChats
        chats={groups}
        setChats={setChats}
        setPage={setPage}
        setSelectedGroup={setSelectedGroup}
      />
    );

  return (
    <DetailedChats
      chats={chats}
      setPage={setPage}
      groupName={selectedGroup?.name ?? ''}
    />
  );
}

function GroupChats(props: {
  chats: Group[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  setPage: React.Dispatch<React.SetStateAction<string>>;
  setSelectedGroup: React.Dispatch<React.SetStateAction<Group | null>>;
}) {
  return (
    <div className='flex flex-col divide-y px-8 py-6'>
      {props.chats.map((chat) => (
        <Button
          variant='ghost'
          key={chat.id}
          onClick={() => {
            props.setChats(chat.chats);
            props.setPage('detailed');
            props.setSelectedGroup(chat);
          }}
        >
          x
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
function DetailedChats(props: {
  chats: Chat[];
  setPage: React.Dispatch<React.SetStateAction<string>>;
  groupName: string;
}) {
  const [participants, setParticipants] = React.useState<number[]>([]);

  React.useEffect(() => {
    setParticipants(getUnique(props.chats.map((chat) => chat.sender)));
  }, [props.chats]);

  return (
    <div>
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
          <div className='text-blue-1'>{props.groupName}</div>
          <div className='text-gray-1 text-xs'>
            {participants.length} Participants
          </div>
        </div>
      </div>
      b
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
