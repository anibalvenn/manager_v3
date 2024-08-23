from app import db
from datetime import date
from sqlalchemy import desc
from flask_login import current_user


class Championship_Model(db.Model):
    __tablename__ = 'championships'
    ChampionshipID = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    acronym = db.Column(db.Text, nullable=False)
    creation_date = db.Column(db.Date, nullable=False, default=date.today)  # Adding creation_date field
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Foreign key to the User table


    @classmethod
    def select_user_championships(cls,):
        return cls.query.filter_by(user_id=current_user.id).all()
    
    @classmethod
    def user_owns_championship(cls, championship_id, user_id):
        return cls.query.filter_by(ChampionshipID=championship_id, user_id=user_id).first() is not None


    @classmethod
    def insert_championship(cls, name, acronym, creation_date=date.today()):
        """Inserts a new championship into the database."""
        # Include the current user's ID in the new championship record
        new_championship = cls(name=name, acronym=acronym, creation_date=creation_date, user_id=current_user.id)
        db.session.add(new_championship)
        db.session.commit()
        return new_championship

    @classmethod
    def update_championship(cls, championship_id, name=None, acronym=None, creation_date=None):
        """Updates an existing championship's information."""
        championship = cls.query.filter_by(ChampionshipID=championship_id).first()
        if championship:
            if name:
                championship.name = name
            if acronym:
                championship.acronym = acronym
            if creation_date:
                championship.creation_date = creation_date
            db.session.commit()
            return championship
        return None

    @classmethod
    def delete_championship(cls, championship_id):
        """Deletes a championship from the database."""
        championship = cls.query.filter_by(ChampionshipID=championship_id).first()
        if championship:
            db.session.delete(championship)
            db.session.commit()
            return True
        return False
    
    @classmethod
    def select_championship(cls, championship_id=None, name=None, acronym=None):
        """Selects championships based on given parameters."""
        query = cls.query.order_by(desc(cls.ChampionshipID))  # Order by ChampionshipID descending

        if championship_id:
            return query.filter_by(ChampionshipID=championship_id).first()

        if name:
            championships = query.filter_by(name=name).all()
            if championships:
                return championships

        if acronym:
            championships = query.filter_by(acronym=acronym).all()
            if championships:
                return championships

        return query.all()  # Returns all championships if no specific filter is provided

    @classmethod
    def get_championship_name(cls,championship_id):
        championship = Championship_Model.query.filter_by(ChampionshipID=championship_id).first()
        if championship:
            return championship.name
        else:
            return None

