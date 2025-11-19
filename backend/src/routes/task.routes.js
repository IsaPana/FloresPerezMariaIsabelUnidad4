import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { Task } from "../models/Task.js";

const router = express.Router();

// Crear nueva tarea
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    const newTask = new Task({
      title,
      description,
      dueDate,
      user: req.user.id,
      status: "pendiente", // Estado inicial
    });

    await newTask.save();
    res.status(201).json({ message: "Tarea creada exitosamente", task: newTask });
  } catch (error) {
    console.error("Error al crear la tarea:", error);
    res.status(500).json({ message: "Error al crear la tarea", error: error.message });
  }
});

//  Obtener todas las tareas del usuario autenticado
router.get("/", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error("Error al obtener las tareas:", error);
    res.status(500).json({ message: "Error al obtener las tareas", error: error.message });
  }
});

//  Actualizar tarea (título, descripción, fecha o estado)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, description, dueDate, status },
      { new: true } // Devuelve la tarea actualizada
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.json({ message: "Tarea actualizada correctamente", task: updatedTask });
  } catch (error) {
    console.error("Error al actualizar la tarea:", error);
    res.status(500).json({ message: "Error al actualizar la tarea", error: error.message });
  }
});

// Eliminar tarea
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deletedTask) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la tarea:", error);
    res.status(500).json({ message: "Error al eliminar la tarea", error: error.message });
  }
});

export default router;
