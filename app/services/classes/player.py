class Player:
    def __init__(self, name, sex, birthDate, country, player_id):
        self.name = name
        self.sex = sex
        self.birthDate = birthDate
        self.country = country
        self.playerID = player_id
        self.total_points = 0
        self.series_points = {}
        self.tables = []
        self.total_won_games = 0
        self.total_lost_games = 0
        self.due_money = 0
        self.row = 0
        self.team_member = None
        self.table_position = None
        self.current_rank = None
        self.playerCampionshipId = None

    def get_total_points(self):
        return self.total_points

    def get_current_rank(self):
        return self.current_rank

    def get_player_tables(self):
        return self.tables