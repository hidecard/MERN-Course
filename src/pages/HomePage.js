import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Box,
  CardMedia,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/api/courses');
        setCourses(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Box
        sx={{
          my: 4,
          textAlign: 'center',
          py: 10,
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Your Language Learning Journey Starts Here
        </Typography>
        <Typography variant="h5" component="p" gutterBottom>
          Explore a wide range of courses and become fluent in no time.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          component={RouterLink}
          to="/courses"
        >
          Browse Courses
        </Button>
      </Box>
      <TextField
        fullWidth
        label="Search for courses"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 4 }}
      />
      <Grid container spacing={4}>
        {filteredCourses.map((course) => (
          <Grid item key={course._id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={`https://source.unsplash.com/random/?${course.category}`}
                alt={course.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  component={RouterLink}
                  to={`/course/${course._id}`}
                >
                  View Course
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;