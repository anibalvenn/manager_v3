from app import db
from datetime import date

class Player_Model(db.Model):
    __tablename__ = 'players'
    PlayerID = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    sex = db.Column(db.Text, nullable=False)
    birthdate = db.Column(db.Date, nullable=False)  # Ensuring the use of db.Date for birthdate

    @classmethod
    def insert_player(cls, name, sex, birthdate):
        """Inserts a new player into the database."""
        # Assuming birthdate is passed as a datetime.date object or similar format that db.Date can handle
        new_player = cls(name=name, sex=sex, birthdate=birthdate)
        db.session.add(new_player)
        db.session.commit()
        return new_player

    @classmethod
    def update_player(cls, player_id, name=None, sex=None, birthdate=None):
        """Updates an existing player's information."""
        player = cls.query.get(player_id)
        if player:
            if name is not None:
                player.name = name
            if sex is not None:
                player.sex = sex
            if birthdate is not None:
                # Ensure that birthdate is in the correct format
                player.birthdate = birthdate
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
    def select_player(cls, player_id=None, name=None, sex=None, birthdate=None):
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

        if conditions:
            return query.filter(*conditions).all()
        else:
            return query.all()  # Returns all players if no specific filter is provided
