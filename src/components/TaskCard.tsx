import React from "react";
import { Task } from "../types/task";
import { MdDelete } from "react-icons/md";
import { RiEditFill } from "react-icons/ri";
import { SpinLoader } from "./loader";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  loading: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  loading,
}) => (
  <div className='bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 transform hover:-translate-y-1'>
    <div className='drag-handle flex justify-center -mt-2.5'>
      <div className='h-1.5 bg-gray-300/40 rounded-full w-20 max-w-2xs'></div>
    </div>
    <h4 className='font-semibold text-gray-800'>{task.title}</h4>
    <p className='text-sm text-gray-600 mt-1 line-clamp-2'>
      {task.description}
    </p>
    <div className='mt-3 flex justify-end gap-3'>
      <button
        onClick={() => onEdit(task)}
        aria-label='edit'
        className='text-indigo-600 hover:text-indigo-800 text-xl font-medium transition-colors duration-200'
      >
        <RiEditFill />
      </button>
      <button
        onClick={() => onDelete(task)}
        aria-label='delete'
        className='text-red-500 text-xl relative cursor-pointer hover:text-red-800 font-medium transition-colors duration-200'
      >
        <MdDelete className={`${loading ? "opacity-0" : "opacity-100"}`} />
        <SpinLoader color='' className={`${loading ? "opacity-100" : "opacity-0"} w-7`} />
      </button>
    </div>
  </div>
);

export default TaskCard;
