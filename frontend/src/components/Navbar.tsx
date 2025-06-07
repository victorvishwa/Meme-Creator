import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  useTheme,
  Typography,
  Menu,
  MenuItem,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useCustomTheme();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
  };

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Create Meme', icon: <AddIcon />, path: '/create' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  ];

  const renderMobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
      PaperProps={{
        sx: {
          width: 240,
          background: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.text}
            component={RouterLink}
            to={item.path}
            onClick={handleMobileMenuToggle}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {user && (
          <>
            <Divider />
            <ListItem button onClick={handleLogout}>
              <ListItemIcon sx={{ color: 'inherit' }}><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );

  return (
    <AppBar
      position="fixed"
      sx={{
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: 1200,
        borderRadius: 4,
        backdropFilter: 'blur(10px)',
        backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            fontWeight: 700,
            letterSpacing: 1,
            background: 'linear-gradient(45deg, #6366f1, #ec4899)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          MEME CREATOR
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={toggleTheme}
            color="inherit"
            sx={{
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'rotate(30deg)',
              },
            }}
          >
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {isMobile ? (
            <IconButton
              color="inherit"
              onClick={handleMobileMenuToggle}
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {user ? (
                <>
                  <Button
                    component={RouterLink}
                    to="/create"
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      background: 'linear-gradient(45deg, #6366f1, #ec4899)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #4f46e5, #db2777)',
                      },
                    }}
                  >
                    Create Meme
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/dashboard"
                    variant="outlined"
                    startIcon={<DashboardIcon />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Dashboard
                  </Button>
                  <IconButton
                    onClick={logout}
                    color="inherit"
                    sx={{
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <LogoutIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      background: 'linear-gradient(45deg, #6366f1, #ec4899)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #4f46e5, #db2777)',
                      },
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}
        </Box>
      </Toolbar>
      {renderMobileMenu()}
    </AppBar>
  );
};

export default Navbar; 