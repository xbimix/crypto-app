# backend/data_analysis.py
import numpy as np
import pandas as pd

def calculate_support_resistance(prices, window=14):
    """
    Calculate dynamic support/resistance using recent price action
    Args:
        prices (array): Array of closing prices
        window (int): Lookback period in candles
    Returns:
        (support, resistance)
    """
    if len(prices) < window or np.std(prices) < 0.001:  # Handle flat markets
        return np.min(prices), np.max(prices)
    
    recent_prices = prices[-window:]
    support = np.mean(recent_prices) - 2 * np.std(recent_prices)
    resistance = np.mean(recent_prices) + 2 * np.std(recent_prices)
    return round(support, 4), round(resistance, 4)

def detect_wave_pattern(prices, sensitivity=3):
    """
    Identify Elliott Wave patterns using peak/trough detection
    Returns:
        dict: {'peaks': [indexes], 'troughs': [indexes]}
    """
    peaks = []
    troughs = []
    
    for i in range(sensitivity, len(prices)-sensitivity):
        window = prices[i-sensitivity:i+sensitivity+1]
        if prices[i] == np.max(window):
            peaks.append(i)
        elif prices[i] == np.min(window):
            troughs.append(i)
    
    return {'peaks': peaks, 'troughs': troughs}

def calculate_moving_averages(ohlcv, windows=[20, 50, 200]):
    """
    Calculate multiple moving averages from OHLCV data
    Args:
        ohlcv (DataFrame): Pandas DF with ['close'] column
        windows (list): MA periods to calculate
    Returns:
        DataFrame: Original DF with MA columns added
    """
    df = pd.DataFrame(ohlcv, columns=['timestamp','open','high','low','close','volume'])
    for window in windows:
        df[f'ma{window}'] = df['close'].rolling(window).mean()
    return df

def calculate_rsi(prices, period=14):
    """
    Relative Strength Index (RSI) calculation
    """
    delta = pd.Series(prices).diff()
    gain = delta.where(delta > 0, 0).rolling(period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(period).mean()
    # Avoid division by zero
    rs = gain / (loss + 1e-9)  # Add small epsilon
    return 100 - (100 / (1 + rs))


#calculate the highest volitile crypto and the measure the % in drops and rises and how frequent they occur...


def auto_rebuy_price(current_price, symbol=None, binance=None, risk_percent=2, rebuy_count=3):
    """
    Calculate staggered rebuy prices with 3-month average price check
    """
    # If symbol and binance are provided, check the 3-month average
    if symbol and binance:
        try:
            # Fetch 90 days of daily data (approximately 3 months)
            ohlcv = binance.fetch_ohlcv(f"{symbol}/USDT", '1d', limit=90)
            if ohlcv:
                closes = [x[4] for x in ohlcv]
                avg_3month = sum(closes) / len(closes)
                
                # If current price is higher than half of the 3-month average
                if current_price > 0.5 * avg_3month:
                    return None  # Signal that user decision is required
        except Exception as e:
            print(f"Error checking 3-month average for {symbol}: {e}")
            # Proceed with calculation if there's an error fetching data
    
    # Proceed with normal rebuy price calculation
    rebuy_prices = []
    price = current_price
    for _ in range(rebuy_count):
        price *= (1 - risk_percent/100)
        rebuy_prices.append(round(price, 2))
    return rebuy_prices

def calculate_fib_levels(high, low):
    """
    Fibonacci retracement levels
    Returns dict with key levels
    """
    diff = high - low
    return {
        '0.0': high,
        '0.236': high - diff * 0.236,
        '0.382': high - diff * 0.382,
        '0.5': high - diff * 0.5,
        '0.618': high - diff * 0.618,
        '1.0': low
    }