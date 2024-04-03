from flask import render_template

# routes/view_routes.py
def init_routes(app):
    @app.route('/')
    def home():
        return render_template('championships.html')

    @app.route('/championships.html')
    def championships():
        return render_template('championships.html')

    @app.route('/series.html')
    def series():
        return render_template('series.html')

    @app.route('/tische.html')
    def tische():
        return render_template('tische.html')

    @app.route('/players.html')
    def players():
        return render_template('players.html')

    @app.route('/teams.html')
    def teams():
        return render_template('teams.html')

    @app.route('/results.html')
    def results():
        return render_template('results.html')
