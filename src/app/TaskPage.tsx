import {
  Accordion,
  AccordionControlProps,
  Button,
  Center,
  Checkbox,
  Menu,
  Select,
  Textarea,
  TextInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import React from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { GoClock } from 'react-icons/go';
import { HiOutlinePencil } from 'react-icons/hi';
import { IoBookmarksOutline } from 'react-icons/io5';

import '@mantine/core/styles.css';

import { getDaysLeft, isDateInRange } from '@/lib/helper';
import { cn } from '@/lib/utils';

import LoadingComponent from '@/app/Loading';

import { initialNewTask, initialStickers, Task } from '@/types/tasks';

export default function TasksPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = React.useState<Task[]>([]);
  const [undoneTasks, setUndoneTasks] = React.useState<Task[]>([]);
  const [addMode, setAddMode] = React.useState(false);
  const [newTask, setNewTask] = React.useState<Task>(initialNewTask);

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
    <div className='flex h-full flex-col overflow-hidden py-6 pl-8'>
      <div className='flex justify-between pr-8'>
        <Select
          clearable
          placeholder='My Tasks'
          data={['Personal Errands', 'Urgent To-Do']}
        />
        <Button
          onClick={() => {
            if (!addMode) setAddMode(true);
            else {
              const tempTasks = [
                ...tasks,
                {
                  ...newTask,
                  id: tasks.length,
                },
              ].sort((a, b) => {
                if (a.date && b.date)
                  return (
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                  );
                return 0;
              });

              setTasks(tempTasks);
              setNewTask(initialNewTask);
              setAddMode(false);
            }
          }}
        >
          New Task
        </Button>
      </div>
      <Accordion multiple className='mt-4 overflow-y-scroll pr-4'>
        {undoneTasks.map((item) => (
          <TaskItem
            key={item.id}
            item={item}
            setTasks={setTasks}
            setNewTask={setNewTask}
          />
        ))}
        {doneTasks.map((item) => (
          <TaskItem
            key={item.id}
            item={item}
            setTasks={setTasks}
            setNewTask={setNewTask}
          />
        ))}
        {addMode && (
          <TaskItem
            key={newTask.id}
            item={newTask}
            setTasks={setTasks}
            setNewTask={setNewTask}
          />
        )}
      </Accordion>
    </div>
  );
}

function TaskItem({
  item,
  setTasks,
  setNewTask,
}: {
  item: Task;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setNewTask: React.Dispatch<React.SetStateAction<Task>>;
}) {
  const [value, setValue] = React.useState<Date | null>(
    new Date(item.date ?? '')
  );
  const [editMode, setEditMode] = React.useState(item.id === -1);
  const [openStickerMenu, setOpenStickerMenu] = React.useState(false);

  React.useEffect(() => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === item.id) {
          return {
            ...task,
            date: new Date(value ?? ''),
          };
        }
        return task;
      })
    );

    if (item.id === -1) {
      setNewTask((prev) => ({
        ...prev,
        date: new Date(value ?? ''),
      }));
    }
  }, [item.id, setNewTask, setTasks, value]);

  return (
    <Accordion.Item key={item.id} value={item.id.toString()}>
      <AccordionControl index={item.id} setTasks={setTasks} currentTask={item}>
        <div className='mr-4 flex items-center justify-between'>
          {item.id === -1 ? (
            <TextInput
              value={item.title}
              onChange={(event) => {
                setNewTask((prev) => ({
                  ...prev,
                  title: event.currentTarget?.value ?? '',
                }));
              }}
            />
          ) : (
            <div
              className={cn(
                'text-sm font-semibold',
                item.status === 'done' && 'text-gray-3 line-through'
              )}
            >
              {item.title}
            </div>
          )}
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
        <div className='flex items-center gap-4 p-2'>
          <GoClock size={24} className='text-blue-1' />
          <DateInput value={value} onChange={setValue} minDate={new Date()} />
        </div>
        <div className='mt-2 flex items-start gap-4 p-2'>
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
              placeholder='No description'
              value={item.description}
              onChange={(event) => {
                if (item.id === -1) {
                  setNewTask((prev) => ({
                    ...prev,
                    description: event.currentTarget?.value ?? '',
                  }));
                } else
                  setTasks((prev) =>
                    prev.map((task) => {
                      if (task.id === item.id) {
                        return {
                          ...task,
                          description: event.currentTarget?.value ?? '',
                        };
                      }
                      return task;
                    })
                  );
              }}
            />
          ) : (
            <div className='w-5/6 text-sm'>
              {item.description !== '' ? item.description : 'No Description'}
            </div>
          )}
        </div>
        <Menu
          opened={openStickerMenu}
          onChange={setOpenStickerMenu}
          position='bottom-start'
          width={300}
        >
          <div className='mt-2 rounded-md bg-[#F9F9F9] p-2'>
            <Menu.Target>
              <button className='flex w-full items-start gap-4'>
                <IoBookmarksOutline size={24} className='text-blue-1' />
                <div className='flex flex-wrap gap-2'>
                  {item.stickers.map((sticker) => (
                    <div
                      key={sticker.id}
                      className='rounded-lg px-3 py-1.5 text-xs font-bold'
                      style={{ backgroundColor: sticker.backgroundColor }}
                    >
                      {sticker.title}
                    </div>
                  ))}
                </div>
              </button>
            </Menu.Target>
          </div>
          <Menu.Dropdown>
            {initialStickers.map((sticker) => (
              <Menu.Item
                key={sticker.id}
                onClick={() => {
                  setTasks((prev) =>
                    prev.map((task) => {
                      if (task.id === item.id) {
                        if (
                          task.stickers
                            .map((sticker) => sticker.id)
                            .includes(sticker.id)
                        ) {
                          return {
                            ...task,
                            stickers: task.stickers.filter(
                              (itemSticker) => itemSticker.id !== sticker.id
                            ),
                          };
                        }
                        return {
                          ...task,
                          stickers: [...task.stickers, sticker],
                        };
                      }
                      return task;
                    })
                  );
                }}
              >
                <div
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-bold',
                    item.stickers
                      .map((sticker) => sticker.id)
                      .includes(sticker.id) && 'border-blue-1 border'
                  )}
                  style={{ backgroundColor: sticker.backgroundColor }}
                >
                  {sticker.title}
                </div>
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
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
