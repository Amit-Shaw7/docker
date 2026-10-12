import express from 'express';
import { db } from './src/prisma/db';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const todos = db.orm.public.Todo;

const parseId = (value: string | string[] | undefined) => {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
};

// Create
app.post('/todos', async (req, res) => {
    const { title, description, completed } = req.body ?? {};
    if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'title is required' });
    }
    const todo = await todos.create({
        title: title.trim(),
        description: typeof description === 'string' ? description : null,
        completed: completed === true,
    });
    res.status(201).json(todo);
});

// Read all
app.get('/todos', async (req, res) => {
    const all = await todos.orderBy((t) => t.id.asc()).all();
    res.json(all);
});

// Read one
app.get('/todos/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'invalid id' });
    const todo = await todos.where({ id }).first();
    if (!todo) return res.status(404).json({ error: 'todo not found' });
    res.json(todo);
});

// Update
app.put('/todos/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'invalid id' });

    const { title, description, completed } = req.body ?? {};
    const data: { title?: string; description?: string | null; completed?: boolean } = {};
    if (title !== undefined) {
        if (typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({ error: 'title must be a non-empty string' });
        }
        data.title = title.trim();
    }
    if (description !== undefined) {
        if (description !== null && typeof description !== 'string') {
            return res.status(400).json({ error: 'description must be a string or null' });
        }
        data.description = description;
    }
    if (completed !== undefined) {
        if (typeof completed !== 'boolean') {
            return res.status(400).json({ error: 'completed must be a boolean' });
        }
        data.completed = completed;
    }
    if (Object.keys(data).length === 0) {
        return res.status(400).json({ error: 'nothing to update' });
    }

    const todo = await todos.where({ id }).update(data);
    if (!todo) return res.status(404).json({ error: 'todo not found' });
    res.json(todo);
});

// Delete
app.delete('/todos/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'invalid id' });
    const todo = await todos.where({ id }).delete();
    if (!todo) return res.status(404).json({ error: 'todo not found' });
    res.status(204).end();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
