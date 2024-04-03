from app import db

class Series_Model(db.Model):
    __tablename__ = 'series'
    SeriesID = db.Column(db.Integer, primary_key=True)
    ChampionshipID = db.Column(db.Integer, db.ForeignKey('championships.ChampionshipID'))
    series_name = db.Column(db.Text, nullable=False)

    @classmethod
    def insert_series(cls, championship_id, series_name):
        """Inserts a new series into the database."""
        new_series = cls(ChampionshipID=championship_id, series_name=series_name)
        db.session.add(new_series)
        db.session.commit()
        return new_series

    @classmethod
    def update_series(cls, series_id, championship_id=None, series_name=None):
        """Updates an existing series' information."""
        series = cls.query.get(series_id)
        if series:
            if championship_id is not None:
                series.ChampionshipID = championship_id
            if series_name is not None:
                series.series_name = series_name
            db.session.commit()
            return series
        return None

    @classmethod
    def delete_series(cls, series_id):
        """Deletes a series from the database."""
        series = cls.query.get(series_id)
        if series:
            db.session.delete(series)
            db.session.commit()
            return True
        return False

    @classmethod
    def select_series(cls, series_id=None, championship_id=None, series_name=None):
        """Selects series based on given parameters."""
        query = cls.query

        # Filter by SeriesID if provided
        if series_id:
            return query.get(series_id)

        # Apply filters based on ChampionshipID and series_name if provided
        if championship_id:
            query = query.filter_by(ChampionshipID=championship_id)
        if series_name:
            query = query.filter_by(series_name=series_name)

        # If specific filters are provided, fetch all that match; otherwise, fetch all series
        return query.all() if championship_id or series_name else []
