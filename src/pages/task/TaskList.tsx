import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { useEffect, useState } from "react";
import { createTask, fetchTasks } from "../../store/taskSlice";
import { Task } from "../../types/task";

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const TaskList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const taskList = useSelector((state: RootState) => state.tasks.tasks);
  console.log("taskListtaskList,", taskList);

  useEffect(() => {
    dispatch(fetchTasks())
      .unwrap()
      .then((data: Task[]) => {
        console.log("Fetched tasks:", data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, [dispatch]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const CreateHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(createTask(newTask));
    dispatch(fetchTasks())
  };

  return (
    <div className='max-w-4xl mx-auto p-6'>
      {/* Add New Task Form */}
      <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
        <h2 className='text-xl font-bold mb-4'>Create New Task</h2>
        <form className='space-y-4' onSubmit={CreateHandler}>
          <div>
            <label className='block text-sm font-medium mb-1'>Title</label>
            <input
              type='text'
              name='title'
              value={newTask.title}
              onChange={handleInputChange}
              className='w-full p-2 border rounded'
              placeholder='Enter task title'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>
              Description
            </label>
            <textarea
              name='description'
              value={newTask.description}
              onChange={handleInputChange}
              className='w-full p-2 border rounded'
              placeholder='Enter task description'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Status</label>
            <select
              name='status'
              value={newTask.status}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, status: e.target.value }))
              }
              className='w-full p-2 border rounded'
              aria-label='Task status'
            >
              <option value='pending'>Pending</option>
              <option value='in-progress'>In Progress</option>
              <option value='completed'>Completed</option>
            </select>
          </div>
          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'
          >
            Create Task
          </button>
        </form>
      </div>

      {/* Task List */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-xl font-bold mb-4'>Your Tasks</h2>
        <div className='space-y-4'>
          {taskList.tasks?.map((task) => (
            <div
              key={task._id}
              className='border rounded-lg p-4 hover:shadow-md transition-shadow'
            >
              <h3 className='font-semibold'>{task.title}</h3>
              <p className='text-gray-600 mt-1'>{task.description}</p>
              <div className='mt-2'>
                <span
                  className={`px-2 py-1 rounded-full text-sm
                                    ${
                                      task.status === "completed"
                                        ? "bg-green-100 text-green-700"
                                        : task.status === "pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-blue-100 text-blue-700"
                                    }`}
                >
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
