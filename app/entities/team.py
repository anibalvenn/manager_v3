class Team:
    def __init__(self, team_name, championship_id):
        self.team_name = team_name
        self.championship_id = championship_id
        self.teamID = None  # Initially set to None

    def __repr__(self):
        return f"Team(team_name='{self.team_name}', championship_id='{self.championship_id}')"

    def set_teamID(self, teamID):
        self.teamID = teamID
