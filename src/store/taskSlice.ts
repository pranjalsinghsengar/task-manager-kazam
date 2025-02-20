import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { Task } from '../types';
import { API_URL } from '../config/config';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: unknown;
}
interface TaskPayload {
  taskId: string;
  status: string;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

const token = localStorage.getItem("tsk-token");

const createConfig = (method: string, endpoint: string) => ({
  method,
  url: `${API_URL}/task/${endpoint}`,
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, thunkAPI) => {
    try {
      const config = createConfig('get', 'list');
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data);
      }
      throw error;
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (task: Omit<Task, '_id'>, thunkAPI) => {
    try {
      const config = {
        ...createConfig('post', 'create'),
        data: task,
      };
      const response = await axios.request(config);
      return response.data.task || response.data; // Handle both response formats
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data);
      }
      throw error;
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (task: Task, thunkAPI) => {
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
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data);
      }
      throw error;
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: string, thunkAPI) => {
    try {
      const config = {
        ...createConfig('post', 'delete'),
        data: { taskId },
      };
      const response = await axios.request(config);
      // Return the taskId directly for easier state update
      return { taskId, success: response.data.success };
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data);
      }
      throw error;
    }
  }
);
export const statusTask = createAsyncThunk(
  'tasks/statusUpdate',
  async ({ taskId, status }: TaskPayload, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/task/update/status`,
        {
          taskId,
          status,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data);
      }
      throw error;
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
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks || action.payload; // Handle both response formats
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });

    // Create task
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        // Only add the task if it's not already in the state
        const existingTask = state.tasks.find(task => task._id === action.payload._id);
        if (!existingTask) {
          state.tasks = [...state.tasks, action.payload];
        }
        state.error = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create task';
      });

    // Update task
    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks = state.tasks.map(task =>
            task._id === action.payload._id ? action.payload : task
          );
        }
        state.error = null;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update task';
      });

    // Delete task
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the task from state using the returned taskId
        state.tasks = state.tasks.filter(task => task._id !== action.payload.taskId);
        state.error = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete task';
      });

    // Update status

    builder
      .addCase(statusTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(statusTask.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Update the task status in the state
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload.taskId
        );
        if (index !== -1) {
          state.tasks[index].status = action.payload.status;
        }
      })
      .addCase(statusTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default taskSlice.reducer;