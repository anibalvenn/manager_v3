from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config

# Initialize the SQLAlchemy instance at the module level
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize the database with the Flask app
    db.init_app(app)

    # Import models so that they are registered with SQLAlchemy
    from . import models

    # Configure the static URL path and folder
    app.static_url_path = '/static'
    app.static_folder = 'static'

    # Initialize routes
    from .routes import init_routes
    init_routes(app)

    # Print the tables loaded by SQLAlchemy
    with app.app_context():
        print("Tables loaded by SQLAlchemy:", db.metadata.tables.keys())

    return app
