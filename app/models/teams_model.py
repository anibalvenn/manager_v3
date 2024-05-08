from app import db

class Teams_Model(db.Model):
    __tablename__ = 'teams'
    TeamID = db.Column(db.Integer, primary_key=True)
    ChampionshipID = db.Column(db.Integer, db.ForeignKey('championships.ChampionshipID'))
    team_name = db.Column(db.Text, nullable=False)

    @classmethod
    def insert_team(cls, championship_id, team_name):
        """Inserts a new team into the database."""
        new_team = cls(ChampionshipID=championship_id, team_name=team_name)
        db.session.add(new_team)
        db.session.commit()
        return new_team

    @classmethod
    def update_team(cls, team_id, championship_id=None, team_name=None):
        """Updates an existing team's information."""
        team = cls.query.get(team_id)
        if team:
            if championship_id is not None:
                team.ChampionshipID = championship_id
            if team_name is not None:
                team.team_name = team_name
            db.session.commit()
            return team
        return None

    @classmethod
    def delete_team(cls, team_id):
        """Deletes a team from the database."""
        team = cls.query.get(team_id)
        if team:
            db.session.delete(team)
            db.session.commit()
            return True
        return False

    @classmethod
    def select_team(cls, team_id=None, championship_id=None):
        """Selects teams based on team ID or championship ID."""
        if team_id:
            return cls.query.get(team_id)
        elif championship_id:
            return cls.query.filter_by(ChampionshipID=championship_id).all()
        else:
            return cls.query.all()  # Return all teams if no specific filter is provided
