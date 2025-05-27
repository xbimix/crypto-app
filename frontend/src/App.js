import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Container, 
  IconButton, 
  useTheme,
  Switch
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import GitHubIcon from '@mui/icons-material/GitHub';
import CryptoTable from './components/CryptoTable';
import BestBuys from './components/BestBuys';
import PriceChart from './components/PriceChart';
import CryptoDetail from './components/CryptoDetail';
import OrderHistory from './components/OrderHistory';
// Add these imports at the top
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
function App() {
  const theme = createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    primary: {
      main: '#00ff88',
    },
  },
});
  const location = useLocation();
  // Replace your existing theme creation with:
const [darkMode, setDarkMode] = useState(true);

  const [mobileOpen, setMobileOpen] = useState(false);
  // Inside App() function, before return:
const navItems = [
  { path: '/', label: 'Live Prices' },
  { path: '/best-buys', label: 'Best Opportunities' },
  { path: '/orders', label: 'My Orders' },
];
  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="App">
      <AppBar position="static" color="default">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <MenuIcon />
          </IconButton>
          
          <Button 
            component={Link} 
            to="/" 
            color="inherit"
            sx={{ 
  display: { xs: 'none', sm: 'block' },
  fontWeight: location.pathname === '/' ? 'bold' : 'normal' 
}}
          >
            Live Prices
          </Button>
          
          <Button 
            component={Link} 
            to="/best-buys"
            color="inherit"
            sx={{ 
  display: { xs: 'none', sm: 'block' },
  fontWeight: location.pathname === '/' ? 'bold' : 'normal' 
}}
          >
            Best Opportunities
          </Button>
          <Button 
  component={Link} 
  to="/orders"
  color="inherit"
  sx={{ 
  display: { xs: 'none', sm: 'block' },
  fontWeight: location.pathname === '/' ? 'bold' : 'normal' 
}}
>
  My Orders
</Button>
          <div style={{ flexGrow: 1 }} />
          
          <Switch
            checked={darkMode}
            onChange={handleThemeChange}
            color="primary"
            inputProps={{ 'aria-label': 'dark mode toggle' }}
          />
          
          <IconButton
            color="inherit"
            href="https://github.com/yourusername/crypto-trading-app"
            target="_blank"
          >
            <GitHubIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
          // Add this after the AppBar component:
<Drawer
  anchor="left"
  open={mobileOpen}
  onClose={() => setMobileOpen(false)}
>
  <List sx={{ width: 250 }}>
    <ListItem 
      button 
      component={Link}
      to="/"
      onClick={() => setMobileOpen(false)}
    >
      <ListItemText primary="Live Prices" />
    </ListItem>
    <ListItem 
      button 
      component={Link}
      to="/best-buys"
      onClick={() => setMobileOpen(false)}
    >
      <ListItemText primary="Best Opportunities" />
    </ListItem>
    <ListItem 
      button 
      component={Link}
      to="/orders"
      onClick={() => setMobileOpen(false)}
    >
      <ListItemText primary="My Orders" />
    </ListItem>
  </List>
</Drawer>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<CryptoTable />} />
          <Route path="/best-buys" element={<BestBuys />} />
          <Route path="/chart/:symbol" element={<PriceChart />} />
          
         <Route path="/crypto/:symbol" element={<CryptoDetail />}>
  {/* If you want chart as sub-route */}
  <Route path="chart" element={<PriceChart />} />
</Route>
          <Route path="/orders" element={<OrderHistory />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;