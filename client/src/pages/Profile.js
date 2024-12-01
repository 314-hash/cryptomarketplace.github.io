import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tab,
  Tabs,
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

const Profile = () => {
  const [tab, setTab] = useState(0);

  // Mock user data
  const user = {
    username: 'CryptoUser123',
    email: 'user@example.com',
    walletAddress: '0x1234...5678',
    joinDate: 'January 2024',
  };

  // Mock order history
  const orders = [
    {
      id: 1,
      product: 'Digital Art Collection',
      date: '2024-01-15',
      price: '0.5 ETH',
      status: 'Completed',
    },
    {
      id: 2,
      product: 'Gaming Console',
      date: '2024-01-10',
      price: '2 ETH',
      status: 'Processing',
    },
  ];

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ width: 100, height: 100, mb: 2 }}>
              <PersonIcon sx={{ fontSize: 60 }} />
            </Avatar>
            <Typography variant="h5" gutterBottom>
              {user.username}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Member since {user.joinDate}
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              Edit Profile
            </Button>
          </Paper>

          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Wallet Information
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
              {user.walletAddress}
            </Typography>
            <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
              Disconnect Wallet
            </Button>
          </Paper>
        </Grid>

        {/* Tabs Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ width: '100%' }}>
            <Tabs value={tab} onChange={handleTabChange}>
              <Tab label="Purchase History" />
              <Tab label="Settings" />
            </Tabs>

            {/* Purchase History Tab */}
            <TabPanel value={tab} index={0}>
              <List>
                {orders.map((order, index) => (
                  <React.Fragment key={order.id}>
                    <ListItem>
                      <ListItemText
                        primary={order.product}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="textPrimary">
                              {order.price}
                            </Typography>
                            {' • '}
                            {order.date}
                            {' • '}
                            <Typography
                              component="span"
                              variant="body2"
                              color={order.status === 'Completed' ? 'success.main' : 'warning.main'}
                            >
                              {order.status}
                            </Typography>
                          </>
                        }
                      />
                      <Button size="small" color="primary">
                        View Details
                      </Button>
                    </ListItem>
                    {index < orders.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </TabPanel>

            {/* Settings Tab */}
            <TabPanel value={tab} index={1}>
              <Typography variant="h6" gutterBottom>
                Account Settings
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Email"
                    secondary={user.email}
                  />
                  <Button size="small" color="primary">
                    Change
                  </Button>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Password"
                    secondary="Last changed 30 days ago"
                  />
                  <Button size="small" color="primary">
                    Change
                  </Button>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Notification Preferences"
                    secondary="Email notifications enabled"
                  />
                  <Button size="small" color="primary">
                    Edit
                  </Button>
                </ListItem>
              </List>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
