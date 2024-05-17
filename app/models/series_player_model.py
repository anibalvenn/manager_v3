from app import db

class Series_Players_Model(db.Model):
    __tablename__ = 'series_players'
    SeriesID = db.Column(db.Integer, db.ForeignKey('series.SeriesID'), primary_key=True)
    PlayerID = db.Column(db.Integer, db.ForeignKey('players.PlayerID'), primary_key=True)
    WonGames = db.Column(db.Integer, nullable=True)  # Now nullable
    LostGames = db.Column(db.Integer, nullable=True)  # Now nullable
    TablePoints = db.Column(db.Integer, nullable=True)  # Now nullable
    TotalPoints = db.Column(db.Integer, nullable=False)  # This remains non-nullable

    @classmethod
    def insert_series_player_record(cls, series_id, player_id, won_games=None, lost_games=None, table_points=None, total_points=None):
        """Inserts a new series player record into the database."""
        new_record = cls(SeriesID=series_id, PlayerID=player_id,
                         WonGames=won_games, LostGames=lost_games,
                         TablePoints=table_points, TotalPoints=total_points)
        db.session.add(new_record)
        db.session.commit()
        return new_record

    @classmethod
    def update_series_player_record(cls, series_id, player_id, won_games=None, lost_games=None, table_points=None, total_points=None):
        """Updates an existing series player record."""
        record = cls.query.filter_by(SeriesID=series_id, PlayerID=player_id).first()
        if record:
            if won_games is not None:
                record.WonGames = won_games
            if lost_games is not None:
                record.LostGames = lost_games
            if table_points is not None:
                record.TablePoints = table_points
            if total_points is not None:
                record.TotalPoints = total_points
            db.session.commit()
            return record
        return None

    @classmethod
    def delete_series_player_record(cls, series_id, player_id):
        """Deletes a series player record from the database."""
        record = cls.query.filter_by(SeriesID=series_id, PlayerID=player_id).first()
        if record:
            db.session.delete(record)
            db.session.commit()
            return True
        return False

    @classmethod
    def select_series_player_records(cls, series_id=None, player_id=None, min_won_games=None, min_lost_games=None, min_table_points=None, min_total_points=None):
        """Selects series player records based on given parameters."""
        query = cls.query

        if series_id:
            query = query.filter_by(SeriesID=series_id)
        if player_id:
            query = query.filter_by(PlayerID=player_id)
        if min_won_games is not None:
            query = query.filter(cls.WonGames >= min_won_games)
        if min_lost_games is not None:
            query = query.filter(cls.LostGames >= min_lost_games)
        if min_table_points is not None:
            query = query.filter(cls.TablePoints >= min_table_points)
        if min_total_points is not None:
            query = query.filter(cls.TotalPoints >= min_total_points)

        return query.all()
