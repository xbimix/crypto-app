// App.js - Main application component

// React and Routing Imports
import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';



// Material-UI Core Components
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Container, 
  IconButton, 
  Switch,
  Drawer,
  List,
  ListItem
} from '@mui/material';

// Material-UI Icons
import MenuIcon from '@mui/icons-material/Menu';
import GitHubIcon from '@mui/icons-material/GitHub';

// Custom Components
import CryptoTable from './components/CryptoTable';
import BestBuys from './components/BestBuys';
import CryptoDetail from './components/CryptoDetail';
import OrderHistory from './components/OrderHistory';
import PriceChart from './components/PriceChart';

function App({ darkMode, setDarkMode }) {
  // ============= STATE MANAGEMENT =============
  const theme = useTheme(); // Access MUI theme
  const location = useLocation(); // Get current route location
  const [mobileOpen, setMobileOpen] = useState(false); // Mobile drawer state
  // ============= NAVIGATION CONFIG =============
  const navItems = [
    { path: '/', label: 'Live Prices' },
    { path: '/best-buys', label: 'Best Opportunities' },
    { path: '/orders', label: 'My Orders' }
  ];

  // ============= EVENT HANDLERS =============
  const handleThemeChange = () => setDarkMode(!darkMode);
  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  return (
    <div className="App">
      {/* ============= TOP NAVIGATION BAR ============= */}
      <AppBar position="static" color="default">
        <Toolbar>
          {/* Mobile Menu Button */}
          <IconButton
            edge="start"
            color="inherit"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Desktop Navigation Links */}
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              color="inherit"
              sx={{ 
                fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              {item.label}
            </Button>
          ))}

          {/* Spacer to push elements to the right */}
          <div style={{ flexGrow: 1 }} />

          {/* Theme Toggle Switch */}
          <Switch
            checked={darkMode}
            onChange={handleThemeChange}
            color="primary"
            inputProps={{ 'aria-label': 'dark mode toggle' }}
          />

          {/* GitHub Repository Link */}
          <IconButton
            color="inherit"
            href="https://github.com/yourusername/crypto-trading-app"
            target="_blank"
          >
            <GitHubIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* ============= MOBILE NAVIGATION DRAWER ============= */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
      >
        <List sx={{ width: 250 }}>
          {navItems.map((item) => (
            <ListItem 
              button 
              key={item.path}
              component={Link}
              to={item.path}
              onClick={toggleDrawer}
            >
              {item.label}
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* ============= MAIN CONTENT AREA ============= */}
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          {/* Live Prices Dashboard */}
          <Route path="/" element={<CryptoTable />} />
          
          {/* Best Buying Opportunities Page */}
          <Route path="/best-buys" element={<BestBuys />} />
          
          {/* Individual Crypto Detail Page with Nested Chart */}
          <Route path="/crypto/:symbol" element={<CryptoDetail />}>
            <Route path="chart" element={<PriceChart />} />
          </Route>
          
          {/* Order History Page */}
          <Route path="/orders" element={<OrderHistory />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;