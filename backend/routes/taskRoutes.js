import express from 'express';
import { Task } from '../models/Model.js';

const router = express.Router();

// Route to create a new task
router.post("/", async (request, response) => {
    try {
        if (!request.body.title || !request.body.description) {
            return response.status(400).send({
                message: "Send all required fields: title, description",
            });
        }
        
        const newTask = {
            title: request.body.title,
            description: request.body.description,
        };
        
        const task = await Task.create(newTask);
        return response.status(201).send(task);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to get all incomplete tasks (limited to 5 most recent)
router.get('/', async (request, response) => {
    try {
        const tasks = await Task.find({ completed: false })
            .sort({ createdAt: -1 })
            .limit(5);
            
        // Return the tasks array directly, not wrapped in an object
        return response.status(200).json(tasks);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to mark a task as done
router.put('/:id/done', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Task.findByIdAndUpdate(
            id, 
            { completed: true },
            { new: true }
        );

        if (!result) {
            return response.status(404).json({ message: 'Task not found' });
        }

        return response.status(200).send({ message: 'Task marked as done successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Get a single task by ID
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const task = await Task.findById(id);
        
        if (!task) {
            return response.status(404).json({ message: 'Task not found' });
        }
        
        return response.status(200).json(task);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;