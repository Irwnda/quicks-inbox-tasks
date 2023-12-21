'use client';

import Head from 'next/head';
import * as React from 'react';
import { BsLightningChargeFill } from 'react-icons/bs';
import { PiChatsDuotone } from 'react-icons/pi';
import { RiBookReadLine } from 'react-icons/ri';

import { cn } from '@/lib/utils';

import IconButton from '@/components/buttons/IconButton';

import InboxPage from '@/app/InboxPage';
import TasksPage from '@/app/TaskPage';

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
            activeMenu === 'inbox' && showMenu && setShowMenu(!showMenu);
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
            activeMenu === 'tasks' && showMenu && setShowMenu(!showMenu);
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
