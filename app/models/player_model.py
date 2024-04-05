from app import db
from datetime import date

class Player_Model(db.Model):
    __tablename__ = 'players'
    PlayerID = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    sex = db.Column(db.Text, nullable=False)
    birthdate = db.Column(db.Date, nullable=False)
    country = db.Column(db.Text, nullable=False)  # Adding country field

    @classmethod
    def insert_player(cls, name, sex, birthdate, country):
        """Inserts a new player into the database."""
        new_player = cls(name=name, sex=sex, birthdate=birthdate, country=country)
        db.session.add(new_player)
        db.session.commit()
        return new_player

    @classmethod
    def update_player(cls, player_id, name=None, sex=None, birthdate=None, country=None):
        """Updates an existing player's information."""
        player = cls.query.get(player_id)
        if player:
            if name is not None:
                player.name = name
            if sex is not None:
                player.sex = sex
            if birthdate is not None:
                player.birthdate = birthdate
            if country is not None:
                player.country = country
            db.session.commit()
            return player
        return None

    @classmethod
    def delete_player(cls, player_id):
        """Deletes a player from the database."""
        player = cls.query.get(player_id)
        if player:
            db.session.delete(player)
            db.session.commit()
            return True
        return False

    @classmethod
    def select_player(cls, player_id=None, name=None, sex=None, birthdate=None, country=None):
        """Selects players based on given parameters."""
        query = cls.query

        # Building the query based on provided parameters
        if player_id:
            return query.get(player_id)

        conditions = []
        if name:
            conditions.append(cls.name == name)
        if sex:
            conditions.append(cls.sex == sex)
        if birthdate:
            conditions.append(cls.birthdate == birthdate)
        if country:
            conditions.append(cls.country == country)

        if conditions:
            return query.filter(*conditions).all()
        else:
            return query.all()  # Returns all players if no specific filter is provided
