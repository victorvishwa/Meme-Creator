import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  useTheme,
} from '@mui/material';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: 'calc(100vh - 88px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #6366f1, #ec4899)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Welcome Back
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to your account to continue
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ mb: 3 }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mb: 2,
                height: 48,
                background: 'linear-gradient(45deg, #6366f1, #ec4899)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #4f46e5, #db2777)',
                },
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
            <Typography variant="body2" align="center" color="text.secondary">
              Don't have an account?{' '}
              <Link
                to="/register"
                style={{
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                Create one
              </Link>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 