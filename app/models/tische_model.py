from app import db

class Tische_Model(db.Model):
    __tablename__ = 'tische'
    TischID = db.Column(db.Integer, primary_key=True)
    SeriesID = db.Column(db.Integer, db.ForeignKey('series.SeriesID'))
    tisch_name = db.Column(db.Text, nullable=False)
    PosA = db.Column(db.Integer, db.ForeignKey('players.PlayerID'), nullable=True)
    PosB = db.Column(db.Integer, db.ForeignKey('players.PlayerID'), nullable=True)
    PosC = db.Column(db.Integer, db.ForeignKey('players.PlayerID'), nullable=True)
    PosD = db.Column(db.Integer, db.ForeignKey('players.PlayerID'), nullable=True)

    @classmethod
    def insert_tisch(cls, series_id, tisch_name, pos_a=None, pos_b=None, pos_c=None, pos_d=None):
        """Inserts a new tisch (table) with optional player positions into the database."""
        new_tisch = cls(SeriesID=series_id, tisch_name=tisch_name, PosA=pos_a, PosB=pos_b, PosC=pos_c, PosD=pos_d)
        db.session.add(new_tisch)
        db.session.commit()
        return new_tisch

    @classmethod
    def update_tisch(cls, tisch_id, series_id=None, tisch_name=None, pos_a=None, pos_b=None, pos_c=None, pos_d=None):
        """Updates an existing tisch's information including player positions."""
        tisch = cls.query.get(tisch_id)
        if tisch:
            if series_id is not None:
                tisch.SeriesID = series_id
            if tisch_name is not None:
                tisch.tisch_name = tisch_name
            if pos_a is not None:
                tisch.PosA = pos_a
            if pos_b is not None:
                tisch.PosB = pos_b
            if pos_c is not None:
                tisch.PosC = pos_c
            if pos_d is not None:
                tisch.PosD = pos_d
            db.session.commit()
            return tisch
        return None

    @classmethod
    def delete_tisch(cls, tisch_id):
        """Deletes a tisch from the database."""
        tisch = cls.query.get(tisch_id)
        if tisch:
            db.session.delete(tisch)
            db.session.commit()
            return True
        return False

    @classmethod
    def select_tisch(cls, tisch_id=None, series_id=None):
        """Selects tische based on tisch ID or series ID."""
        query = cls.query
        if tisch_id:
            return query.get(tisch_id)
        if series_id:
            return query.filter_by(SeriesID=series_id).all()
        return query.all()  # Return all tische if no specific filter is provided
