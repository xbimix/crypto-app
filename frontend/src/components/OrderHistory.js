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
  Button,
  CircularProgress,
  Box
} from '@mui/material';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders');
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.delete(`/api/orders/${orderId}`);
      setOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (error) {
      alert(`Failed to cancel order: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Order History
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell>Side</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.symbol}</TableCell>
                  <TableCell sx={{ 
                    color: order.side === 'buy' ? 'success.main' : 'error.main'
                  }}>
                    {order.side.toUpperCase()}
                  </TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>
                    {order.type === 'market' ? 
                      'Market' : 
                      `$${order.price?.toFixed(2)}`
                    }
                  </TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    {order.status === 'open' && (
                      <Button 
                        variant="outlined" 
                        color="error"
                        size="small"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!loading && orders.length === 0 && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No active orders found
        </Typography>
      )}
    </Box>
  );
}

export default OrderHistory;