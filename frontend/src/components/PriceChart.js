import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography,
  CircularProgress,
  Box
} from '@mui/material';
import OrderForm from './OrderForm';

function BestBuys() {
  const [bestBuys, setBestBuys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestOpportunities = () => {
      axios.get('/api/best_opportunities')
        .then(response => {
          const data = response.data
            .filter(crypto => crypto.symbol !== 'MATIC') // Exclude MATIC
            .slice(0, 25); // Get top 25
          setBestBuys(data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching opportunities:", error);
          setLoading(false);
        });
    };

    // Initial fetch
    fetchBestOpportunities();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchBestOpportunities, 30000);
    return () => clearInterval(interval);
  }, []);

  const calculateDiscount = (price, support) => {
    if (!price || !support) return 0;
    return ((1 - (price / support)) * 100).toFixed(2);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ marginBottom: 3 }}>
        🚀 Best Buy Opportunities
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
          <CircularProgress />
          <Typography variant="body1" sx={{ marginLeft: 2 }}>
            Scanning markets for opportunities...
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Crypto</TableCell>
                <TableCell>Current Price</TableCell>
                <TableCell>Support Level</TableCell>
                <TableCell>Discount (%)</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bestBuys.map((crypto) => (
                <TableRow key={crypto.symbol}>
                  <TableCell>
                    <Typography fontWeight="bold">
                      {crypto.symbol}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    ${crypto.price?.toLocaleString(undefined, { maximumFractionDigits: 8 })}
                  </TableCell>
                  <TableCell>
                    {crypto.support ? 
                      `$${crypto.support.toLocaleString()}` : 
                      'N/A'}
                  </TableCell>
                  <TableCell sx={{ 
                    color: crypto.price < crypto.support ? 'success.main' : 'error.main',
                    fontWeight: 500
                  }}>
                    {crypto.support ? 
                      `${calculateDiscount(crypto.price, crypto.support)}%` : 
                      'N/A'}
                  </TableCell>
                  <TableCell>
                    <OrderForm symbol={crypto.symbol} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!loading && bestBuys.length === 0 && (
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          No strong buying opportunities found at the moment. Check back later!
        </Typography>
      )}
    </Box>
  );
}

export default BestBuys;