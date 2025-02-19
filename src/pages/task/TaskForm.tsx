import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListTodo, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([
    {
      _id: "67b63cfebdcdc7e61205bbe5",
      title: "NA",
      description: "NA",
      status: "completed",
      author: "67b61e88c2eb7028a6b056f1",
    },
    {
      _id: "67b63d07bdcdc7e61205bbe7",
      title: "NA",
      description: "NA",
      status: "completed",
      author: "67b61e88c2eb7028a6b056f1",
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (value) => {
    setNewTask(prev => ({
      ...prev,
      status: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const task = {
      _id: Date.now().toString(),
      ...newTask,
      author: "67b61e88c2eb7028a6b056f1"
    };
    setTasks(prev => [...prev, task]);
    setNewTask({
      title: '',
      description: '',
      status: 'pending'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'in-progress':
        return <ListTodo className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Add New Task Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Task Title"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <Textarea
                placeholder="Task Description"
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <Select
                value={newTask.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Add Task</Button>
          </form>
        </CardContent>
      </Card>

      {/* Task List */}
      <Card>
        <CardHeader>
          <CardTitle>Task List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="flex items-start p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="mr-4 mt-1">
                  {getStatusIcon(task.status)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    Status: <span className="capitalize">{task.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskManager;