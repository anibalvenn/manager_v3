from app import db

class Team_Members_Model(db.Model):
    __tablename__ = 'team_members'
    TeamID = db.Column(db.Integer, db.ForeignKey('teams.TeamID'), primary_key=True)
    PlayerID = db.Column(db.Integer, db.ForeignKey('players.PlayerID'), primary_key=True)
