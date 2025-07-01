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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { Edit, Delete, ExpandMore } from '@mui/icons-material';
import axios from 'axios';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

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
  const [currentUser, setCurrentUser] = useState(null);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openLessonDialog, setOpenLessonDialog] = useState(false);
  const [lessonFormData, setLessonFormData] = useState({
    title: '',
    video: null,
  });
  const [enrollments, setEnrollments] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    teacher: '',
    level: '',
    category: '',
    thumbnail: null,
    startDate: '',
    endDate: '',
    duration: '',
  });
  const [userFormData, setUserFormData] = useState({
   name: '',
   email: '',
   password: '',
   role: 'student',
  })
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
            teacher: course.teacher,
            level: course.level,
            category: course.category,
            thumbnail: course.thumbnail,
            startDate: course.startDate ? new Date(course.startDate).toISOString().split('T')[0] : '',
            endDate: course.endDate ? new Date(course.endDate).toISOString().split('T')[0] : '',
            duration: course.duration,
          }
        : { title: '', description: '', teacher: '', level: '', category: '', thumbnail: null, startDate: '', endDate: '', duration: '' }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentCourse(null);
  };

  const handleUserClickOpen = (user = null) => {
   setCurrentUser(user);
   setUserFormData(
     user
       ? { name: user.name, email: user.email, role: user.role }
       : { name: '', email: '', password: '', role: 'student' }
   );
   setOpenUserDialog(true);
 };

  const handleLessonClickOpen = (course) => {
    setCurrentCourse(course);
    setOpenLessonDialog(true);
  };

  const handleLessonDialogClose = () => {
    setOpenLessonDialog(false);
    setCurrentCourse(null);
    setLessonFormData({ title: '', video: null });
  };

  const handleLessonFormChange = (e) => {
    if (e.target.name === 'video') {
      setLessonFormData({ ...lessonFormData, video: e.target.files[0] });
    } else {
      setLessonFormData({ ...lessonFormData, [e.target.name]: e.target.value });
    }
  };

 const handleUserDialogClose = () => {
   setOpenUserDialog(false);
   setCurrentUser(null);
 };

  const handleChange = (e) => {
    if (e.target.name === 'thumbnail') {
      setFormData({ ...formData, thumbnail: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

 const handleUserFormChange = (e) => {
   setUserFormData({ ...userFormData, [e.target.name]: e.target.value });
 };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const postData = new FormData();
    for (const key in formData) {
      postData.append(key, formData[key]);
    }
    try {
      if (currentCourse) {
        await axios.put(`/api/courses/${currentCourse._id}`, postData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('/api/courses', postData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
      }
      fetchCourses();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

 const handleUserSubmit = async () => {
  const token = localStorage.getItem('token');
  try {
    if (currentUser) {
      await axios.put(`/api/users/${currentUser._id}`, userFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.post('/api/users', userFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    fetchUsers();
    handleUserDialogClose();
  } catch (err) {
    console.error(err);
  }
};

 const handleLessonSubmit = async () => {
   const token = localStorage.getItem('token');
   const postData = new FormData();
   postData.append('title', lessonFormData.title);
   postData.append('video', lessonFormData.video);
   try {
     await axios.post(`/api/courses/${currentCourse._id}/lessons`, postData, {
       headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
     });
     handleLessonDialogClose();
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

  const fetchEnrollments = async (courseId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`/api/courses/${courseId}/enrollments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnrollments(res.data.data);
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
              <Accordion key={course._id} onChange={() => fetchEnrollments(course._id)}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <ListItemText
                    primary={course.title}
                    secondary={course.description}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="h6">Enrolled Students</Typography>
                  <List>
                    {enrollments.map((enrollment) => (
                      <ListItem key={enrollment._id}>
                        <ListItemText primary={enrollment.student.name} secondary={enrollment.student.email} />
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    variant="outlined"
                    onClick={() => handleLessonClickOpen(course)}
                  >
                    Add Lesson
                  </Button>
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
                </AccordionDetails>
              </Accordion>
            ))}
          </List>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
         <Button
           variant="contained"
           color="primary"
           onClick={() => handleUserClickOpen()}
         >
           Create User
         </Button>
          <List>
            {users.filter(u => u.role !== 'teacher').map((user) => (
              <ListItem key={user._id} divider>
                <ListItemText primary={user.name} secondary={user.email} />
                <ListItemSecondaryAction>
                   <IconButton
                       edge="end"
                       aria-label="edit"
                       onClick={() => handleUserClickOpen(user)}
                   >
                       <Edit />
                   </IconButton>
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
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleUserClickOpen()}
          >
            Create Teacher
          </Button>
        <List>
            {users.filter(u => u.role === 'teacher').map((user) => (
              <ListItem key={user._id} divider>
                <ListItemText primary={user.name} secondary={user.email} />
                <ListItemSecondaryAction>
                   <IconButton
                       edge="end"
                       aria-label="edit"
                       onClick={() => handleUserClickOpen(user)}
                   >
                       <Edit />
                   </IconButton>
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
          <FormControl fullWidth margin="dense" variant="standard">
            <InputLabel id="teacher-select-label">Teacher</InputLabel>
            <Select
              labelId="teacher-select-label"
              id="teacher-select"
              name="teacher"
              value={formData.teacher}
              onChange={handleChange}
              label="Teacher"
            >
              {users
                .filter((user) => user.role === 'teacher')
                .map((teacher) => (
                  <MenuItem key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
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
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Upload Thumbnail
            <input
              type="file"
              name="thumbnail"
              hidden
              onChange={handleChange}
            />
          </Button>
          {formData.thumbnail && <Typography variant="body2" sx={{ mt: 1 }}>{typeof formData.thumbnail === 'string' ? formData.thumbnail : formData.thumbnail.name}</Typography>}
         <TextField
           margin="dense"
           name="startDate"
           label="Start Date"
           type="date"
           fullWidth
           variant="standard"
           value={formData.startDate}
           onChange={handleChange}
           InputLabelProps={{
             shrink: true,
           }}
         />
         <TextField
           margin="dense"
           name="endDate"
           label="End Date"
           type="date"
           fullWidth
           variant="standard"
           value={formData.endDate}
           onChange={handleChange}
           InputLabelProps={{
             shrink: true,
           }}
         />
         <TextField
           margin="dense"
           name="duration"
           label="Duration"
           type="text"
           fullWidth
           variant="standard"
           value={formData.duration}
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
     <Dialog open={openUserDialog} onClose={handleUserDialogClose}>
       <DialogTitle>{currentUser ? 'Edit User' : 'Create User'}</DialogTitle>
       <DialogContent>
         <TextField
           autoFocus
           margin="dense"
           name="name"
           label="Name"
           type="text"
           fullWidth
           variant="standard"
           value={userFormData.name}
           onChange={handleUserFormChange}
         />
         <TextField
           margin="dense"
           name="email"
           label="Email"
           type="email"
           fullWidth
           variant="standard"
           value={userFormData.email}
           onChange={handleUserFormChange}
         />
         {!currentUser && (
           <TextField
             margin="dense"
             name="password"
             label="Password"
             type="password"
             fullWidth
             variant="standard"
             value={userFormData.password}
             onChange={handleUserFormChange}
           />
         )}
         <FormControl fullWidth margin="dense" variant="standard">
           <InputLabel id="role-select-label">Role</InputLabel>
           <Select
             labelId="role-select-label"
             id="role-select"
             name="role"
             value={userFormData.role}
             onChange={handleUserFormChange}
             label="Role"
           >
             <MenuItem value="student">Student</MenuItem>
             <MenuItem value="teacher">Teacher</MenuItem>
             <MenuItem value="admin">Admin</MenuItem>
           </Select>
         </FormControl>
       </DialogContent>
       <DialogActions>
         <Button onClick={handleUserDialogClose}>Cancel</Button>
         <Button onClick={handleUserSubmit}>{currentUser ? 'Save' : 'Create'}</Button>
       </DialogActions>
     </Dialog>
      <Dialog open={openLessonDialog} onClose={handleLessonDialogClose}>
        <DialogTitle>Add Lesson</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Lesson Title"
            type="text"
            fullWidth
            variant="standard"
            value={lessonFormData.title}
            onChange={handleLessonFormChange}
          />
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Upload Video
            <input
              type="file"
              name="video"
              hidden
              onChange={handleLessonFormChange}
            />
          </Button>
          {lessonFormData.video && <Typography variant="body2" sx={{ mt: 1 }}>{lessonFormData.video.name}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLessonDialogClose}>Cancel</Button>
          <Button onClick={handleLessonSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPage;