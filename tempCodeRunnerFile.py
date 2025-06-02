
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import requests
from pymongo import MongoClient


app = Flask(__name__)
app.secret_key='238e91378dad8552752ecc9417ba7d0c'
users = {
    "admin": "1234",
    "user1": "pass1"
}
saved_quotes = {}

@app.route('/')
def home():
    if 'username' not in session:
        return redirect(url_for('login'))

    quote, author = fetch_category_quote()
    return render_template('index.html', username=session['username'], daily_quote=quote, author=author)


client =MongoClient("mongodb://localhost:27017/") 
db = client["quote_db"] 
quotes_collection = db["quotes"] 
users_collection = db["users"] 
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username'].strip()
        password = request.form['password'].strip()

        if username in users and users[username] == password:
            session['username'] = username
            return redirect(url_for('home'))
        else:
            error = "Invalid username or password"
            return render_template('login.html')

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

@app.route('/get-quote', methods=['GET'])
def get_quote():
    try:
        count = int(request.args.get('count', 1))
        quotes = []
        for _ in range(count):
            quote, author = fetch_category_quote()
            quotes.append({'quote': quote, 'author': author})

        return jsonify(quotes)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/save-quote', methods=['POST'])
def save_quote():
    if 'username' not in session:
        return jsonify({'status': 'unauthorized'}), 401
    data = request.get_json()
    quote = data.get('quote')
    author = data.get('author')

    if quote and author:
        quotes_collection.insert_one({
            "username": session['username'],
            "quote": quote,
            "author": author
        })
        return jsonify({'status': 'success'})
    return jsonify({'status': 'failed'}), 400

@app.route('/history')
def history():
    if 'username' not in session:
        return redirect(url_for('login'))
    user_quotes = list(quotes_collection.find({"username": session['username']}))
    quotes = [{"quote": q["quote"], "author": q["author"]} for q in user_quotes]
    return render_template('history.html', username=session['username'], quotes=quotes)

def fetch_category_quote():
    try:
        response = requests.get("https://favqs.com/api/qotd")
        data = response.json()
        return data['quote']['body'], data['quote']['author']
    except:
        return "Could not fetch quote.", "Unknown"

@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form['email']
        print(f"Password reset link sent to {email}")
        return render_template('forgot_password.html', message="Password reset link sent to your email.")
    return render_template('forgot_password.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        if password != confirm_password:
            return render_template('register.html', error="Passwords do not match")
        if username in users:
            return render_template('register.html', error="Username already exists")
        users[username] = password  
        return redirect(url_for('login'))   
    return render_template('register.html')


import os

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
