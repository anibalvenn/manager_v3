from app.models import Championship_Player_Model, Player_Model, Championship_Model
from app import db
from app.models.series_model import Series_Model
from app.models.series_player_model import Series_Players_Model
from sqlalchemy import func, desc


def get_players_for_series(championship_id):
    # Query all players with their group information for the given championship
    registered_players_with_groups = (
        db.session.query(Player_Model, Championship_Player_Model.player_group)
        .join(Championship_Player_Model, Player_Model.PlayerID == Championship_Player_Model.PlayerID)
        .filter(Championship_Player_Model.ChampionshipID == championship_id)
        .all()
    )
  
    registered_players = []
    for player, player_group in registered_players_with_groups:
        player_data = {
            'PlayerID': player.PlayerID,
            'name': player.name,
            'sex': player.sex,
            'birthdate': player.birthdate,
            'country': player.country,
            'player_group': player_group
        }
        registered_players.append(player_data)

  
    return registered_players

def get_players_for_simple_series_results(serie_id, championship_id):
    # Query players registered for the given championship
    registered_players_from_selection = Championship_Player_Model.select_championship_players_by_championship_id(championship_id=championship_id)

    # Extract PlayerIDs of registered players for the championship
    registered_player_ids = [player.PlayerID for player in registered_players_from_selection]

    # Query all players with their series information for the given series, restricted to registered players
    registered_players_with_series_data = (
        db.session.query(
            Player_Model.PlayerID,
            Player_Model.name, 
            Series_Players_Model.WonGames, 
            Series_Players_Model.LostGames, 
            Series_Players_Model.TablePoints, 
            Series_Players_Model.TotalPoints
        )
        .outerjoin(Series_Players_Model, 
                   (Player_Model.PlayerID == Series_Players_Model.PlayerID) & 
                   (Series_Players_Model.SeriesID == serie_id))
        .filter(Player_Model.PlayerID.in_(registered_player_ids))
        .all()
    )

    players_data = []
    for player_id, player_name, won_games, lost_games, table_points, total_points in registered_players_with_series_data:
        player_data = {
            'PlayerID': player_id,
            'name': player_name,
            'WonGames': won_games if won_games is not None else 0,
            'LostGames': lost_games if lost_games is not None else 0,
            'TablePoints': table_points if table_points is not None else 0,
            'TotalPoints': total_points if total_points is not None else 0
        }
        players_data.append(player_data)

    return players_data

def get_overall_results(championship_id):
    # Fetch and aggregate results across all series for the championship
    overall_results = db.session.query(
        Player_Model,
        func.sum(Series_Players_Model.TotalPoints).label('TotalPoints')
    ).join(Series_Players_Model, Series_Players_Model.PlayerID == Player_Model.PlayerID) \
    .join(Series_Model, Series_Players_Model.SeriesID == Series_Model.SeriesID) \
    .filter(Series_Model.ChampionshipID == championship_id) \
    .group_by(Player_Model.PlayerID) \
    .order_by(desc('TotalPoints')).all()

    return overall_results
