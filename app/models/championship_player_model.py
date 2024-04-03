from app import db

class Championship_Player_Model(db.Model):
    __tablename__ = 'championship_players'
    PlayerID = db.Column(db.Integer, db.ForeignKey('players.PlayerID'), primary_key=True)
    ChampionshipID = db.Column(db.Integer, db.ForeignKey('championships.ChampionshipID'), primary_key=True)

    @classmethod
    def insert_championship_player(cls, player_id, championship_id):
        new_entry = cls(PlayerID=player_id, ChampionshipID=championship_id)
        db.session.add(new_entry)
        db.session.commit()
        return new_entry


    @classmethod
    def delete_championship_player(cls, player_id, championship_id):
        entry = cls.query.filter_by(PlayerID=player_id, ChampionshipID=championship_id).first()
        if entry:
            db.session.delete(entry)
            db.session.commit()
            return True
        return False
