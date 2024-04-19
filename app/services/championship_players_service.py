from app.models import Championship_Player_Model, Player_Model, Championship_Model

def get_players_for_championship(championship_id):
    # Query all players
    all_players = Player_Model.query.all()

    # Query players registered for the given championship
    registered_players = Championship_Player_Model.query.filter_by(ChampionshipID=championship_id).all()

    # Extract PlayerIDs of registered players for the championship
    registered_player_ids = [player.PlayerID for player in registered_players]

    # Split players into two groups: registered and unregistered
    registered_players = []
    unregistered_players = []

    for player in all_players:
        if player.PlayerID in registered_player_ids:
            registered_players.append(player)
        else:
            unregistered_players.append(player)

    return registered_players, unregistered_players

def get_championship_name(championship_id):
    championship= Championship_Model.get_championship_name(championship_id)

    return championship