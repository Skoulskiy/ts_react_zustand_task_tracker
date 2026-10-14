export interface Task {
  id: string,
  title: string,
  time: string,
  completed: boolean,
  isActive: boolean,
  elapsedSeconds?: number,
  startedAt?: number
}