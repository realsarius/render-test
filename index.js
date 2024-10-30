const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

let notes = [
    {
        id: "1",
        content: "HTML is easy",
        important: true
    },
    {
        id: "2",
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: "3",
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
];

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.get('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    const note = notes.find(note => note.id === id);
    if (note) {
        res.status(200).json(note);
    } else {
        res.status(404).send('Not Found');
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    const initialLength = notes.length;

    notes = notes.filter(note => note.id !== id);

    if (notes.length === initialLength) {
        return res.status(404).json({error: "Note not found."});
    }

    res.status(200).json({message: "Note deleted successfully."});
});

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => Number(n.id)))
        : 0;
    return String(maxId + 1);
};

app.post('/api/notes', (request, response) => {
    const body = request.body;

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        });
    }

    const note = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: generateId(),
    };

    notes = notes.concat(note);

    response.json(note);
});

// PUT request to update an existing note
app.put('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;

    const note = notes.find(note => note.id === id);
    if (!note) {
        return res.status(404).json({error: "Note not found."});
    }

    const updatedNote = {
        ...note,
        content: body.content || note.content,
        important: body.important !== undefined ? body.important : note.important,
    };

    notes = notes.map(note => note.id === id ? updatedNote : note);

    res.status(200).json(updatedNote);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
