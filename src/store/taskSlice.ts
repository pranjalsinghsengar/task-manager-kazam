import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { Task } from '../types/task'; // Updated import path to match previous example
import { API_URL } from '../config/config';

// Define more specific error type
interface TaskError {
  message: string;
  status?: number;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: TaskError | null;
}

interface TaskPayload {
  taskId: string;
  status: "pending" | "in-progress" | "completed";
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

const token = localStorage.getItem("tsk-token");

const createConfig = (method: 'get' | 'post', endpoint: string) => ({
  method,
  url: `${API_URL}/task/${endpoint}`,
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
});

// Thunk actions with proper typing
export const fetchTasks = createAsyncThunk<Task[], void, { rejectValue: TaskError }>(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const config = createConfig('get', 'list');
      const response = await axios.request(config);
      return response.data.tasks || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<TaskError>;
      return rejectWithValue({
        message: axiosError.response?.data?.message || 'Failed to fetch tasks',
        status: axiosError.response?.status
      });
    }
  }
);

export const createTask = createAsyncThunk<Task, Omit<Task, '_id'>, { rejectValue: TaskError }>(
  'tasks/createTask',
  async (task, { rejectWithValue }) => {
    try {
      const config = {
        ...createConfig('post', 'create'),
        data: task,
      };
      const response = await axios.request(config);
      return response.data.task || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<TaskError>;
      return rejectWithValue({
        message: axiosError.response?.data?.message || 'Failed to create task',
        status: axiosError.response?.status
      });
    }
  }
);

export const updateTask = createAsyncThunk<Task, Task, { rejectValue: TaskError }>(
  'tasks/updateTask',
  async (task, { rejectWithValue }) => {
    try {
      const config = {
        ...createConfig('post', 'update'),
        data: {
          taskId: task._id,
          title: task.title,
          description: task.description,
          status: task.status,
        },
      };
      const response = await axios.request(config);
      return response.data.task || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<TaskError>;
      return rejectWithValue({
        message: axiosError.response?.data?.message || 'Failed to update task',
        status: axiosError.response?.status
      });
    }
  }
);

export const deleteTask = createAsyncThunk<{ taskId: string }, string, { rejectValue: TaskError }>(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      const config = {
        ...createConfig('post', 'delete'),
        data: { taskId },
      };
      const response = await axios.request(config);
      return response.data.task || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<TaskError>;
      return rejectWithValue({
        message: axiosError.response?.data?.message || 'Failed to delete task',
        status: axiosError.response?.status
      });
    }
  }
);

export const statusTask = createAsyncThunk<Task, TaskPayload, { rejectValue: TaskError }>(
  'tasks/statusUpdate',
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/task/update/status`,
        { taskId, status },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.task || response.data;
    } catch (error) {
      const axiosError = error as AxiosError<TaskError>;
      return rejectWithValue({
        message: axiosError.response?.data?.message || 'Failed to update status',
        status: axiosError.response?.status
      });
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'An error occurred' };
      });

    // Create task
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        const existingTask = state.tasks.find(task => task._id === action.payload._id);
        if (!existingTask) {
          state.tasks.push(action.payload);
        }
        state.error = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Failed to create task' };
      });

    // Update task
    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.tasks = state.tasks.map(task =>
          task._id === action.payload._id ? action.payload : task
        );
        state.error = null;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Failed to update task' };
      });

    // Delete task
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<{ taskId: string }>) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task._id !== action.payload.taskId);
        state.error = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Failed to delete task' };
      });

    // Update status
    builder
      .addCase(statusTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(statusTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.tasks = state.tasks.map(task =>
          task._id === action.payload._id ? action.payload : task
        );
        state.error = null;
      })
      .addCase(statusTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Failed to update status' };
      });
  },
});

export default taskSlice.reducer;