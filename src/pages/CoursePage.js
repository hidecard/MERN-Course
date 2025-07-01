import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`/api/courses/${id}`);
        setCourse(res.data.data);
        setLoading(false);
      } catch (err) {
        setError('Course not found');
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await axios.post(
        `/api/enrollments`,
        { courseId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/my-courses');
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container>
      {course && (
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {course.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {course.description}
          </Typography>
          <Typography variant="h6" component="h2" sx={{ mt: 4 }}>
            Lessons
          </Typography>
          <List>
            {course.lessons.map((lesson, index) => (
              <React.Fragment key={lesson._id}>
                <ListItem>
                  <ListItemText
                    primary={lesson.title}
                    secondary={lesson.content}
                  />
                </ListItem>
                {index < course.lessons.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEnroll}
            sx={{ mt: 4 }}
          >
            Enroll in this Course
          </Button>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
      )}
    </Container>
  );
};

export default CoursePage;