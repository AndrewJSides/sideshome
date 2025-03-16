import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const NotesContent = ({ onClose }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [title, setTitle] = useState(''); // Add title field for new notes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notes from the API
  useEffect(() => {
    console.log('Fetching notes...');
    const fetchNotes = async () => {
      try {
        const response = await fetch('http://localhost:8080/erl/simple_server:fetch');
        if (!response.ok) throw new Error('Failed to fetch notes');
        const data = await response.json();
        // Transform Erlang tuple format to JS object
        console.log("Parsing response data...");
        const parsedNotes = data.map(([id, title, description, created, modified, author]) => ({
          id,
          title,
          description,
          created: formatErlangDate(created),
          modified: formatErlangDate(modified),
          author,
        }));
        setNotes(parsedNotes);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  // Helper function to format Erlang date tuple
  const formatErlangDate = (dateTuple) => {
    const [[year, month, day], [hour, minute, second]] = dateTuple;
    return new Date(year, month - 1, day, hour, minute, second).toLocaleString();
  };

  // Handle adding a new note (placeholder for POST)
  const handleAddNote = async () => {
    if (newNote.trim() === '' || title.trim() === '') return;
    const noteData = {
      title,
      text: newNote, // Assuming 'description' is the text field
      author: 'Andrew', // Hardcoded for now; replace with dynamic user later
    };
    try {
      const response = await fetch('http://localhost:8080/erl/simple_server:fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      });
      if (!response.ok) throw new Error('Failed to add note');
      const newNoteFromServer = await response.json();
      setNotes([...notes, {
        id: newNoteFromServer.id,
        title: newNoteFromServer.title,
        description: newNoteFromServer.text,
        created: formatErlangDate(newNoteFromServer.created),
        modified: formatErlangDate(newNoteFromServer.modified),
        author: newNoteFromServer.author,
      }]);
      setNewNote('');
      setTitle('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Typography>Loading notes...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" id="notes-modal-title">
          Notes
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
        {notes.map(note => (
          <ListItem key={note.id}>
            <ListItemText
              primary={note.title}
              secondary={
                <>
                  <Typography variant="body2">{note.description}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {note.created} by {note.author}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <TextField
        label="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="New Note"
        value={newNote}
        onChange={e => setNewNote(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={handleAddNote} fullWidth>
        Add Note
      </Button>
    </>
  );
};

export default NotesContent;