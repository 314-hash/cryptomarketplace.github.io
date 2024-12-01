import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Badge,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  useMediaQuery,
  Chip,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  AccountCircle,
  ShoppingCart,
  Menu as MenuIcon,
  Home,
  Store,
  Dashboard,
  ExitToApp,
  AccountBalanceWallet,
  Warning,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useWalletContext } from '../contexts/WalletContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const {
    account,
    networkName,
    balance,
    isConnecting,
    error,
    isConnected,
    connectWallet,
    disconnectWallet,
  } = useWalletContext();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleMobileMenuToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDisconnect = () => {
    disconnectWallet();
    handleClose();
  };

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Products', icon: <Store />, path: '/products' },
    { text: 'Sell', icon: <Dashboard />, path: '/seller/dashboard' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div">
          Crypto Marketplace
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={() => setMobileOpen(false)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const renderWalletButton = () => {
    if (error) {
      return (
        <Tooltip title={error}>
          <Button
            variant="outlined"
            color="error"
            onClick={connectWallet}
            startIcon={<Warning />}
            sx={{
              ml: 2,
              borderColor: isScrolled ? 'error.main' : 'error.light',
              color: isScrolled ? 'error.main' : 'error.light',
            }}
          >
            Retry Connection
          </Button>
        </Tooltip>
      );
    }

    if (isConnecting) {
      return (
        <Button
          variant="outlined"
          disabled
          sx={{
            ml: 2,
            borderColor: isScrolled ? 'primary.main' : 'white',
            color: isScrolled ? 'primary.main' : 'white',
          }}
        >
          <CircularProgress size={20} sx={{ mr: 1 }} />
          Connecting...
        </Button>
      );
    }

    if (isConnected) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={`${parseFloat(balance).toFixed(4)} ETH`}
            sx={{
              color: isScrolled ? 'text.primary' : 'white',
              bgcolor: isScrolled ? 'background.paper' : 'rgba(255, 255, 255, 0.1)',
            }}
          />
          <Tooltip title={networkName}>
            <Chip
              label={networkName}
              sx={{
                color: isScrolled ? 'text.primary' : 'white',
                bgcolor: isScrolled ? 'background.paper' : 'rgba(255, 255, 255, 0.1)',
              }}
            />
          </Tooltip>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            sx={{ color: isScrolled ? 'text.primary' : 'white' }}
          >
            <AccountCircle />
          </IconButton>
        </Box>
      );
    }

    return (
      <Button
        variant="outlined"
        onClick={connectWallet}
        startIcon={<AccountBalanceWallet />}
        sx={{
          ml: 2,
          borderColor: isScrolled ? 'primary.main' : 'white',
          color: isScrolled ? 'primary.main' : 'white',
          '&:hover': {
            borderColor: isScrolled ? 'primary.dark' : 'rgba(255, 255, 255, 0.9)',
            bgcolor: isScrolled ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        Connect Wallet
      </Button>
    );
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: isScrolled ? 'background.default' : 'transparent',
          boxShadow: isScrolled ? 1 : 'none',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ px: { xs: 0 } }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuToggle}
              sx={{ display: { sm: 'none' }, mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                flexGrow: 1,
                textDecoration: 'none',
                color: isScrolled ? 'text.primary' : 'white',
                fontWeight: 700,
              }}
            >
              Crypto Marketplace
            </Typography>

            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  sx={{
                    mx: 1,
                    color: isScrolled ? 'text.primary' : 'white',
                    '&:hover': {
                      bgcolor: isScrolled ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>

            <IconButton
              color="inherit"
              sx={{ color: isScrolled ? 'text.primary' : 'white' }}
            >
              <Badge badgeContent={0} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {renderWalletButton()}

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My Orders</MenuItem>
              <Divider />
              <MenuItem onClick={handleDisconnect}>
                <ListItemIcon>
                  <ExitToApp fontSize="small" />
                </ListItemIcon>
                Disconnect
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar /> {/* Spacer */}

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleMobileMenuToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
