import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Box,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const MyCoursesPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view your courses.');
          setLoading(false);
          return;
        }
        const res = await axios.get('/api/enrollments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEnrollments(res.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch your courses.');
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

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
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Courses
        </Typography>
      </Box>
      {enrollments.length === 0 ? (
        <Typography>You are not enrolled in any courses yet.</Typography>
      ) : (
        <Grid container spacing={4}>
          {enrollments.map((enrollment) => (
            <Grid item key={enrollment._id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {enrollment.course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {enrollment.course.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    component={RouterLink}
                    to={`/course/${enrollment.course._id}`}
                  >
                    View Course
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyCoursesPage;