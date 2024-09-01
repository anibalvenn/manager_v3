from app.models.championship_player_model import Championship_Player_Model
from app.models.series_player_model import Series_Players_Model


def get_player_ids_for_championship(championship_id):

    # Query players registered for the given championship
    registered_players_from_selection = Championship_Player_Model.select_championship_players_by_championship_id(championship_id=championship_id)

    # Extract PlayerIDs of registered players for the championship
    registered_player_ids = [player.PlayerID for player in registered_players_from_selection]
    return registered_player_ids

def set_initial_values_to_players_into_series(championship_id, series):
    # Extract series ID from the series object
    series_id = series.SeriesID

    # Get player IDs for the given championship
    playerIDsArray = get_player_ids_for_championship(championship_id)

    # Insert each player into the Series_Players_Model with TotalPoints set to 0
    for player_id in playerIDsArray:
        Series_Players_Model.insert_series_player_record(series_id=series_id, player_id=player_id, total_points=0,lost_games=0)
