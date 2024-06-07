from flask import render_template
from app.models.championship_model import Championship_Model
from app.models.series_model import Series_Model
from app.services import championship_players_service, series_players_service, team_players_service

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
        
                # Iterate over registered_players and print PlayerID for each player
        # for player in registered_players:
        #     print(player.PlayerID)
        return render_template('championship_players.html', championship_name=championship_name, registered_players=registered_players, 
                               unregistered_players=unregistered_players, championship_id=championship_id)
    
    @app.route('/edit_team_players/<int:championship_id>/<int:team_id>')
    def show_team_players(championship_id, team_id):
        team_name = team_players_service.get_team_name(team_id)
        print(team_name)
        team_players, other_players = team_players_service.get_team_players_by_championship(championship_id=championship_id,team_id=team_id)

        return render_template('edit_team_players.html', team_name=team_name,team_id=team_id, team_players=team_players,
                               other_players=other_players, championship_id=championship_id)
  
    @app.route('/edit_serie_tische/<int:championship_id>/<int:serie_id>')
    def show_series_players(championship_id, serie_id):
        championship= Championship_Model().select_championship(championship_id=championship_id)
        registered_players = series_players_service.get_players_for_series(championship_id)
        series=Series_Model().select_series(series_id=serie_id)
        return render_template('edit_serie_tische.html', 
                               registered_players=registered_players, 
                               series=series,
                               championship=championship)
    
    @app.route('/simple_serie_results/<int:championship_id>/<int:serie_id>')
    def show_series_simple_results(championship_id, serie_id):
        championship= Championship_Model().select_championship(championship_id=championship_id)
        series=Series_Model().select_series(series_id=serie_id)
        registered_players = series_players_service.get_players_for_simple_series_results(
            serie_id=serie_id,championship_id=championship_id)
        return render_template('simple_serie_results.html', 
                               registered_players=registered_players, 
                               series=series,
                               championship=championship)
