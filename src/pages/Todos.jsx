import { useEffect, useState, useRef } from "react";
import { getTodos, createTodo, updateTodo, deleteTodo } from "../api/todoApi";
import { useAuth } from "../pages/AuthContext";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, Check, X, LogOut, Loader2 } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../auth.js/firebase";

const Todos = () => {
  const { token } = useAuth();
  const [todos, setTodos] = useState([]);
  const [todoTitle, setTodoTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  // GET ALL TODOS
  useEffect(() => {
    if (!token) return;

    async function loadTodos() {
      try {
        setLoading(true);
        const data = await getTodos(token);
        setTodos(data || []);
      } catch (err) {
        setError("Failed to load todos");
      } finally {
        setLoading(false);
      }
    }

    loadTodos();
  }, [token]);

  // HANDLE CREATE
  const handleCreateTodo = async (e) => {
    e.preventDefault();
    if (!todoTitle.trim()) return;

    try {
      setActionLoading(true);
      const data = await createTodo(token, todoTitle);
      setTodos([...todos, data]);
      setTodoTitle("");
    } catch (err) {
      setError("Failed to create todo");
    } finally {
      setActionLoading(false);
    }
  };

  // HANDLE UPDATE START
  const startEditing = (todo) => {
    setEditingId(todo.id);
    setTodoTitle(todo.title);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // HANDLE UPDATE SUBMIT
  const handleUpdateTodo = async () => {
    if (!todoTitle.trim()) return;

    try {
      setActionLoading(true);
      const data = await updateTodo(token, editingId, todoTitle);
      setTodos(todos.map((todo) => (todo.id === editingId ? data : todo)));
      setEditingId(null);
      setTodoTitle("");
    } catch (err) {
      setError("Failed to update todo");
    } finally {
      setActionLoading(false);
    }
  };

  // HANDLE CANCEL EDIT
  const cancelEditing = () => {
    setEditingId(null);
    setTodoTitle("");
  };

  // HANDLE DELETE
  const handleDeleteTodo = async (id) => {
    try {
      const result = await deleteTodo(token, id);
      setTodos((prev) => prev.filter((todo) => todo.id !== result.id));
    } catch (err) {
      setError("Failed to delete todo");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground">Manage your daily goals.</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        {/* Add Todo Input */}
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6">
            <form
              onSubmit={
                editingId
                  ? (e) => {
                      e.preventDefault();
                      handleUpdateTodo();
                    }
                  : handleCreateTodo
              }
              className="flex gap-4"
            >
              <Input
                ref={inputRef}
                placeholder={
                  editingId ? "Update your task..." : "Add a new task..."
                }
                value={todoTitle}
                onChange={(e) => setTodoTitle(e.target.value)}
                className="flex-1 bg-background"
                disabled={actionLoading}
              />
              {editingId ? (
                <div className="flex gap-2">
                  <Button type="submit" disabled={actionLoading}>
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEditing}
                    disabled={actionLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="submit"
                  disabled={actionLoading || !todoTitle.trim()}
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {!actionLoading && "Add"}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-md bg-destructive/10 text-destructive text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Todo List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {!todos || todos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="bg-muted/50 p-4 rounded-full mb-4">
                  <Check className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">All caught up!</h3>
                <p className="text-muted-foreground mt-1">
                  You have no tasks on your list.
                </p>
              </motion.div>
            ) : (
              todos.map((todo) => (
                <motion.div
                  key={todo.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="group hover:shadow-md transition-all duration-200 border-border/60">
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div
                          className={`flex-shrink-0 h-2 w-2 rounded-full ${todo.completed ? "bg-green-500" : "bg-orange-500"}`}
                          title={todo.completed ? "Completed" : "Pending"}
                        />
                        <span
                          className={`truncate ${todo.completed ? "text-muted-foreground line-through" : ""}`}
                        >
                          {todo.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => startEditing(todo)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteTodo(todo.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Todos;
