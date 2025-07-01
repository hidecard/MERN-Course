import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursePage from './pages/CoursePage';
import MyCoursesPage from './pages/MyCoursesPage';
import AdminPage from './pages/AdminPage';

// Components
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/course/:id" element={<CoursePage />} />
          <Route path="/my-courses" element={<MyCoursesPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
