# Initialize order storage
open_orders = {}

from flask import Flask, jsonify, request
from flask_cors import CORS
import ccxt
import threading
import time
import numpy as np
from dotenv import load_dotenv
import os
import math  # Added for logarithmic scaling

from data_analysis import calculate_support_resistance, detect_wave_pattern, calculate_fib_levels
from threading import Lock
current_prices_lock = Lock()

# Global setup
app = Flask(__name__)
CORS(app)
load_dotenv()

binance = ccxt.binance({
    'apiKey': os.getenv('BINANCE_API_KEY'),
    'secret': os.getenv('BINANCE_SECRET_KEY'),
    'enableRateLimit': True,
    'options': {'defaultType': 'spot'}  # Add this line
})

# Use base symbols only
CRYPTO_LIST = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'DOT', 'SHIB', 'MATIC', 
               'AVAX', 'LTC', 'UNI', 'LINK', 'ATOM', 'XLM', 'ALGO', 'FIL', 'VET', 'AXS',
               'THETA', 'XTZ', 'SAND', 'MANA', 'GALA',
               'ETC', 'TRX', 'NEAR', 'XMR', 'KLAY', 'FLOW', 'APE', 'AAVE', 'QNT', 'EOS',
    'CHZ', 'MKR', 'GRT', 'SNX', 'CRV', 'COMP', 'BAT', 'ENJ', 'ZEC', 'DASH',
    'NEO', 'KSM', 'ZIL', 'ONE', 'IOTA', 'WAVES', 'RUNE', 'ROSE', 'KAVA', 'HNT',
    'GNO', 'ICX', 'OMG', 'ANKR', 'SC', 'STORJ', 'ONT', 'CELO', 'RVN', 'AR',
    'YFI', '1INCH', 'BAL', 'UMA', 'REN', 'COTI', 'OGN', 'REP', 'NMR', 'OXT'
               
               ]

current_prices = {symbol: None for symbol in CRYPTO_LIST}  # Initialize

def update_prices():
    while True:
        try:
            markets = binance.fetch_tickers()
            for symbol in CRYPTO_LIST:
                full_symbol = f"{symbol}/USDT"
                if full_symbol in markets:
                    ticker = markets[full_symbol]
                    current_prices[symbol] = {
                        'price': ticker['last'],
                        'change': ticker['percentage'],
                        'high': ticker['high'],
                        'low': ticker['low']
                    }
            time.sleep(5)
        except Exception as e:
            print(f"Price update error: {e}")
            time.sleep(10)  # Longer delay on error

# Start thread
price_thread = threading.Thread(target=update_prices)
price_thread.daemon = True
price_thread.start()

# Routes
@app.route('/api/cryptos')
def get_cryptos():
    return jsonify([{
        'symbol': symbol,
        'price': data['price'],
        'change': data['change']
    } for symbol, data in current_prices.items() if data is not None])

@app.route('/api/place_order', methods=['POST'])
def place_order():
    data = request.json
    
    try:
        order = binance.create_order(
            symbol=data['symbol'],
            type=data['type'],
            side=data['side'],
            amount=data['amount'],
            price=data.get('price')
            
        )
        open_orders[order['id']] = order
        return jsonify({'success': True, 'order': order})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})


def best_opportunities():
    bOpportunities = []
    for symbol in CRYPTO_LIST:
        try:
            # Check if we have current price data
            if symbol not in current_prices or current_prices[symbol] is None:
                continue
                
            # Get OHLCV data
            ohlcv = binance.fetch_ohlcv(f"{symbol}/USDT", '15m', limit=100)
            if len(ohlcv) < 100:
                continue
                
            closes = [x[4] for x in ohlcv]
            support, resistance = calculate_support_resistance(closes)
            
            # Skip if support couldn't be calculated
            if support is None or support <= 0:
                continue
                
            current_price = current_prices[symbol].get('price')
            if current_price is None:
                continue
                
            # Trading logic - only execute if all values are valid
            if current_price < support * 1.02:  # Within 2% of support
                bOpportunities.append({
                    'symbol': symbol,
                    'price': current_price,
                    'support': support,
                    'target': resistance
                })
        except Exception as e:
            print(f"Error processing {symbol} in best_opportunities: {e}")
            continue
            
    return bOpportunities [:5]

# Add in app.py
@app.route('/api/best_opportunities')
def get_best_opportunities():
   
    return jsonify(best_opportunities())


@app.route('/api/analysis/<symbol>')
def get_analysis(symbol):
    ohlcv = binance.fetch_ohlcv(f"{symbol}/USDT", '15m', limit=100)
    closes = [x[4] for x in ohlcv]
    
    return jsonify({
        'support_resistance': calculate_support_resistance(closes),
        'waves': detect_wave_pattern(closes),
        'fib_levels': calculate_fib_levels(max(closes), min(closes))
    })

@app.route('/api/historical/<symbol>')
def get_historical(symbol):
    days = int(request.args.get('timeframe', 7))
    interval_map = {
        1: ('5m', 288),    # 1 day (5m * 288 = 24h)
        7: ('15m', 672),   # 1 week (15m * 672 = 7d)
        30: ('1h', 720),   # 1 month (1h * 720 = 30d)
        365: ('1d', 365)   # 1 year
    }
    interval, limit = interval_map.get(days, ('15m', 100))
    
    ohlcv = binance.fetch_ohlcv(f"{symbol}/USDT", interval, limit=limit)
    return jsonify([{
        'timestamp': x[0],
        'open': x[1],
        'high': x[2],
        'low': x[3],
        'close': x[4],
        'volume': x[5]
    } for x in ohlcv])


@app.route('/api/cryptos/<symbol>')
def get_crypto_price(symbol):
    ticker = binance.fetch_ticker(f"{symbol}/USDT")
    return jsonify({
        'price': ticker['last'],
        'symbol': symbol
    })

@app.route('/api/cryptos/<symbol>/stats')
def get_crypto_stats(symbol):
    ohlcv = binance.fetch_ohlcv(f"{symbol}/USDT", '1d', limit=2)
    return jsonify({
        'high': ohlcv[-1][2],
        'low': ohlcv[-1][3],
        'volume': ohlcv[-1][5],
        'change': (ohlcv[-1][4]/ohlcv[-2][4] - 1) * 100
    })

@app.route('/api/orders')
def get_orders():
    return jsonify(list(open_orders.values()))

@app.route('/api/orders/<order_id>', methods=['DELETE'])
def cancel_order(order_id):
    try:
        binance.cancel_order(order_id)
        open_orders.pop(order_id, None)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# ======== ROBUST OPPORTUNITY SCORING ========
def trend_score(symbol):
    try:
        ohlcv = binance.fetch_ohlcv(symbol, '1d', limit=200)
        if len(ohlcv) < 200:
            return 0.0
        closes = [x[4] for x in ohlcv]
        sma50 = sum(closes[-50:]) / 50
        sma200 = sum(closes) / 200
        return (sma50 - sma200) / sma200 if sma200 != 0 else 0.0
    except Exception as e:
        print(f"Trend score error for {symbol}: {e}")
        return 0.0

def mean_reversion_score(symbol):
    try:
        ohlcv = binance.fetch_ohlcv(symbol, '4h', limit=100)
        if len(ohlcv) < 100:
            return 0.0
            
        closes = [x[4] for x in ohlcv]
        current = closes[-1]
        mean = sum(closes) / len(closes)
        
        # Calculate standard deviation manually
        squared_diffs = sum((x - mean) ** 2 for x in closes)
        std = (squared_diffs / len(closes)) ** 0.5
        
        if std < 0.0001:  # Avoid division by near-zero
            return 0.0
            
        return (mean - current) / (2 * std)
    except Exception as e:
        print(f"Reversion score error for {symbol}: {e}")
        return 0.0

def liquidity_score(symbol):
    try:
        ticker = binance.fetch_ticker(symbol)
        if ticker['ask'] is None or ticker['ask'] == 0:
            return 0.0
            
        spread = (ticker['ask'] - ticker['bid']) / ticker['ask']
        volume = ticker['quoteVolume'] or 0
        return volume * (1 - spread)
    except Exception as e:
        print(f"Liquidity score error for {symbol}: {e}")
        return 0.0

def momentum_score(symbol):
    try:
        ohlcv = binance.fetch_ohlcv(symbol, '1h', limit=168)
        if len(ohlcv) < 2:
            return 0.0
            
        closes = [x[4] for x in ohlcv]
        returns = [closes[i] / closes[i-1] - 1 for i in range(1, len(closes))]
        
        if not returns:
            return 0.0
            
        avg_return = sum(returns) / len(returns)
        
        # Calculate standard deviation manually
        squared_diffs = sum((r - avg_return) ** 2 for r in returns)
        std_dev = (squared_diffs / len(returns)) ** 0.5
        
        if std_dev < 0.0001:  # Avoid division by near-zero
            return 0.0
            
        return avg_return / std_dev
    except Exception as e:
        print(f"Momentum score error for {symbol}: {e}")
        return 0.0

# Fully implemented opportunity scoring
def calculate_opportunity_score(trend, reversion, momentum, liquidity):
    """Calculate combined opportunity score using weighted factors"""
    # Normalize weights (sum to 1)
    weights = {
        'trend': 0.4,
        'reversion': 0.3,
        'momentum': 0.2,
        'liquidity': 0.1
    }
    
    # Apply weights to each factor
    try:
        score = (
            weights['trend'] * trend +
            weights['reversion'] * reversion +
            weights['momentum'] * momentum +
            weights['liquidity'] * (liquidity / 1000000)  # Scale down liquidity
        )
        
        # Apply logarithmic scaling to prevent large liquidity values from dominating
        # and ensure score is always positive
        return math.log1p(max(score, 0) + 1 ) # Scale to readable range
    except Exception as e:
        print(f"Scoring error: {e}")
        return 0

@app.route('/api/top-opportunities')
def top_opportunities():
    try:
        opportunities = []
        
        # Process only symbols from our crypto list
        for symbol in CRYPTO_LIST:
            full_symbol = f"{symbol}/USDT"
            try:
                # Calculate individual scores
                trend = trend_score(full_symbol)
                reversion = mean_reversion_score(full_symbol)
                momentum_val = momentum_score(full_symbol)
                liquidity_val = liquidity_score(full_symbol)
                
                # Skip if any score is invalid
                if None in (trend, reversion, momentum_val, liquidity_val):
                    continue
                    
                # Calculate combined opportunity score
                score = calculate_opportunity_score(trend, reversion, momentum_val, liquidity_val) * 10
                
                # Get current price with thread safety
                with current_prices_lock:
                    price_data = current_prices.get(symbol)
                    current_price = price_data['price'] if price_data and 'price' in price_data else None
                
                opportunities.append({
                    'symbol': symbol,
                    'score': round(score, 2),
                    'price': current_price,
                    'trend': round(trend, 4),
                    'reversion': round(reversion, 4),
                    'liquidity': round(liquidity_val),
                    'momentum': round(momentum_val, 4)
                })
            except Exception as e:
                print(f"Skipping {symbol}: {str(e)}")
                continue
        
        # Sort and return top 5
        opportunities.sort(key=lambda x: x['score'], reverse=True)
        return jsonify(opportunities[:])
        
    except Exception as e:
        print(f"Top opportunities error: {e}")
        return jsonify({'error': str(e)}), 500 
       
if __name__ == '__main__':
    app.run(port=5000)