import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Switch, Box, Button, Modal, TextField, List, ListItem, ListItemText, IconButton } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

const DeviceCard = ({ device }) => {
  const { id, name, type, status, value } = device;
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOpen = async () => {
    console.log("Opening notes ");
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/erl/fetch');
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();

      const parsedNotes = data.map(note => ({
        id: note.id,
        title: note.title,
        description: note.content,
        created: note.created_at,
        modified: note.updated_at,
        author: note.owner
      }));
      console.log("Parsed notes:", parsedNotes);
      setNotes(parsedNotes);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };
  
  const handleDeleteNote = async (note_id) => {
    console.log("Deleting note with ID: ", note_id);
    const params = new URLSearchParams();
    params.append('note_id', note_id);
    
    try {
      const response = await fetch(`http://localhost:8080/erl/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: params.toString(),
      });
      if (!response.ok) throw new Error('Failed to delete note');
      const updatedNotes = notes.filter(note => note.id !== note_id);
      setNotes(updatedNotes);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (newNote.trim() === '' || newTitle.trim() === '') return;

    const params = new URLSearchParams();
    params.append('TYPE', 'NOTE');
    params.append('title', newTitle);
    params.append('text', newNote);
    params.append('user', 'Andrew');
    try {
      const response = await fetch('http://localhost:8080/erl/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: params.toString(),
      });
      if (!response.ok) throw new Error('Failed to add note');
      const newNoteFromServer = await response.json();
      console.log("New note from server: ", newNoteFromServer);
      console.log("newNoteFromServer.created: ", newNoteFromServer.created);
      setNotes([...notes, {
        id: newNoteFromServer.id,
        title: newNoteFromServer.title,
        description: newNoteFromServer.text,
        created: formatDateTime(newNoteFromServer.created),
        modified: newNoteFromServer.modified,
        author: newNoteFromServer.user,
      }]);
      setNewNote('');
      setNewTitle('');
    } catch (err) {
      setError(err.message);
    }
  };

  const formatErlangDate = (dateTuple) => {
    if (dateTuple === undefined) {
      return "";
    }
    const [[year, month, day], [hour, minute, second]] = dateTuple;
    return new Date(year, month - 1, day, hour, minute, second).toLocaleString();
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  

  if (type === 'notes') {
    return (
      <Card sx={{ width: '100%', aspectRatio: '1 / 1', boxShadow: 3, borderRadius: 2 }}>
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h6" component="div" mb={2}>
            {name}
          </Typography>
          <Button variant="contained" onClick={handleOpen}>
            View
          </Button>
        </CardContent>
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">Notes</Typography>
              <IconButton onClick={handleClose}><CloseIcon /></IconButton>
            </Box>
            {loading ? (
              <Typography>Loading notes...</Typography>
            ) : error ? (
              <Typography color="error">Error: {error}</Typography>
            ) : (
              <>
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
                      <Button sx={{color: 'red', minWidth: 0, padding: 1, width: 40, minHeight: 0, height: 40, fontWeight: 'bold', borderRadius: 20}} onClick={() => handleDeleteNote(note.id)}>
                      <DeleteIcon fontSize="small" /></Button>
                    </ListItem>
                  ))}
                </List>
                <TextField
                  label="Title"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
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
            )}
          </Box>
        </Modal>
      </Card>
    );
  }

  const renderDeviceIcon = () => {
    switch (type) {
      case 'light': return <LightbulbIcon color={status === 'on' ? 'warning' : 'disabled'} fontSize="large" />;
      case 'thermostat': return <ThermostatIcon color="primary" fontSize="large" />;
      case 'lock': return <LockIcon color={status === 'locked' ? 'success' : 'error'} fontSize="large" />;
      default: return null;
    }
  };

  const renderDeviceValue = () => {
    switch (type) {
      case 'light': return <Switch checked={status === 'on'} color="primary" />;
      case 'thermostat': return <Typography variant="h4">{value}°</Typography>;
      case 'lock': return <Typography variant="body1">{status === 'locked' ? 'Locked' : 'Unlocked'}</Typography>;
      default: return <Typography variant="body1">{status}</Typography>;
    }
  };

  return (
    <Card sx={{ width: '100%', aspectRatio: '1 / 1', boxShadow: 3, borderRadius: 2 }}>
      <CardContent sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <Typography variant="h6" component="div">{name}</Typography>
          {renderDeviceIcon()}
          <Box mt={2}>{renderDeviceValue()}</Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DeviceCard;