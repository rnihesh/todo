const exp = require("express");
const todoApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");
const createUserOrAuthor = require("./createUserOrAuthor.js");
const Todo = require("../models/todoModel.js");
const { requireAuth, clerkMiddleware } = require("@clerk/express");

todoApp.use(clerkMiddleware());

todoApp.post("/todo", requireAuth(), expressAsyncHandler(async (req, res) => {
  const { title, description, status, dueDate, isActive, authorName, authorEmail } = req.body;

  if (!authorName || !authorEmail) {
    return res.status(400).send({ message: "Missing author information" });
  }

  const newTodo = new Todo({
    title,
    description,
    status,
    dueDate,
    isActive: isActive ?? true,
    authorData: { name: authorName, email: authorEmail },
  });

  const todoObj = await newTodo.save();
  res.status(201).send({ message: "Todo created", payload: todoObj });
}));

todoApp.get("/todos", requireAuth(), expressAsyncHandler(async (req, res) => {
  const { authorName, authorEmail } = req.query;
  if (!authorName || !authorEmail) return res.status(400).send({ message: "Missing author information" });

  const todos = await Todo.find({ "authorData.email": authorEmail, isActive: true }).lean();
  res.status(200).send({ message: "todos", payload: todos });
}));

todoApp.put("/todo/:todoId", requireAuth(), expressAsyncHandler(async (req, res) => {
  const updatedTodo = await Todo.findByIdAndUpdate(req.params.todoId, req.body, { new: true });
  res.status(200).send({ message: "todo modified", payload: updatedTodo });
}));

module.exports = todoApp;
