import {
  Accordion,
  AccordionControlProps,
  Button,
  Center,
  Checkbox,
  Menu,
  Select,
  Textarea,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import React from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { GoClock } from 'react-icons/go';
import { HiOutlinePencil } from 'react-icons/hi';

import { getDaysLeft, isDateInRange } from '@/lib/helper';
import { cn } from '@/lib/utils';

import LoadingComponent from '@/app/Loading';

import { Task } from '@/types/tasks';

export default function TasksPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = React.useState<Task[]>([]);
  const [undoneTasks, setUndoneTasks] = React.useState<Task[]>([]);

  React.useEffect(() => {
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setIsLoading(false);
      });
  }, []);

  React.useEffect(() => {
    setDoneTasks(tasks.filter((task) => task.status === 'done'));
    setUndoneTasks(tasks.filter((task) => task.status === 'undone'));
  }, [tasks]);

  if (isLoading)
    return (
      <div>{isLoading && <LoadingComponent msg='Loading Task List...' />}</div>
    );

  return (
    <div className='flex h-full flex-col overflow-hidden px-8 py-6'>
      <div className='flex justify-between'>
        <Select
          clearable
          placeholder='My Tasks'
          data={['Personal Errands', 'Urgent To-Do']}
        />
        <Button>New Task</Button>
      </div>
      <Accordion multiple className='mt-4 overflow-y-scroll'>
        {undoneTasks.map((item) => (
          <TaskItem key={item.id} item={item} setTasks={setTasks} />
        ))}
        {doneTasks.map((item) => (
          <TaskItem key={item.id} item={item} setTasks={setTasks} />
        ))}
      </Accordion>
    </div>
  );
}

function TaskItem({
  item,
  setTasks,
}: {
  item: Task;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  const [value, setValue] = React.useState<Date | null>(
    new Date(item.date ?? '')
  );
  const [editMode, setEditMode] = React.useState(false);
  const [textAreaValue, setTextAreaValue] = React.useState(item.description);

  React.useEffect(() => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === item.id) {
          return {
            ...task,
            date: new Date(value?.toISOString() ?? ''),
          };
        }
        return task;
      })
    );
  }, [item.id, setTasks, value]);

  React.useEffect(() => {
    if (!editMode)
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === item.id) {
            return {
              ...task,
              description: textAreaValue,
            };
          }
          return task;
        })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode]);
  return (
    <Accordion.Item key={item.id} value={item.id.toString()}>
      <AccordionControl index={item.id} setTasks={setTasks} currentTask={item}>
        <div className='mr-4 flex items-center justify-between'>
          <div
            className={cn(
              'text-sm font-semibold',
              item.status === 'done' && 'text-gray-3 line-through'
            )}
          >
            {item.title}
          </div>
          <div className='flex items-center gap-4 text-xs'>
            <span
              className={cn(
                'whitespace-nowrap text-red-500',
                isDateInRange(new Date(item.date ?? ''), new Date(), 7) &&
                  item.status === 'undone'
                  ? 'block'
                  : 'hidden'
              )}
            >
              {getDaysLeft(new Date(item.date ?? ''))}
            </span>
            <span>{new Date(item.date ?? '').toLocaleDateString()}</span>
          </div>
        </div>
      </AccordionControl>
      <Accordion.Panel>
        <div className='flex items-center gap-4'>
          <GoClock size={24} className='text-blue-1' />
          <DateInput value={value} onChange={setValue} />
        </div>
        <div className='mt-2 flex gap-4'>
          <button
            onClick={() => {
              setEditMode(!editMode);
            }}
          >
            <HiOutlinePencil size={24} className='text-blue-1' />
          </button>
          {editMode ? (
            <Textarea
              className='w-5/6 text-sm'
              value={textAreaValue}
              onChange={(event) => setTextAreaValue(event.currentTarget.value)}
            />
          ) : (
            <div className='w-5/6 text-sm'>{item.description}</div>
          )}
        </div>
      </Accordion.Panel>
    </Accordion.Item>
  );
}

function AccordionControl(
  props: AccordionControlProps & {
    index: number;
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    currentTask: Task;
  }
) {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <Center>
      <Checkbox
        checked={props.currentTask.status === 'done'}
        onChange={(e) => {
          props.setTasks((prev) =>
            prev.map((task) => {
              if (task.id === props.index) {
                return {
                  ...task,
                  status: e.target.checked ? 'done' : 'undone',
                };
              }
              return task;
            })
          );
        }}
      />
      <Accordion.Control {...props} />
      <Menu opened={showMenu} onChange={setShowMenu}>
        <Menu.Target>
          <Button variant='ghost'>
            <BsThreeDots size='1rem' />
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            color='red'
            onClick={() => {
              props.setTasks((prev) =>
                prev.filter((task) => task.id !== props.index)
              );
            }}
          >
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Center>
  );
}
