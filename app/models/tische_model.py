from app import db

class Tische_Model(db.Model):
    __tablename__ = 'tische'
    TischID = db.Column(db.Integer, primary_key=True)
    SeriesID = db.Column(db.Integer, db.ForeignKey('series.SeriesID'))
    table_name = db.Column(db.Text, nullable=False)

    @classmethod
    def insert_tisch(cls, series_id, table_name):
        """Inserts a new tisch (table) into the database."""
        new_tisch = cls(SeriesID=series_id, table_name=table_name)
        db.session.add(new_tisch)
        db.session.commit()
        return new_tisch

    @classmethod
    def update_tisch(cls, tisch_id, series_id=None, table_name=None):
        """Updates an existing tisch's information."""
        tisch = cls.query.get(tisch_id)
        if tisch:
            if series_id is not None:
                tisch.SeriesID = series_id
            if table_name is not None:
                tisch.table_name = table_name
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
        if tisch_id:
            return cls.query.get(tisch_id)
        elif series_id:
            return cls.query.filter_by(SeriesID=series_id).all()
        else:
            return cls.query.all()  # Return all tische if no specific filter is provided
