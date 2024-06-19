from app.models import Championship_Player_Model, Player_Model, Championship_Model
from app import db
from app.models.series_player_model import Series_Players_Model

   

def select_tisch_players(tisch):
    players = []

    if tisch.PosA and tisch.PosA != -1:
        player_details = get_tisch_player_series_data(tisch.PosA, tisch.SeriesID)
        if player_details:
            players.append(player_details)

    if tisch.PosB and tisch.PosB != -1:
        player_details = get_tisch_player_series_data(tisch.PosB, tisch.SeriesID)
        if player_details:
            players.append(player_details)

    if tisch.PosC and tisch.PosC != -1:
        player_details = get_tisch_player_series_data(tisch.PosC, tisch.SeriesID)
        if player_details:
            players.append(player_details)

    if tisch.PosD and tisch.PosD != -1:
        player_details = get_tisch_player_series_data(tisch.PosD, tisch.SeriesID)
        if player_details:
            players.append(player_details)

    return players

def get_tisch_player_series_data(player_id, series_id):
    player = Player_Model.select_player(player_id=player_id)
    if player:
        series_record = Series_Players_Model.select_series_player_records(player_id=player_id, series_id=series_id)
        if series_record:
            record = series_record[0]  # Assuming there's only one record per player and series
            return {
                'name': player.name,
                'id': player.PlayerID,
                'won_games': record.WonGames if record.WonGames is not None else 0,
                'lost_games': record.LostGames if record.LostGames is not None else 0,
                'tisch_points': record.TablePoints if record.TablePoints is not None else 0,
                'total_points': record.TotalPoints if record.TotalPoints is not None else 0
            }
        else:
            # If no series record is found, return default values
            return {
                'name': player.name,
                'id': player.PlayerID,
                'won_games': 0,
                'lost_games': 0,
                'tisch_points': 0,
                'total_points': 0
            }
    return None
