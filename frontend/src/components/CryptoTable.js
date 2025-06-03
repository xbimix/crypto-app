import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import OrderForm from './OrderForm';
import Link from '@mui/material/Link';


export default function CryptoTable() {
    const [cryptos, setCryptos] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            axios.get('/api/cryptos')
                .then(res => setCryptos(res.data))
                .catch(console.error);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Coin</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cryptos.map((crypto) => (
                        <TableRow key={crypto.symbol}>
                            <TableCell>
                                <Link>
                                    <Link href={`/crypto/${crypto.symbol}`}>{crypto.symbol}</Link>
                                </Link>
                            </TableCell>
                            <TableCell>${crypto.price?.toFixed(4)}</TableCell>
                            <TableCell>
                                <OrderForm symbol={crypto.symbol} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}