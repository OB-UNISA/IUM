from flask import Flask, render_template
from waitress import serve
from paste.translogger import TransLogger

app = Flask('')


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/test')
def test():
    return render_template('test.html')


def run():
    format_logger = '[%(time)s] %(status)s %(REQUEST_METHOD)s %(REQUEST_URI)s'
    serve(TransLogger(app, format=format_logger),
          host='0.0.0.0',
          port=8080,
          url_scheme='https',
          ident=None)


if __name__ == '__main__':
    run()
