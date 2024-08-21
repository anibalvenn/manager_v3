from app import db
from sqlalchemy import desc
from flask_login import UserMixin

class User_Model(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

    @classmethod
    def insert_user(cls, username, email, password):
        """Inserts a new user into the database."""
        new_user = cls(username=username, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()
        return new_user

    @classmethod
    def update_user(cls, user_id, username=None, email=None, password=None):
        """Updates an existing user's information."""
        user = cls.query.filter_by(id=user_id).first()
        if user:
            if username:
                user.username = username
            if email:
                user.email = email
            if password:
                user.password = password
            db.session.commit()
            return user
        return None

    @classmethod
    def delete_user(cls, user_id):
        """Deletes a user from the database."""
        user = cls.query.filter_by(id=user_id).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            return True
        return False
    
    @classmethod
    def select_user(cls, user_id=None, username=None, email=None):
        """Selects users based on given parameters."""
        query = cls.query.order_by(desc(cls.id))  # Order by id descending

        if user_id:
            return query.filter_by(id=user_id).first()

        if username:
            users = query.filter_by(username=username).all()
            if users:
                return users

        if email:
            users = query.filter_by(email=email).all()
            if users:
                return users

        return query.all()  # Returns all users if no specific filter is provided

    @classmethod
    def get_username(cls, user_id):
        """Retrieves the username of a user by their id."""
        user = cls.query.filter_by(id=user_id).first()
        if user:
            return user.username
        else:
            return None
