import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt?: string;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '' });

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/tasks`);
      setTasks(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add task
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/tasks`, formData);
      setTasks([...tasks, response.data.data]);
      setFormData({ title: '', description: '' });
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to add task');
    }
  };

  // Update task
  const updateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    
    try {
      const response = await axios.put(`${API_URL}/api/tasks/${editingTask.id}`, formData);
      setTasks(tasks.map(task => task.id === editingTask.id ? response.data.data : task));
      setEditingTask(null);
      setFormData({ title: '', description: '' });
    } catch (err) {
      setError('Failed to update task');
    }
  };

  // Delete task
  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  // Update task status
  const updateTaskStatus = async (id: number, status: Task['status']) => {
    try {
      const response = await axios.put(`${API_URL}/api/tasks/${id}`, { status });
      setTasks(tasks.map(task => task.id === id ? response.data.data : task));
    } catch (err) {
      setError('Failed to update task status');
    }
  };

  // Get status icon and color
  const getStatusDisplay = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return { icon: <CheckCircle className="w-5 h-5 text-green-500" />, color: 'bg-green-100 text-green-800' };
      case 'in-progress':
        return { icon: <Clock className="w-5 h-5 text-yellow-500" />, color: 'bg-yellow-100 text-yellow-800' };
      default:
        return { icon: <AlertCircle className="w-5 h-5 text-gray-500" />, color: 'bg-gray-100 text-gray-800' };
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const startEditing = (task: Task) => {
    setEditingTask(task);
    setFormData({ title: task.title, description: task.description });
    setShowAddForm(false);
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setFormData({ title: '', description: '' });
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">DevOps Task Manager</h1>
          <p className="text-gray-600">Manage your DevOps pipeline tasks efficiently</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <h3 className="text-2xl font-bold text-blue-600">{stats.total}</h3>
            <p className="text-gray-600">Total Tasks</p>
          </div>
          <div className="card text-center">
            <h3 className="text-2xl font-bold text-green-600">{stats.completed}</h3>
            <p className="text-gray-600">Completed</p>
          </div>
          <div className="card text-center">
            <h3 className="text-2xl font-bold text-yellow-600">{stats.inProgress}</h3>
            <p className="text-gray-600">In Progress</p>
          </div>
          <div className="card text-center">
            <h3 className="text-2xl font-bold text-gray-600">{stats.pending}</h3>
            <p className="text-gray-600">Pending</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Add Task Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingTask(null);
              setFormData({ title: '', description: '' });
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Task
          </button>
        </div>

        {/* Add/Edit Task Form */}
        {(showAddForm || editingTask) && (
          <div className="card mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h3>
            <form onSubmit={editingTask ? updateTask : addTask}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
                <button 
                  type="button" 
                  onClick={editingTask ? cancelEditing : () => setShowAddForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading tasks...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => {
              const statusDisplay = getStatusDisplay(task.status);
              return (
                <div key={task.id} className="card hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 flex-1">{task.title}</h3>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => startEditing(task)}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className="text-gray-600 mb-4 text-sm">{task.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {statusDisplay.icon}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </div>
                    
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value as Task['status'])}
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tasks.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <AlertCircle className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-500 mb-2">No tasks yet</h3>
            <p className="text-gray-400">Create your first task to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;