from app.models import Championship_Player_Model, Player_Model,  Team_Members_Model, Teams_Model

def get_team_players_by_championship(championship_id, team_id):
    team_players = []

    # Query players registered for the given championship
    registered_players_from_selection = Championship_Player_Model.select_championship_players_by_championship_id(championship_id=championship_id)

    # Extract PlayerIDs of registered players for the championship
    registered_player_ids = [player.PlayerID for player in registered_players_from_selection]

    # Split players into two groups: registered and unregistered
    other_players = [Player_Model.select_player(player_id=player_id) for player_id in registered_player_ids]

    if team_id == 0:
        return team_players, other_players
    else:
        team_players_ids = Team_Members_Model.get_player_ids_by_team_id(team_id=team_id)
        print('team players ids', team_players_ids)
        
        # Create a new list of other players without the team players
        other_players = [player for player in other_players if player.PlayerID not in team_players_ids]
        
        # Retrieve team players
        team_players = [Player_Model.select_player(player_id=str(player_id)) for player_id in team_players_ids]

    return team_players, other_players

def get_team_name(team_id):
    if team_id==0:
        return ''
    else:
        team = Teams_Model.select_team(team_id=team_id)
        return team.team_name
