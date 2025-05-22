<<<<<<< HEAD
from flask import Flask, jsonify, request
from flask_cors import CORS
import ccxt
import threading
import time
import numpy as np
from dotenv import load_dotenv
import os

from data_analysis import calculate_support_resistance, detect_wave_pattern, calculate_fib_levels

app = Flask(__name__)
CORS(app)

# Initialize Binance
load_dotenv()
binance = ccxt.binance({
    'apiKey': os.getenv('BINANCE_API_KEY'),
    'secret': os.getenv('BINANCE_SECRET_KEY'),
    'enableRateLimit': True
})

# Global variables
current_prices = {}
open_orders = {}
CRYPTO_LIST = [ 'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'XRP/USDT',
            'ADA/USDT', 'DOGE/USDT', 'DOT/USDT', 'SHIB/USDT', 'MATIC/USDT',
            'AVAX/USDT', 'LTC/USDT', 'UNI/USDT', 'LINK/USDT', 'ATOM/USDT',
            'XLM/USDT', 'ALGO/USDT', 'FIL/USDT', 'VET/USDT', 'AXS/USDT',
            'THETA/USDT', 'XTZ/USDT', 'SAND/USDT', 'MANA/USDT', 'GALA/USDT']  # Add more pairs




# Price updater thread
def update_prices():
    while True:
        try:
            markets = binance.fetch_tickers()
            for symbol in CRYPTO_LIST:
                current_prices[symbol] = {
                    'price': markets[symbol]['last'],
                    'change': markets[symbol]['percentage'],
                    'high': markets[symbol]['high'],
                    'low': markets[symbol]['low']
                }
            time.sleep(5)
        except Exception as e:
            print(f"Price update error: {e}")

price_thread = threading.Thread(target=update_prices)
price_thread.daemon = True
price_thread.start()





# Routes
@app.route('/api/cryptos')
def get_cryptos():
    return jsonify([{
        'symbol': k.replace('/USDT', ''),
        'price': v['price'],
        'change': v['change']
    } for k, v in current_prices.items()])

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

#@app.route('/api/best_opportunities')
#def best_opportunities():
    opportunities = []
    for symbol, data in current_prices.items():
        if data['change'] < -5:  # 5% price drop
            opportunities.append({
                'symbol': symbol.replace('/USDT', ''),
                'price': data['price'],
                'change': data['change']
            })
    return jsonify(opportunities[:25])

def best_opportunities():
    opportunities = []
    for symbol in CRYPTO_LIST:
        closes = [x[4] for x in binance.fetch_ohlcv(symbol, '15m', limit=100)]
        support, resistance = calculate_support_resistance(closes)
        
        # Trading logic
        current_price = current_prices[symbol]['price']
        if current_price < support * 1.02:  # Within 2% of support
            opportunities.append({
                'symbol': symbol,
                'price': current_price,
                'support': support,
                'target': resistance
            })
    return opportunities


@app.route('/api/analysis/<symbol>')
def get_analysis(symbol):
    ohlcv = binance.fetch_ohlcv(symbol, '15m', limit=100)
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


if __name__ == '__main__':
=======
from flask import Flask, jsonify, request
from flask_cors import CORS
import ccxt
import threading
import time
import numpy as np
from dotenv import load_dotenv
import os

from data_analysis import calculate_support_resistance, detect_wave_pattern, calculate_fib_levels

app = Flask(__name__)
CORS(app)

# Initialize Binance
load_dotenv()
binance = ccxt.binance({
    'apiKey': os.getenv('BINANCE_API_KEY'),
    'secret': os.getenv('BINANCE_SECRET_KEY'),
    'enableRateLimit': True
})

# Global variables
current_prices = {}
open_orders = {}
CRYPTO_LIST = [ 'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'XRP/USDT',
            'ADA/USDT', 'DOGE/USDT', 'DOT/USDT', 'SHIB/USDT', 'MATIC/USDT',
            'AVAX/USDT', 'LTC/USDT', 'UNI/USDT', 'LINK/USDT', 'ATOM/USDT',
            'XLM/USDT', 'ALGO/USDT', 'FIL/USDT', 'VET/USDT', 'AXS/USDT',
            'THETA/USDT', 'XTZ/USDT', 'SAND/USDT', 'MANA/USDT', 'GALA/USDT']  # Add more pairs




# Price updater thread
def update_prices():
    while True:
        try:
            markets = binance.fetch_tickers()
            for symbol in CRYPTO_LIST:
                current_prices[symbol] = {
                    'price': markets[symbol]['last'],
                    'change': markets[symbol]['percentage'],
                    'high': markets[symbol]['high'],
                    'low': markets[symbol]['low']
                }
            time.sleep(5)
        except Exception as e:
            print(f"Price update error: {e}")

price_thread = threading.Thread(target=update_prices)
price_thread.daemon = True
price_thread.start()





# Routes
@app.route('/api/cryptos')
def get_cryptos():
    return jsonify([{
        'symbol': k.replace('/USDT', ''),
        'price': v['price'],
        'change': v['change']
    } for k, v in current_prices.items()])

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

#@app.route('/api/best_opportunities')
#def best_opportunities():
    opportunities = []
    for symbol, data in current_prices.items():
        if data['change'] < -5:  # 5% price drop
            opportunities.append({
                'symbol': symbol.replace('/USDT', ''),
                'price': data['price'],
                'change': data['change']
            })
    return jsonify(opportunities[:25])

def best_opportunities():
    opportunities = []
    for symbol in CRYPTO_LIST:
        closes = [x[4] for x in binance.fetch_ohlcv(symbol, '15m', limit=100)]
        support, resistance = calculate_support_resistance(closes)
        
        # Trading logic
        current_price = current_prices[symbol]['price']
        if current_price < support * 1.02:  # Within 2% of support
            opportunities.append({
                'symbol': symbol,
                'price': current_price,
                'support': support,
                'target': resistance
            })
    return opportunities


@app.route('/api/analysis/<symbol>')
def get_analysis(symbol):
    ohlcv = binance.fetch_ohlcv(symbol, '15m', limit=100)
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


if __name__ == '__main__':
>>>>>>> b599aa4371431de9ca4e937d9a077375f81f08b2
    app.run(port=5000)