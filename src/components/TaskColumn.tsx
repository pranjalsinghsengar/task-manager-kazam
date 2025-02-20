import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Task } from "../types/task";
import TaskCard from "./TaskCard";

interface TaskColumnProps {
  status: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  loading: boolean;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ status, tasks, onEdit, onDelete,loading }) => (
  <Droppable droppableId={status}>
    {(provided) => (
      <div
        className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-6 transition-all duration-200"
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        <h3 className="text-xl font-bold mb-4 capitalize text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
          {status.replace("-", " ")}
        </h3>
        <div className="space-y-4 min-h-[100px]">
          {tasks.map((task, index) => (
            <Draggable key={task._id} draggableId={task._id} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <TaskCard  task={task} onEdit={onEdit} onDelete={onDelete} loading={loading} />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      </div>
    )}
  </Droppable>
);

export default TaskColumn;