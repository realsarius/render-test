require('dotenv').config();
const Note = require('./models/note');

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const app = express();


app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false)
mongoose.connect(url)

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes);
    })
});

app.get('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    Note.findById(noteId)
        .then(note => {
            if (note) {
                res.json(note);
            } else {
                res.status(404).json({error: 'note not found'});
            }
        })
        .catch(error => {
            res.status(500).json({error: 'invalid ID format', details: error.message});
        });
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

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (body.content === undefined) {
        return response.status(400).json({error: 'content missing'})
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
});

app.put('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;

    const updatedNote = {
        content: body.content,
        important: body.important,
    };

    Note.findByIdAndUpdate(id, updatedNote, { new: true, runValidators: true })
        .then(updatedNote => {
            if (updatedNote) {
                res.status(200).json(updatedNote);
            } else {
                res.status(404).json({ error: "Note not found." });
            }
        })
        .catch(error => {
            res.status(500).json({ error: "Update failed.", details: error.message });
        });
});


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
