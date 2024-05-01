from app.models import Championship_Player_Model, Player_Model, Championship_Model

def get_players_for_championship(championship_id):
    # Query all players
    all_players = Player_Model.query.all()

    # Query players registered for the given championship
    registered_players_from_selection = Championship_Player_Model.select_championship_players_by_championship_id(championship_id=championship_id)

    # Extract PlayerIDs of registered players for the championship
    registered_player_ids = [player.PlayerID for player in registered_players_from_selection]

    # Split players into two groups: registered and unregistered
    unregistered_players = []
    registered_players = []
    for player_id in registered_player_ids:
        player =Player_Model.select_player(player_id=player_id)
        registered_players.append(player)

    for player in all_players:
        if player.PlayerID not in registered_player_ids:
            unregistered_players.append(player)
    return registered_players, unregistered_players

def get_championship_name(championship_id):
    championship= Championship_Model.get_championship_name(championship_id)

    return championship