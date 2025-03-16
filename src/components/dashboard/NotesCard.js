import React, { useState } from 'react';
import { Card, CardContent, Button, Modal, Box, Typography } from '@mui/material';
import NotesContent from './NotesContent';

const NotesCard = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Card sx={{ minWidth: 200, m: 1, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          Notes test
        </Typography>
        <Button variant="contained" onClick={handleOpen}>
          View
        </Button>
      </CardContent>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="notes-modal-title"
        aria-describedby="notes-modal-description"
      >
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
          <NotesContent onClose={handleClose} />
        </Box>
      </Modal>
    </Card>
  );
};

export default NotesCard;