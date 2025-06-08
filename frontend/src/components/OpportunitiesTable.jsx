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
  LinearProgress,
  Typography,
  Box
} from '@mui/material';

export default function OpportunitiesTable() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get('/api/top-opportunities');
        setOpportunities(response.data);
        setError(null);
      } catch (error) {
        setError('Failed to load opportunities. Check backend logs.');
        console.error('Opportunities fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
    const interval = setInterval(fetchOpportunities, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Function to determine color based on score
  const getScoreColor = (score) => {
    if (score > 8) return '#4caf50'; // Green - excellent opportunity
    if (score > 5) return '#ff9800'; // Orange - good opportunity
    return '#f44336'; // Red - poor opportunity
  };

  return (
    <TableContainer component={Paper} elevation={3} sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ p: 2, fontWeight: 'bold' }}>
        Top Trading Opportunities
      </Typography>
      
      {error && (
        <Box sx={{ p: 2, bgcolor: '#ffebee' }}>
          <Typography color="error" align="center">
            {error}
          </Typography>
        </Box>
      )}
      
      <Table aria-label="top opportunities table">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>Crypto</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Price (USDT)</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Opportunity Score</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Trend Strength</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Reversion Potential</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Liquidity Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6}>
                <LinearProgress />
              </TableCell>
            </TableRow>
          ) : opportunities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography variant="body1">No opportunities found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            opportunities.map((opp) => (
              <TableRow key={opp.symbol} hover>
                <TableCell component="th" scope="row">
                  <Typography fontWeight="bold">{opp.symbol}</Typography>
                </TableCell>
                <TableCell align="right">
                  {opp.price ? `$${opp.price.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: opp.price < 1 ? 6 : 2 
                  })}` : 'N/A'}
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Box 
                      width={`${Math.min(100, opp.score * 10)}%`} 
                      height={20} 
                      bgcolor={getScoreColor(opp.score)}
                      borderRadius={1}
                      minWidth={20}
                    />
                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>
                      {opp.score ? opp.score.toFixed(2) : 'N/A'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ color: opp.trend >= 0 ? '#4caf50' : '#f44336' }}>
                  <Typography fontWeight="bold">
                    {opp.trend >= 0 ? '↑' : '↓'} {opp.trend ? Math.abs(opp.trend).toFixed(4) : 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ color: opp.reversion >= 0 ? '#4caf50' : '#f44336' }}>
                  <Typography fontWeight="bold">
                    {opp.reversion >= 0 ? '↑' : '↓'} {opp.reversion ? Math.abs(opp.reversion).toFixed(4) : 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography fontWeight="bold">
                    {opp.liquidity ? Math.round(opp.liquidity).toLocaleString() : 'N/A'}
                  </Typography>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}