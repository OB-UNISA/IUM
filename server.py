from flask import Flask, render_template, jsonify, request
from waitress import serve
from paste.translogger import TransLogger
from replit import db

import secrets

app = Flask('', static_folder='assets')
''''
@app.errorhandler(404)
@app.errorhandler(403)
@app.errorhandler(410)
@app.errorhandler(500)
def error_handler(error):
    return render_template('error.html')
'''


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/login')
def login():
    return render_template('login.html')


@app.get('/db/get')
def db_get():
    users = db['users']
    return jsonify([dict(user) for user in users])


@app.route('/registrazione')
def registrazione():
    return render_template('registrazione.html')


@app.post('/db/set')
def db_set():
    req = request.json
    print(req)
    user = {
        'nome': req['nome'],
        'email': req['email'],
        'password': req['password'],
        'ruolo': req['ruolo']
    }
    users = db['users']
    users.append(user)

    db['users'] = users
    return "ok"


@app.route('/centro')
def centro():
    return render_template('centro.html')


@app.route('/forze')
def forzeordine():
    return render_template('forze.html')


@app.route('/segnalazioni')
def segnalazioni():
    return render_template('segnalazioni.html')


@app.route('/endpoints')
def endpoints():
    return render_template('endpoints.html')


@app.get('/api/get')
def api_key():
    return secrets.token_hex(16)


def run():
    format_logger = '[%(time)s] %(status)s %(REQUEST_METHOD)s %(REQUEST_URI)s'
    serve(TransLogger(app, format=format_logger),
          host='0.0.0.0',
          port=8080,
          url_scheme='https',
          ident=None,
          threads=6)


if __name__ == '__main__':
    run()
