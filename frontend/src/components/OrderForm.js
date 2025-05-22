<<<<<<< HEAD
import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Select, MenuItem, Box } from '@mui/material';

export default function OrderForm({ symbol }) {
    const [amount, setAmount] = useState('');
    const [orderType, setOrderType] = useState('market');
    const [limitPrice, setLimitPrice] = useState('');

    const handleSubmit = (side) => {
        axios.post('/api/place_order', {
            symbol: `${symbol}/USDT`,
            side: side,
            type: orderType,
            amount: parseFloat(amount),
            price: parseFloat(limitPrice)
        }).catch(alert);
    };

    return (
        <Box display="flex" gap={1}>
            <TextField
                size="small"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
            />
            <Select
                size="small"
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
            >
                <MenuItem value="market">Market</MenuItem>
                <MenuItem value="limit">Limit</MenuItem>
            </Select>
            {orderType === 'limit' && (
                <TextField
                    size="small"
                    type="number"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    placeholder="Price"
                />
            )}
            <Button variant="contained" color="success" onClick={() => handleSubmit('buy')}>
                Buy
            </Button>
            <Button variant="contained" color="error" onClick={() => handleSubmit('sell')}>
                Sell
            </Button>
        </Box>
    );
=======
import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Select, MenuItem, Box } from '@mui/material';

export default function OrderForm({ symbol }) {
    const [amount, setAmount] = useState('');
    const [orderType, setOrderType] = useState('market');
    const [limitPrice, setLimitPrice] = useState('');

    const handleSubmit = (side) => {
        axios.post('/api/place_order', {
            symbol: `${symbol}/USDT`,
            side: side,
            type: orderType,
            amount: parseFloat(amount),
            price: parseFloat(limitPrice)
        }).catch(alert);
    };

    return (
        <Box display="flex" gap={1}>
            <TextField
                size="small"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
            />
            <Select
                size="small"
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
            >
                <MenuItem value="market">Market</MenuItem>
                <MenuItem value="limit">Limit</MenuItem>
            </Select>
            {orderType === 'limit' && (
                <TextField
                    size="small"
                    type="number"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    placeholder="Price"
                />
            )}
            <Button variant="contained" color="success" onClick={() => handleSubmit('buy')}>
                Buy
            </Button>
            <Button variant="contained" color="error" onClick={() => handleSubmit('sell')}>
                Sell
            </Button>
        </Box>
    );
>>>>>>> b599aa4371431de9ca4e937d9a077375f81f08b2
}