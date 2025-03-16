import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useForm } from "react-hook-form";
import { getBaseUrl } from "../../utils/config.js";
import { userAuthorContextObj } from "../../contexts/UserAuthorContext.jsx";

function TodoList() {
  const { currentUser } = useContext(userAuthorContextObj);
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { register, handleSubmit, reset } = useForm();

  async function fetchTodos() {
    if (!currentUser?.firstName || !currentUser?.email) {
      console.error("❌ Missing author details:", currentUser);
      return;
    }

    try {
      const token = await getToken();
      const res = await axios.get(`${getBaseUrl()}/todo-api/todos`, {
        params: {
          authorName: currentUser.firstName,
          authorEmail: currentUser.email,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.message === "todos") {
        setTodos(res.data.payload);
        setError("");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      console.error(
        "❌ Failed to fetch todos:",
        err.response?.data || err.message
      );
      setError("Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  }

  async function addTodo(data) {
    if (!currentUser) return;

    const token = await getToken();
    const payload = {
      ...data,
      isActive: true,
      authorName: currentUser.firstName,
      authorEmail: currentUser.email,
    };

    try {
      let res = await axios.post(`${getBaseUrl()}/todo-api/todo`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.message === "Todo created") {
        fetchTodos();
        reset();
      }
    } catch (err) {
      console.error(
        "❌ Failed to create todo:",
        err.response?.data || err.message
      );
    }
  }

  async function updateTodo(todo) {
    if (!currentUser) return;

    const token = await getToken();
    await axios.put(`${getBaseUrl()}/todo-api/todo/${todo._id}`, todo, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTodos();
  }

  async function deleteOrRestoreTodo(id, isActive) {
    if (!currentUser) return;

    const token = await getToken();
    await axios.put(
      `${getBaseUrl()}/todo-api/todo/${id}`,
      { isActive },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchTodos();
  }

  useEffect(() => {
    if (currentUser) fetchTodos();
  }, [currentUser]);

  return (
    <div className="container mt-4">
      <h2>Welcome, {currentUser?.firstName || "Guest"}!</h2>
      {error && <p className="text-center text-danger">{error}</p>}

      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          placeholder="Search To-Do..."
          className="form-control me-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <form onSubmit={handleSubmit(addTodo)} className="mb-5">
        <input
          {...register("title", { required: true })}
          className="form-control mb-2"
          placeholder="Title"
        />
        <textarea
          {...register("description", { required: true })}
          className="form-control mb-2"
          placeholder="Description"
        />
        <input
          type="date"
          {...register("dueDate", { required: true })}
          className="form-control mb-2"
        />
        <select
          {...register("status", { required: true })}
          className="form-select mb-2"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
        </select>
        <button type="submit" className="btn btn-primary mt-2">
          Add To-Do
        </button>
      </form>

      <div className="d-flex flex-row flex-wrap gap-3 overflow-auto">
        {loading ? (
          <div className="card shadow-sm p-3 w-100">
            <div className="card-body d-flex flex-wrap justify-content-between gap-3 align-items-center">
              <h5 className="card-title placeholder-glow">
                <span className="placeholder col-6"></span>
              </h5>
              <p className="card-text placeholder-glow">
                <span className="placeholder col-8"></span>
              </p>
              <p className="placeholder-glow">
                <span className="placeholder col-4"></span>
              </p>
              <p className="placeholder-glow">
                <span className="placeholder col-3"></span>
              </p>

              <button className="btn btn-secondary disabled placeholder col-4"></button>
              <button className="btn btn-danger disabled placeholder col-3"></button>
            </div>
          </div>
        ) : (
          todos
            .filter(
              (todo) =>
                (filterStatus === "All" || todo.status === filterStatus) &&
                todo.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((todo) => (
              <div
                key={todo._id}
                className={`card shadow-sm p-3 w-100 ${
                  new Date(todo.dueDate) < new Date()
                    ? "bg-danger-subtle "
                    : "bg-success-subtle "
                }`}
              >
                <div className="card-body d-flex flex-wrap justify-content-between gap-3 align-items-center">
                  <h5 className="card-title">{todo.title}</h5>
                  <p className="card-text text-muted my-auto">
                    {todo.description}
                  </p>
                  <p className="my-auto">
                    <strong>Due:</strong>{" "}
                    {new Date(todo.dueDate).toDateString()}
                  </p>
                  <p className="my-auto">
                    <strong>Status:</strong> {todo.status}
                  </p>

                  <button
                    className={`btn ${
                      todo.status === "Completed"
                        ? "btn-warning"
                        : "btn-success"
                    }`}
                    onClick={() =>
                      updateTodo({
                        ...todo,
                        status:
                          todo.status === "Completed" ? "Pending" : "Completed",
                      })
                    }
                  >
                    {todo.status === "Completed"
                      ? "Mark as Pending"
                      : "Mark as Completed"}
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      deleteOrRestoreTodo(todo._id, !todo.isActive)
                    }
                  >
                    {todo.isActive ? "Delete" : "Restore"}
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default TodoList;
