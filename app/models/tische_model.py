from app import db

class Tische_Model(db.Model):  # German for table, consider using Table if naming in English
    __tablename__ = 'tische'
    TischID = db.Column(db.Integer, primary_key=True)
    SeriesID = db.Column(db.Integer, db.ForeignKey('series.SeriesID'))
    table_name = db.Column(db.Text, nullable=False)

