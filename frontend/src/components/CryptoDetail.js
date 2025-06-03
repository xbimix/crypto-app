import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  CircularProgress,
  Divider
} from '@mui/material';

import PriceChart from './PriceChart';
import OrderForm from './OrderForm';


// Format data from API response
const formatChartData = (ohlcv) => {
  return ohlcv.map(item => ({
    timestamp: item.timestamp,
    price: item.close
  }));
};

function CryptoDetail() {
  const { symbol } = useParams(); 
  console.log({symbol})
  const [cryptoData, setCryptoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ohlcData, setOhlcData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [priceRes, statsRes, historicalRes] = await Promise.all([
          axios.get(`/api/cryptos/${symbol}`),
          axios.get(`/api/cryptos/${symbol}/stats`),
          axios.get(`/api/historical/${symbol}`)
        ]);
        
        setCryptoData({
          price: priceRes.data,
          stats: statsRes.data
        });
        setOhlcData(historicalRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
        setLoading(false);
      }
    };
    // const fetchHistoricalData = async () => {
    //   try {
    //     const response = await axios.get(`/api/historical/${symbol}`);
    //     setOhlcData(response.data);
    //   } catch (error) {
    //     console.error("Error fetching historical data:", error);
    //   }
    // };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [symbol]);
  console.log({cryptoData})
  console.log({ohlcData})

  return (
    <Box sx={{ p: 3 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : cryptoData ? (
        <>

       {ohlcData.length > 0 && (
  <Box sx={{ mb: 4, height: 400 }}>
    <PriceChart data={formatChartData(ohlcData)} />
  </Box>
)}


        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" gutterBottom>
            {symbol}/USDT
          </Typography>
          <Typography variant="h4" color="primary">
            ${cryptoData.price?.toLocaleString(undefined, { maximumFractionDigits: 8 })}
          </Typography>
        </Box>

          <PriceChart symbol={symbol} />

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Trading Panel
                </Typography>
                <OrderForm symbol={symbol} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  24h Statistics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography>High:</Typography>
                    <Typography variant="body2">
                      ${cryptoData.stats.high?.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Low:</Typography>
                    <Typography variant="body2">
                      ${cryptoData.stats.low?.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Volume:</Typography>
                    <Typography variant="body2">
                      {cryptoData.stats.volume?.toLocaleString()} USDT
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Change:</Typography>
                    <Typography 
                      variant="body2"
                      sx={{ 
                        color: cryptoData.stats.change >= 0 ? 
                          'success.main' : 'error.main' 
                      }}
                    >
                      {cryptoData.stats.change?.toFixed(2)}%
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </>
      ) : (
        <Typography variant="body1">Crypto data not available</Typography>
      )}
    </Box>
  );
}

export default CryptoDetail;