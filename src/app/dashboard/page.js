"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "09:00",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userData));
    fetchTasks(token);
  }, [router]);

  const fetchTasks = async (token) => {
    try {
      const response = await fetch("/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const url = editingTask
        ? `/api/tasks/${editingTask._id}`
        : "/api/tasks";
      const method = editingTask ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save task");
      }

      // Refresh tasks
      await fetchTasks(token);
      
      // Reset form and close modal
      setFormData({ title: "", description: "", dueDate: "", dueTime: "09:00" });
      setEditingTask(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Failed to save task");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      dueDate: new Date(task.dueDate).toISOString().split("T")[0],
      dueTime: task.dueTime || "09:00",
    });
    setShowModal(true);
  };

  const handleDelete = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      // Refresh tasks
      await fetchTasks(token);
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task");
    }
  };

  const toggleStatus = async (task) => {
    const token = localStorage.getItem("token");
    const newStatus = task.status === "completed" ? "pending" : "completed";

    try {
      const response = await fetch(`/api/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task status");
      }

      // Refresh tasks
      await fetchTasks(token);
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = (dueDate, dueTime, status) => {
    if (status !== "pending") return false;
    
    const now = new Date();
    const taskDate = new Date(dueDate);
    
    // Parse the time (format: HH:MM)
    const [hours, minutes] = (dueTime || "09:00").split(':').map(Number);
    taskDate.setHours(hours, minutes, 0, 0);
    
    return taskDate < now;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Work Planner</h1>
              {user && <p className="text-gray-400 text-sm mt-1">Welcome, {user.name}</p>}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white border border-gray-700 rounded-md hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Task Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setEditingTask(null);
              setFormData({ title: "", description: "", dueDate: "", dueTime: "09:00" });
              setShowModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            + Add New Task
          </button>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-12 bg-gray-900 rounded-lg">
              <p className="text-gray-400 text-lg">No tasks yet. Create your first task!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className={`bg-gray-900 rounded-lg p-6 border ${
                  isOverdue(task.dueDate, task.dueTime, task.status)
                    ? "border-red-500"
                    : "border-gray-800"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <input
                      type="checkbox"
                      checked={task.status === "completed"}
                      onChange={() => toggleStatus(task)}
                      className="mt-1 h-5 w-5 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
                    />
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-semibold ${
                          task.status === "completed"
                            ? "line-through text-gray-500"
                            : "text-white"
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-gray-400 mt-1">{task.description}</p>
                      )}
                      <div className="mt-3 flex items-center space-x-4">
                        <span
                          className={`text-sm ${
                            isOverdue(task.dueDate, task.dueTime, task.status)
                              ? "text-red-400 font-semibold"
                              : "text-gray-500"
                          }`}
                        >
                          Due: {formatDate(task.dueDate)} at {task.dueTime || "09:00"}
                          {isOverdue(task.dueDate, task.dueTime, task.status) && " (Overdue)"}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            task.status === "completed"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-yellow-500/10 text-yellow-500"
                          }`}
                        >
                          {task.status === "completed" ? "Completed" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(task)}
                      className="px-3 py-1 text-sm text-blue-400 hover:text-blue-300 border border-blue-400/30 rounded hover:bg-blue-400/10"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="px-3 py-1 text-sm text-red-400 hover:text-red-300 border border-red-400/30 rounded hover:bg-red-400/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              {editingTask ? "Edit Task" : "Add New Task"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task description"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Due Time *
                </label>
                <input
                  type="time"
                  required
                  value={formData.dueTime}
                  onChange={(e) =>
                    setFormData({ ...formData, dueTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  {editingTask ? "Update Task" : "Add Task"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTask(null);
                    setFormData({ title: "", description: "", dueDate: "", dueTime: "09:00" });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
