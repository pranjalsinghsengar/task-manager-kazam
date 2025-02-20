import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import React, { useEffect, useState } from "react";
import { createTask, fetchTasks, updateTask, deleteTask, statusTask } from "../../store/taskSlice";
import { Task } from "../../types/task";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const TaskList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const taskList = useSelector((state: RootState) => state.tasks.tasks);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "pending",
  });
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
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
    dispatch(createTask(newTask)).then(() => {
      dispatch(fetchTasks());
      setIsModalOpen(false);
    });
    setNewTask({ title: "", description: "", status: "pending" });
  };

  const UpdateHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editTask) {
      dispatch(updateTask(editTask))
        .then(() => dispatch(fetchTasks()))
        .finally(() => {
          setEditTask(null);
          setIsEditModalOpen(false);
        });
    }
  };

  const DeleteHandler = async (task: Task) => {
    await dispatch(deleteTask(task));
    dispatch(fetchTasks());
  };

  const SignoutHandler = () => {
    
   localStorage.removeItem("tsk-token")
   localStorage.removeItem("tsk-user")
   window.location.reload()
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const task = taskList.find((t: Task) => t._id === result.draggableId);
    if (!task) return;

    const newStatus = destination.droppableId as "pending" | "in-progress" | "completed";
    if (task.status !== newStatus) {
      dispatch(statusTask({ taskId: task._id, status: newStatus }))
        .then(() => dispatch(fetchTasks()));
    }
  };

  const statusColumns = {
    pending: taskList.filter((task: Task) => task.status === "pending"),
    "in-progress": taskList.filter((task: Task) => task.status === "in-progress"),
    completed: taskList.filter((task: Task) => task.status === "completed"),
  };

  return (
    <div className="max-w-7xl mx-auto p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Task Manager
        </h1>
        <button
          onClick={SignoutHandler}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 z-50"
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

      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-xs bg-black/5 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Create New Task</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={CreateHandler} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={newTask.status}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter task description"
                  rows={4}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md"
              >
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && editTask && (
        <div className="fixed inset-0 backdrop-blur-xs bg-black/5 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Update Task</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={UpdateHandler} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editTask.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={editTask.status}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={editTask.description}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  rows={4}
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md"
                >
                  Update Task
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditTask(null);
                  }}
                  className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(statusColumns).map(([status, tasks]) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-6 transition-all duration-200"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3 className="text-xl font-bold mb-4 capitalize text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {status.replace("-", " ")}
                  </h3>
                  <div className="space-y-4 min-h-[100px]">
                    {tasks.map((task: Task, index: number) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 transform hover:-translate-y-1"
                          >
                            <h4 className="font-semibold text-gray-800">{task.title}</h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                            <div className="mt-3 flex justify-end gap-3">
                              <button
                                onClick={() => {
                                  setEditTask(task);
                                  setIsEditModalOpen(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors duration-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => DeleteHandler(task)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskList;