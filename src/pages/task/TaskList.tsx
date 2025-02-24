import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import {
  createTask,
  fetchTasks,
  updateTask,
  deleteTask,
  statusTask,
} from "../../store/taskSlice";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import Header from "../../components/Header";
import TaskModal from "../../components/TaskModal";
import EditTaskModal from "../../components/EditTaskModal";
import TaskColumn from "../../components/TaskColumn";
import { AppDispatch, RootState } from "../../store/store";
import { Task } from "../../types/task";
import Loader from "../../components/loader";

const TaskList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const taskList = useSelector((state: RootState) => state.tasks.tasks) as Task[];
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "pending" as const,
  });
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [secondaryLoading, setSecondaryLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchTasks()).then(() => setLoading(false));
  }, [dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (editTask) {
      setEditTask((prev) => (prev ? { ...prev, [name]: value } : null));
    } else {
      setNewTask((prev) => ({ ...prev, [name]: value }));
    }
  };

  const CreateHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSecondaryLoading(true);
    dispatch(createTask(newTask)).then(() => {
      dispatch(fetchTasks());
      setSecondaryLoading(false);
      setIsModalOpen(false);
    });
    setNewTask({ title: "", description: "", status: "pending" });
  };

  const UpdateHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSecondaryLoading(true);
    if (editTask) {
      dispatch(updateTask(editTask))
        .then(() => dispatch(fetchTasks()))
        .finally(() => {
          setEditTask(null);
          setIsEditModalOpen(false);
          setSecondaryLoading(false);
        });
    }
  };

  const DeleteHandler = async (task: Task) => {
    await dispatch(deleteTask(task._id));
    dispatch(fetchTasks());
  };

  const SignoutHandler = () => {
    localStorage.removeItem("tsk-token");
    localStorage.removeItem("tsk-user");
    window.location.reload();
  };

  const onDragEnd = (result: DropResult) => {
    const { destination } = result;
    if (!destination) return;

    const task = taskList.find((t) => t._id === result.draggableId);
    if (!task) return;

    const newStatus = destination.droppableId as "pending" | "in-progress" | "completed";
    if (task.status !== newStatus) {
      dispatch(statusTask({ taskId: task._id, status: newStatus })).then(() =>
        dispatch(fetchTasks())
      );
    }
  };

  const statusColumns: Record<string, Task[]> = {
    pending: taskList.filter((task) => task.status === "pending"),
    "in-progress": taskList.filter((task) => task.status === "in-progress"),
    completed: taskList.filter((task) => task.status === "completed"),
  };

  return (
    <>
      {loading && (
        <div className="z-50 w-full h-full backdrop-blur-[3px] bg-black/10 flex justify-center items-center absolute top-0 left-0">
          <div className="flex justify-center items-center flex-col">
            <div className="text-[#8525f9] text-2xl font-bold">Loading data from database</div>
            
             <div className="relative mt-5">

               <Loader color="#8624f6" className="w-20 " />
             </div>
           
          </div>
        </div>
      )}
      <Header onSignout={SignoutHandler} />
      <div className="p-5 px-5 md:px-10">
        <button
          onClick={() => setIsModalOpen(true)}
          aria-label="close-model"
          className="fixed bottom-6 right-6 bg-gradient-to-r cursor-pointer from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 z-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-6 relative">
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          newTask={newTask}
          onChange={handleInputChange}
          onSubmit={CreateHandler}
          loading={secondaryLoading}
        />
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditTask(null);
          }}
          task={editTask}
          onChange={handleInputChange}
          onSubmit={UpdateHandler}
          loading={secondaryLoading}
        />
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 draggable-container">
            {Object.entries(statusColumns).map(([status, tasks]) => (
              <TaskColumn
                key={status}
                status={status}
                tasks={tasks}
                onEdit={(task) => {
                  setEditTask(task);
                  setIsEditModalOpen(true);
                }}
                onDelete={DeleteHandler}
                loading={secondaryLoading}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </>
  );
};

export default TaskList;