<<<<<<< HEAD
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


function App() {
  const theme = useTheme();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

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
            sx={{ fontWeight: location.pathname === '/' ? 'bold' : 'normal' }}
          >
            Live Prices
          </Button>
          
          <Button 
            component={Link} 
            to="/best-buys"
            color="inherit"
            sx={{ fontWeight: location.pathname === '/best-buys' ? 'bold' : 'normal' }}
          >
            Best Opportunities
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

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<CryptoTable />} />
          <Route path="/best-buys" element={<BestBuys />} />
          <Route path="/chart/:symbol" element={<PriceChart />} />
          
          <Route path="/crypto/:symbol" element={<CryptoDetail />} />
          <Route path="/orders" element={<OrderHistory />} />
        </Routes>
      </Container>
    </div>
  );
}

=======
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


function App() {
  const theme = useTheme();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

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
            sx={{ fontWeight: location.pathname === '/' ? 'bold' : 'normal' }}
          >
            Live Prices
          </Button>
          
          <Button 
            component={Link} 
            to="/best-buys"
            color="inherit"
            sx={{ fontWeight: location.pathname === '/best-buys' ? 'bold' : 'normal' }}
          >
            Best Opportunities
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

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<CryptoTable />} />
          <Route path="/best-buys" element={<BestBuys />} />
          <Route path="/chart/:symbol" element={<PriceChart />} />
          
          <Route path="/crypto/:symbol" element={<CryptoDetail />} />
          <Route path="/orders" element={<OrderHistory />} />
        </Routes>
      </Container>
    </div>
  );
}

>>>>>>> b599aa4371431de9ca4e937d9a077375f81f08b2
export default App;