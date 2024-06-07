from app.models import Championship_Player_Model, Player_Model, Championship_Model
from app import db

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
