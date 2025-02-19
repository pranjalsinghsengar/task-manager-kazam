import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { Task } from '../types';
import { API_URL } from '../config/config';

const initialState: { tasks: Task[], loading: boolean, error: unknown } = {
  tasks: [],
  loading: false,
  error: null,
};

const token = localStorage.getItem("tsk-token")

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', 
  async (_, thunkAPI) => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${API_URL}/task/list`,
      headers: { 
        'Authorization': `barrier ${token}`
      }
    };

    try {
      const response = await axios.request(config);
      console.log("response.data",response.data)
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data);
      }
      throw error;
    }
});

export const createTask = createAsyncThunk('tasks/createTask', 
  async (task: Task, thunkAPI) => {
    try {
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${API_URL}/task/create`,
        headers: { 
          'Authorization': `barrier ${token}`
        },
        data:task,
      };
  
      try {
        const response = await axios.request(config);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          return thunkAPI.rejectWithValue(error.response?.data);
        }
        throw error;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data);
      }
      throw error;
    }
});

export const updateTask = createAsyncThunk('tasks/updateTask', 
  async (task: Task, thunkAPI) => {
    try {
      const response = await axios.put(`/api/tasks/${task._id}`, task);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data);
      }
      throw error;
    }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = action.payload;
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'An error occurred';
    });
    builder.addCase(createTask.fulfilled, (state, action) => {
      state.tasks.push(action.payload);
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        const index = state.tasks.findIndex((task) => task._id === updatedTask._id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
      });
  },
});

export default taskSlice.reducer;
