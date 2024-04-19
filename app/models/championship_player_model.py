from app import db

class Championship_Player_Model(db.Model):
    __tablename__ = 'championship_players'
    PlayerID = db.Column(db.Integer, db.ForeignKey('players.PlayerID'), primary_key=True)
    ChampionshipID = db.Column(db.Integer, db.ForeignKey('championships.ChampionshipID'), primary_key=True)
    player_group = db.Column(db.String, nullable=True)  # Existing column for player's group
    player_position_in_group = db.Column(db.String, nullable=True)  # Existing column for player's position in group
    player_championship_id = db.Column(db.String, nullable=True)  # New column for player's unique ID in this championship

    @classmethod
    def insert_championship_player(cls, player_id, championship_id, player_group=None, player_position_in_group=None, player_championship_id=None):
        new_entry = cls(
            PlayerID=player_id, 
            ChampionshipID=championship_id,
            player_group=player_group, 
            player_position_in_group=player_position_in_group,
            player_championship_id=player_championship_id  # Adding this field to the constructor
        )
        db.session.add(new_entry)
        db.session.commit()
        return new_entry

    @classmethod
    def update_championship_player(cls, player_id, championship_id, player_group=None, player_position_in_group=None, player_championship_id=None):
        entry = cls.query.filter_by(PlayerID=player_id, ChampionshipID=championship_id).first()
        if entry:
            if player_group is not None:
                entry.player_group = player_group
            if player_position_in_group is not None:
                entry.player_position_in_group = player_position_in_group
            if player_championship_id is not None:
                entry.player_championship_id = player_championship_id
            db.session.commit()
            return entry
        return None

    @classmethod
    def delete_championship_player(cls, player_id, championship_id):
        entry = cls.query.filter_by(PlayerID=player_id, ChampionshipID=championship_id).first()
        if entry:
            db.session.delete(entry)
            db.session.commit()
            return True
        return False

    @classmethod
    def select_championship_player(cls, player_id=None, championship_id=None):
        query = cls.query

        if player_id and championship_id:
            return query.filter_by(PlayerID=player_id, ChampionshipID=championship_id).first()
        elif player_id:
            return query.filter_by(PlayerID=player_id).all()
        elif championship_id:
            return query.filter_by(ChampionshipID=championship_id).all()
        else:
            return query.all()
