import { create } from "zustand";
import type { Task } from "../types/Task";
import { formatTaskTime, getTaskElapsedSeconds, parseTaskTime } from "../utils/time";

type State = {
  tasks: Task[];
}

type Actions = {
  addTask: (task: Task) => void;
  removeTask: (taskId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  startTask: (taskId: string) => void;
  pauseTask: (taskId: string) => void;
  stopTask: (taskId: string) => void;
  setTasks: (tasks: Task[]) => void;
}

export const useTask = create<State & Actions>((set) => ({
  tasks: [],
  
  addTask: (task: Task) => 
    set((state) => ({
      tasks: [...state.tasks, task]
    })
  ),
  removeTask: (taskId: string) => set((state) => ({
      tasks: [...state.tasks.filter((task : Task) => task.id !== taskId)]
    })
  ),
  toggleTaskCompletion: (taskId: string) => 
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id !== taskId) return task;

        const completed = !task.completed;
        if (!completed || !task.isActive) return { ...task, completed };

        const elapsedSeconds = getTaskElapsedSeconds(task);
        return {
          ...task,
          completed,
          isActive: false,
          elapsedSeconds,
          startedAt: undefined,
          time: formatTaskTime(elapsedSeconds)
        };
      }
      )
  })),
  startTask: (taskId: string) =>
    set((state) => {
      const taskToStart = state.tasks.find((task) => task.id === taskId);
      if (!taskToStart || taskToStart.completed) return state;

      const now = Date.now();
      return {
        tasks: state.tasks.map((task) => {
          if (task.id === taskId) {
            if (task.isActive) return task;
            return { ...task, isActive: true, startedAt: now };
          }

          if (!task.isActive) return task;

          const elapsedSeconds = getTaskElapsedSeconds(task, now);
          return {
            ...task,
            isActive: false,
            elapsedSeconds,
            startedAt: undefined,
            time: formatTaskTime(elapsedSeconds)
          };
        })
      };
    }),
  pauseTask: (taskId: string) =>
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id !== taskId || !task.isActive) return task;

        const elapsedSeconds = getTaskElapsedSeconds(task);
        return {
          ...task,
          isActive: false,
          elapsedSeconds,
          startedAt: undefined,
          time: formatTaskTime(elapsedSeconds)
        };
      })
    })),
  stopTask: (taskId: string) =>
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id !== taskId) return task;

        const elapsedSeconds = getTaskElapsedSeconds(task);
        return {
          ...task,
          isActive: false,
          elapsedSeconds,
          startedAt: undefined,
          time: formatTaskTime(elapsedSeconds)
        };
      })
    })),
  setTasks: (tasks: Task[]) =>
    set(() => ({
      tasks: tasks.map((task) => ({
        ...task,
        elapsedSeconds: task.elapsedSeconds ?? parseTaskTime(task.time),
        startedAt: task.isActive ? task.startedAt ?? Date.now() : undefined
      }))
    }))
}));