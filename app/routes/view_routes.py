from flask import render_template
from app.models.championship_model import Championship_Model
from app.models.championship_player_model import Championship_Player_Model
from app.models.player_model import Player_Model
from app.models.series_model import Series_Model
from app.models.series_player_model import Series_Players_Model
from app.models.teams_model import Teams_Model
from app.models.tische_model import Tische_Model
from app.services import championship_players_service, series_players_service, team_players_service,tische_players_service


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

    @app.route('/print.html')
    def print():
        return render_template('print.html')
    @app.route('/i_o.html')
    def i_o():
        return render_template('i_o.html')
        
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
        if team_id == 0:
            team_name = "New Team"  # Placeholder for new team creation
            team_players = []
            team_players, other_players = team_players_service.get_team_players_by_championship(championship_id=championship_id, team_id=team_id)
        else:
            team = Teams_Model.select_team(team_id=team_id)
            team_name=team.team_name
            team_players, other_players = team_players_service.get_team_players_by_championship(championship_id=championship_id, team_id=team_id)

        return render_template('edit_team_players.html', 
                            team_name=team_name,
                            team_id=team_id, 
                            team_players=team_players,
                            other_players=other_players, 
                            championship_id=championship_id)

  
    @app.route('/edit_serie_tische/<int:championship_id>/<int:serie_id>', defaults={'rank_series_id': None})
    @app.route('/edit_serie_tische/<int:championship_id>/<int:serie_id>/<int:rank_series_id>')
    def show_series_players(championship_id, serie_id, rank_series_id):
        championship = Championship_Model().select_championship(championship_id=championship_id)
        series = Series_Model().select_series(series_id=serie_id)

        registered_players = []

        if rank_series_id is not None:
            if rank_series_id == 0:
                # Fetch the players ordered by overall total points across all series
                players_ordered_by_points = series_players_service.get_overall_results(championship_id)
                for player, total_points in players_ordered_by_points:
                    print(f"PlayerID: {player.PlayerID}")
                    print(f"Name: {player.name}")
                    print(f"TotalPoints: {total_points}")
                    
                    player_info = Player_Model.query.filter_by(PlayerID=player.PlayerID).first()
                    if player_info:
                        # Get the player group from Championship_Player_Model
                        player_group_info = Championship_Player_Model.select_championship_player(player_id=player.PlayerID, championship_id=championship_id)
                        player_group = player_group_info.player_group if player_group_info else None
                        
                        registered_players.append({
                            'name': player_info.name,
                            'PlayerID': player.PlayerID,
                            'TotalPoints': total_points,
                            'player_group': player_group
                        })
            else:
                # Fetch the players ordered by total points for the specified series
                players_ordered_by_points = Series_Players_Model.select_series_players_ordered_by_total_points(rank_series_id)
                for player in players_ordered_by_points:
                    player_info = Player_Model.query.filter_by(PlayerID=player.PlayerID).first()
                    if player_info:
                        # Get the player group from Championship_Player_Model
                        player_group_info = Championship_Player_Model.select_championship_player(player_id=player.PlayerID, championship_id=championship_id)
                        player_group = player_group_info.player_group if player_group_info else None
                        
                        registered_players.append({
                            'name': player_info.name,
                            'PlayerID': player.PlayerID,
                            'TotalPoints': player.TotalPoints,
                            'player_group': player_group
                        })
        else:
            # Fetch the tische for the series
            tische = Tische_Model.query.filter_by(SeriesID=serie_id).all()
            if tische:
                for tisch in tische:
                    positions = ['PosA', 'PosB', 'PosC', 'PosD']
                    for pos in positions:
                        player_id = getattr(tisch, pos)
                        if player_id and player_id > 0:
                            player_info = Player_Model.query.filter_by(PlayerID=player_id).first()
                            if player_info:
                                player_group_info = Championship_Player_Model.select_championship_player(player_id=player_id, championship_id=championship_id)
                                player_group = player_group_info.player_group if player_group_info else None
                                registered_players.append({
                                    'name': player_info.name,
                                    'PlayerID': player_id,
                                    'TotalPoints': 0,  # or whatever value you need for the TotalPoints field
                                    'player_group': player_group
                                })
            else:
                # Fetch the players for the championship
                registered_players = series_players_service.get_players_for_series(championship_id)

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
    
    @app.route('/edit_tisch_results/<int:tisch_id>')
    def edit_tisch_results(tisch_id):
        tisch = Tische_Model().select_tisch(tisch_id=tisch_id)
        serie=Series_Model().select_series(series_id=tisch.SeriesID)
        tisch_players = tische_players_service.select_tisch_players(tisch=tisch)
        return render_template('edit_tisch_results.html', 
                            tisch_players=tisch_players, 
                            serie=serie,
                            tisch=tisch)
