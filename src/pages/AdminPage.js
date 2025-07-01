import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tab,
  Tabs,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const AdminPage = () => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
  });
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchCourses();
    fetchUsers();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/api/courses');
      setCourses(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClickOpen = (course = null) => {
    setCurrentCourse(course);
    setFormData(
      course
        ? {
            title: course.title,
            description: course.description,
            category: course.category,
            level: course.level,
          }
        : { title: '', description: '', category: '', level: '' }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentCourse(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      if (currentCourse) {
        await axios.put(`/api/courses/${currentCourse._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('/api/courses', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchCourses();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCourse = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
            <Tab label="Courses" />
            <Tab label="Users" />
            <Tab label="Teachers" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleClickOpen()}
          >
            Create Course
          </Button>
          <List>
            {courses.map((course) => (
              <ListItem key={course._id} divider>
                <ListItemText
                  primary={course.title}
                  secondary={course.description}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleClickOpen(course)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteCourse(course._id)}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <List>
            {users.map((user) => (
              <ListItem key={user._id} divider>
                <ListItemText primary={user.name} secondary={user.email} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <Typography>Teacher management coming soon...</Typography>
        </TabPanel>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {currentCourse ? 'Edit Course' : 'Create Course'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill in the details of the course.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="category"
            label="Category"
            type="text"
            fullWidth
            variant="standard"
            value={formData.category}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="level"
            label="Level"
            type="text"
            fullWidth
            variant="standard"
            value={formData.level}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {currentCourse ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPage;