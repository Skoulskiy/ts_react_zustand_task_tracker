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
        x: clientX - parentRect.left,
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
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 font-sans relative">
      {contextActive && (
        <div 
          className='flex gap-2 items-center px-4 py-2 bg-white border border-gray-200 rounded-lg absolute shadow-md cursor-pointer hover:bg-gray-50 transition-colors z-30'
          style={{ top: `${menuCoords.y}px`, left: `${menuCoords.x}px` }}
          onClick={handleDelete}
        >
          <MdDeleteForever color='red' size={20} />
          <span className='text-sm font-medium'>Delete this task</span>
        </div>
      )}
      <div className='flex items-center justify-between'>
        <h1 className="text-xl font-bold text-gray-800 mb-4">My tasks</h1>
        <div className='flex gap-2'>
          {filters.map(filter => (
            <div 
              className={`w-3 h-3 ${filter.color} rounded-full cursor-pointer ${currentFilter === filter.name ? 'border border-blue-200': ''}`} onClick={() => setCurrentFilter(filter.name)}
              key={filter.name}
            ></div>
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
              className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200/60 rounded-xl text-sm text-gray-700 shadow-3xs"
              onContextMenu={(event) => handleContext(event, t)}
              onDoubleClick={(event) => (
                isMobile && handleContext(event, t) 
              )}
            >
              <div className='flex items-center gap-2'>
                {checkStatus(t)}
                <span className="font-medium">{t.title}</span>
              </div>
              <div className="flex items-center gap-2">
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
    </div>
  );
}

export default App
