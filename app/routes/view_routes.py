from flask import render_template
from app.services import championship_players_service

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
        
    @app.route('/championship_players/<int:championship_id>')
    def show_championship_players(championship_id):
        championship_name = championship_players_service.get_championship_name(championship_id)
        registered_players, unregistered_players = championship_players_service.get_players_for_championship(championship_id)
        return render_template('championship_players.html', championship_name=championship_name, registered_players=registered_players, 
                               unregistered_players=unregistered_players, championship_id=championship_id)
