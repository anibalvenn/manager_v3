from app import db

class Player_Tische_Model(db.Model):
    __tablename__ = 'player_tische'
    PlayerID = db.Column(db.Integer, db.ForeignKey('players.PlayerID'), primary_key=True)
    TischID = db.Column(db.Integer, db.ForeignKey('tische.TischID'), primary_key=True)
    TischPoints = db.Column(db.Integer, nullable=False)
    TotalPoints = db.Column(db.Integer, nullable=False)
    WonGames = db.Column(db.Integer, nullable=False)
    LostGames = db.Column(db.Integer, nullable=False)

    @classmethod
    def insert_player_table_record(cls, player_id, tisch_id, tisch_points, total_points, won_games, lost_games):
        """Inserts a new player table record into the database."""
        new_record = cls(PlayerID=player_id, TischID=tisch_id, TischPoints=tisch_points,
                         TotalPoints=total_points, WonGames=won_games, LostGames=lost_games)
        db.session.add(new_record)
        db.session.commit()
        return new_record

    @classmethod
    def update_player_table_record(cls, player_id, tisch_id, tisch_points=None, total_points=None, won_games=None, lost_games=None):
        """Updates an existing player table record."""
        record = cls.query.filter_by(PlayerID=player_id, TischID=tisch_id).first()
        if record:
            if tisch_points is not None:
                record.TischPoints = tisch_points
            if total_points is not None:
                record.TotalPoints = total_points
            if won_games is not None:
                record.WonGames = won_games
            if lost_games is not None:
                record.LostGames = lost_games
            db.session.commit()
            return record
        return None

    @classmethod
    def delete_player_table_record(cls, player_id, tisch_id):
        """Deletes a player table record from the database."""
        record = cls.query.filter_by(PlayerID=player_id, TischID=tisch_id).first()
        if record:
            db.session.delete(record)
            db.session.commit()
            return True
        return False

    @classmethod
    def select_player_table_records(cls, player_id=None, tisch_id=None, min_tisch_points=None, min_total_points=None, min_won_games=None, min_lost_games=None):
        """Selects player table records based on given parameters."""
        query = cls.query

        if player_id:
            query = query.filter_by(PlayerID=player_id)
        if tisch_id:
            query = query.filter_by(TischID=tisch_id)
        if min_tisch_points is not None:
            query = query.filter(cls.TischPoints >= min_tisch_points)
        if min_total_points is not None:
            query = query.filter(cls.TotalPoints >= min_total_points)
        if min_won_games is not None:
            query = query.filter(cls.WonGames >= min_won_games)
        if min_lost_games is not None:
            query = query.filter(cls.LostGames >= min_lost_games)

        return query.all()
