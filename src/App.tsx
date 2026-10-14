import './App.css'
import { useTask } from './store/useTask'
import { AddField } from './components/AddField';
import type { Task } from './types/Task';
import { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from './hooks/useLocaleStorage';
import { useIsMobile } from './hooks/useIsMobile';

import { MdDeleteForever, MdPause, MdPlayArrow, MdStop } from "react-icons/md";
import { formatTaskTime, getTaskElapsedSeconds } from './utils/time';

function App() {
  const tasks = useTask((state) => state.tasks);
  const changeStatus = useTask((state) => state.toggleTaskCompletion);
  const startTask = useTask((state) => state.startTask);
  const pauseTask = useTask((state) => state.pauseTask);
  const stopTask = useTask((state) => state.stopTask);
  const setTasks = useTask((state) => state.setTasks);
  const removeTask = useTask((state) => state.removeTask);

  const isMobile = useIsMobile();

  const [savedTasks, setSavedTasks] = useLocalStorage<Task[]>('tasks', []);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [now, setNow] = useState(0);
  const hasLoadedTasks = useRef(false);

  const [contextActive, setContextActive] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [menuCoords, setMenuCoords] = useState({ x: 0, y: 0 });

  const handleContext = (e: React.MouseEvent | React.TouchEvent, task: Task) => {
   if (e.type === 'dblclick' && !isMobile) return;
    if (e.type === 'contextmenu' && isMobile) return;

    e.preventDefault();

    const parentRect = e.currentTarget.closest('.max-w-lg')?.getBoundingClientRect();

    if (parentRect) {
      const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
      const clientY = 'clientY' in e ? e.clientY : e.touches[0].clientY;

      setMenuCoords({
        x: Math.min(
          Math.max(clientX - parentRect.left, 8),
          Math.max(8, parentRect.width - 200)
        ),
        y: clientY - parentRect.top,
      });
    }

    setSelectedTask(task);
    setContextActive(true);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextActive) {
        setContextActive(false);
        setSelectedTask(null);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [contextActive]);

  const handleDelete = () => {
  if (selectedTask) {
    removeTask(selectedTask.id); 
    setContextActive(false);
    setSelectedTask(null);
  }
};

  const filters = [
    {
      name: 'all',
      color: 'bg-gray-500',
    },
    {
      name: 'finished',
      color: 'bg-green-500'
    },
    {
      name: 'waited',
      color: 'bg-red-500'
    },
    {
      name: 'active',
      color: 'bg-yellow-500'
    }
  ]
  

  const filteredTasks = tasks.filter((t) => {
    if (currentFilter === 'finished') return t.completed;
    if (currentFilter === 'active') return t.isActive;
    if(currentFilter === 'waited') return !t.completed;
    return true;
  });

  useEffect(() => {
    setSavedTasks(tasks);
  }, [tasks, setSavedTasks]);

  const checkStatus = (task : Task) => {
    const { completed, id, isActive } = task;

    if(completed) {
      return(
        <div className='w-3 h-3 bg-green-500 rounded-full cursor-pointer' onClick={() => changeStatus(id)}></div>
      )
    } else if(isActive === true) {
      return (
      <div className='w-3 h-3 bg-yellow-500 rounded-full relative z-20 cursor-pointer' onClick={() => changeStatus(id)}>
        <div className="absolute inset-0 animate-ping bg-yellow-400 rounded-full z-10 opacity-75"></div>
      </div>);
    }
    else return (
      <div className='w-3 h-3 bg-red-500 rounded-full relative z-20 cursor-pointer' onClick={() => changeStatus(id)}>
        <div className="absolute inset-0 animate-ping bg-red-400 rounded-full z-10 opacity-75"></div>
      </div>
    );   
  }

  useEffect(() => {
    if (hasLoadedTasks.current) return;
    hasLoadedTasks.current = true;
    setTasks(savedTasks);
  }, [savedTasks, setTasks])

  useEffect(() => {
    if (!tasks.some((task) => task.isActive)) return;

    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, [tasks]);
  return (
    <main className="mx-auto my-4 w-[calc(100%-2rem)] max-w-lg overflow-x-clip rounded-2xl border border-gray-100 bg-white p-4 font-sans shadow-sm relative sm:my-10 sm:p-6">
      {contextActive && (
        <div 
          className='absolute z-30 flex max-w-[calc(100%-1rem)] cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-md transition-colors hover:bg-gray-50'
          style={{ top: `${menuCoords.y}px`, left: `${menuCoords.x}px` }}
          onClick={handleDelete}
        >
          <MdDeleteForever color='red' size={20} />
          <span className='text-sm font-medium'>Delete this task</span>
        </div>
      )}
      <div className='mb-4 flex flex-wrap items-center justify-between gap-2'>
        <h1 className="text-xl font-bold text-gray-800">My tasks</h1>
        <div className='flex gap-1'>
          {filters.map(filter => (
            <button
              type="button"
              aria-label={`Show ${filter.name} tasks`}
              aria-pressed={currentFilter === filter.name}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full"
              onClick={() => setCurrentFilter(filter.name)}
              key={filter.name}
            >
              <span className={`h-3 w-3 rounded-full ${filter.color} ${currentFilter === filter.name ? 'ring-2 ring-blue-200 ring-offset-1' : ''}`} />
            </button>
          ))}
        </div>
      </div>
      
      <AddField />
      
      <div className="flex flex-col gap-2.5">
        {filteredTasks && filteredTasks.length === 0 ? (
          <p className="text-sm text-center text-gray-400 py-4">Task list is empty</p>
        ) : (
          filteredTasks && filteredTasks.map((t) => (
            <div
              key={t.id} 
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-xl border border-gray-200/60 bg-gray-50 px-3 py-3 text-sm text-gray-700 shadow-3xs sm:gap-3 sm:px-4"
              onContextMenu={(event) => handleContext(event, t)}
              onDoubleClick={(event) => (
                isMobile && handleContext(event, t) 
              )}
            >
              <div className='flex min-w-0 items-center gap-2'>
                {checkStatus(t)}
                <span className="min-w-0 break-words font-medium">{t.title}</span>
              </div>
              <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                <span className="text-xs tabular-nums text-gray-500">
                  {formatTaskTime(getTaskElapsedSeconds(t, now))}
                </span>
                {t.isActive ? (
                  <button
                    type="button"
                    aria-label={`Pause timer for ${t.title}`}
                    onClick={() => pauseTask(t.id)}
                    className="rounded-md p-1 text-amber-600 hover:bg-amber-100 cursor-pointer"
                  >
                    <MdPause size={18} />
                  </button>
                ) : (
                  <button
                    type="button"
                    aria-label={`Start timer for ${t.title}`}
                    title={t.completed ? "Completed tasks cannot be started" : "Start"}
                    disabled={t.completed}
                    onClick={() => startTask(t.id)}
                    className="rounded-md p-1 text-green-600 hover:bg-green-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent cursor-pointer"
                  >
                    <MdPlayArrow size={18} />
                  </button>
                )}
                {(t.isActive || getTaskElapsedSeconds(t, now) > 0) && (
                  <button
                    type="button"
                    aria-label={`Stop and save timer for ${t.title}`}
                    title="Stop and save time"
                    onClick={() => stopTask(t.id)}
                    className="rounded-md p-1 text-red-500 hover:bg-red-100 cursor-pointer"
                  >
                    <MdStop size={18} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

export default App
