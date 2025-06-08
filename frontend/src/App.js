import React, { useState, useMemo } from 'react'; // Add useMemo import
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Container, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  Switch
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import GitHubIcon from '@mui/icons-material/GitHub';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Import ThemeProvider
import CssBaseline from '@mui/material/CssBaseline';
import CryptoTable from './components/CryptoTable';
import BestBuys from './components/BestBuys';
import PriceChart from './components/PriceChart';
import CryptoDetail from './components/CryptoDetail';
import OrderHistory from './components/OrderHistory';
import OpportunitiesTable from './components/OpportunitiesTable';

function App() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  
  const navItems = [
    { path: '/', label: 'Live Prices' },
    { path: '/best-buys', label: 'Best Opportunities' },
    { path: '/opportunities', label: 'Top Opportunities' }, // ADD THIS LINE
    { path: '/orders', label: 'My Orders' },
  ];

  // Create theme with useMemo for better performance
  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#00ff88',
      },
      ...(darkMode ? {
        background: {
          default: '#0a1929',
          paper: '#001e3c',
        }
      } : {
        background: {
          default: '#f5f5f5',
          paper: '#ffffff',
        }
      })
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
    }
  }), [darkMode]);

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
            
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                color="inherit"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal'
                }}
              >
                {item.label}
              </Button>
            ))}


            
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
        
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
        >
          <List sx={{ width: 250 }}>
            {navItems.map((item) => (
              <ListItem 
                key={item.path}
                button 
                component={Link}
                to={item.path}
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>

           

        </Drawer>
        
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<CryptoTable />} />
            <Route path="/best-buys" element={<BestBuys />} />
            <Route path="/crypto/:symbol" element={<CryptoDetail />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/opportunities" element={<OpportunitiesTable />} />
          </Routes>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;