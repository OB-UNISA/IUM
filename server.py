from flask import Flask, render_template, jsonify, request
from waitress import serve
from paste.translogger import TransLogger
from replit import db

import secrets

app = Flask('', static_folder='assets')

@app.errorhandler(404)
@app.errorhandler(403)
@app.errorhandler(410)
@app.errorhandler(500)
def error_handler(error):
    return render_template('error.html')

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


@app.post('/segnalazioni/save')
def save_segnalazione():
    req = request.json
    print(req)
    segnalazione = {
        'specie': req['specie'],
        'dataRitrovamento': req['dataRitrovamento'],
        'luogoRitrovamento': req['luogoRitrovamento'],
        'numeroEsemplari': req['numeroEsemplari'],
        'stato': 'aperta',
    }
    segnalazioni = db['forze']
    segnalazione['id'] = str(int(segnalazioni[-1]['id']) + 1)
    segnalazioni.append(segnalazione)
    db['forze'] = segnalazioni

    return jsonify({'id': int(segnalazione['id'])})


@app.post('/segnalazioni/get')
def get_segnalazione():
    segnalazioni = db['forze']
    codice = request.json['id']
    for segnalazione in segnalazioni:
        if segnalazione['id'] == codice:
            return segnalazione['stato']

    return 'Codice non valido'


@app.route('/endpoints')
def endpoints():
    return render_template('endpoints.html')


@app.get('/api/get')
def api_key():
    return secrets.token_hex(16)


@app.get('/forze/get')
def forze_get():
    segnalazioni = db['forze']
    return jsonify([dict(segnalazione) for segnalazione in segnalazioni])


@app.get('/forze/getSegnalazioneDetails')
def forze_getSegnalazioneDetails():
    id = int(request.args.get('id'))
    segnalazioni = db['forze']
    for segnalazione in segnalazioni.value:
        mySegnalazione = segnalazione.value
        if int(mySegnalazione['id']) == id:
            return jsonify(dict(segnalazione))
    return "ok"


@app.get('/forze/changeSegnalazioneStatus')
def forze_changeSegnalazioneStatus():
    id = int(request.args.get('id'))
    stato = request.args.get('stato')
    segnalazioni = db['forze']
    for segnalazione in segnalazioni.value:
        mySegnalazione = segnalazione.value
        if int(mySegnalazione['id']) == id:
            mySegnalazione['stato'] = stato
            break
    db['forze'] = segnalazioni
    return render_template('forze.html')


@app.get('/animali/get')
def animali_get():
    animali = db['animali']
    return jsonify([dict(animale) for animale in animali])


@app.get('/animali/getAnimaleDetails')
def animali_getAnimaleDetails():
    id = int(request.args.get('id'))
    animali = db['animali']
    for animale in animali.value:
        myAnimale = animale.value
        if int(myAnimale['id']) == id:
            return jsonify(dict(animale))
    return "ok"


@app.get('/animali/getNumber')
def animali_getNumber():
    animali = db['animali']
    return str(len(animali))


@app.get('/animali/deleteAnimal')
def animali_deleteAnimal():
    id = int(request.args.get('id'))
    animali = db['animali']
    for animale in animali.value:
        myAnimale = animale.value
        if int(myAnimale['id']) == id:
            animali.remove(animale)
            break
    db['animali'] = animali
    return render_template('centro.html')


@app.post('/animali/setAnimal')
def animali_set():
    req = request.json
    print("Req: ", req)
    animale = {
        'id': str(len(db['animali']) + 1),
        'specie': req['specie'],
        'eta': req['eta'],
        'dataRitrovamento': req['dataRitrovamento'],
        'luogoRitrovamento': req['luogoRitrovamento'],
        'autoctono': req['autoctono'],
        'recuperabile': req['recuperabile'],
        'caratteristicheFisiche': req['caratteristicheFisiche'],
        'malattie': req['malattie'],
        'ferite': req['ferite']
    }
    animali = db['animali']
    animali.append(animale)
    db['animali'] = animali
    return "ok"


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
