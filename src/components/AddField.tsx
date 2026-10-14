import { useEffect, useRef, useState } from "react";
import { useTask } from "../store/useTask";

export const AddField : React.FC = () => {
  const addTask = useTask((state) => state.addTask);
  const [value, setValue] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    addTask({
      id: `${value}-id`,
      title: value,
      time: '00:00:00',
      completed: false,
      isActive: false,
      elapsedSeconds: 0
    });

    setValue('');
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form 
      onSubmit={(e) => handleSubmit(e)}
      className="flex gap-2 mb-6"  
    >
      <input 
        value={value}
        ref={inputRef}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 px-4 py-2.5 text-sm bg-white border border-gray-300 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
        placeholder="Enter task title"
      />
    </form>
  );
};