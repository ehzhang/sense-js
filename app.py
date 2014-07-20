from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('base.html')

@app.route('/orientation')
def orientation():
    return render_template('orientation.html')

@app.route('/tilt')
def tilt():
    return render_template('tilt.html')

if __name__ == '__main__':
    app.debug = True
    app.run()
