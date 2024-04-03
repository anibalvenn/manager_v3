
from app import db

class Teams_Model(db.Model):
    __tablename__ = 'teams'
    TeamID = db.Column(db.Integer, primary_key=True)
    ChampionshipID = db.Column(db.Integer, db.ForeignKey('championships.ChampionshipID'))
    team_name = db.Column(db.Text, nullable=False)

