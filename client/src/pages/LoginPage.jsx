// client/src/pages/LoginPage.js

import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from '/logo.png'

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "/api"; // Access the environment variable

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Build form data
    const formBody = new URLSearchParams();
    formBody.append('username', form.email);
    formBody.append('password', form.password);

    try {
      console.log('Logging in with:', form);
      const res = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody
      });

      console.log('Response status:', res.status);

      const data = await res.json();
      console.log('Response body:', data);

      if (res.ok && data.access_token) {
        localStorage.setItem('token', data.access_token);
        onLogin();
        navigate('/dashboard');
      } else {
        alert(data.detail || 'Login failed');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Network error: could not reach server.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <img src={Logo} alt="Logo" style={{ width: '500px', marginBottom: '20px' }} />

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            InputProps={{ style: { fontFamily: 'Press Start 2P', color: '#00ffea' } }}
            InputLabelProps={{ style: { fontFamily: 'Press Start 2P', color: '#00ffea' } }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            InputProps={{ style: { fontFamily: 'Press Start 2P', color: '#00ffea' } }}
            InputLabelProps={{ style: { fontFamily: 'Press Start 2P', color: '#00ffea' } }}
          />
          <Button
            type="submit"
            variant="outlined"
            fullWidth
            sx={{
              mt: 4,
              fontFamily: 'Press Start 2P',
              color: 'black',
              fontWeight: 'bold',
              backgroundColor: 'cyan',
              boxShadow: '0 0 10px green, 0 0 20px green',
              transition: '0.3s ease-in-out',
              '&:hover': {
                backgroundColor: 'blue', // or any other color
                boxShadow: '0 0 10px blue, 0 0 20px blue',
              },
            }}
          >
            LOGIN
          </Button>
        </form>

        <Link
          href="/register"
          underline="hover"
          sx={{
            display: 'block',
            mt: 3,
            mx: 'auto',
            width: 'fit-content',
            fontFamily: 'Press Start 2P',
            color: '#ff0066',
            textShadow: '0 0 6px #ff0066',
            transition: 'transform 0.2s ease, color 0.2s ease',
            '&:hover': {
              color: '#ff99cc',
              transform: 'scale(1.05)',
              textShadow: '0 0 10px #ff99cc',
            }
          }}        >
          NEW PILOT? REGISTER HERE
        </Link>

        {localStorage.getItem('token') && (
          <Button
            onClick={handleLogout}
            sx={{ mt: 4, fontFamily: 'Press Start 2P', color: 'red' }}
          >
            LOG OUT
          </Button>
        )}
      </Box>
    </Container>
  );
}
