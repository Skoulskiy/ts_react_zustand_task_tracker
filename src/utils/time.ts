import type { Task } from "../types/Task";

export const parseTaskTime = (time: string): number => {
  const parts = time.split(":").map(Number);
  if (parts.some((part) => !Number.isFinite(part) || part < 0)) return 0;

  return parts.reduce((total, part) => total * 60 + part, 0);
};

export const formatTaskTime = (seconds: number): string => {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  return [hours, minutes, remainingSeconds]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
};

export const getTaskElapsedSeconds = (task: Task, now = Date.now()): number => {
  const elapsedSeconds = task.elapsedSeconds ?? parseTaskTime(task.time);

  if (!task.isActive || task.startedAt === undefined) return elapsedSeconds;

  return elapsedSeconds + Math.max(0, Math.floor((now - task.startedAt) / 1000));
};
