from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config

db = SQLAlchemy()  # Define db at the module level

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)  # Initialize db with the app

    from app import models

    # Configure the static URL path and folder
    app.static_url_path = '/static'
    app.static_folder = 'static'

    from app.routes import init_routes
    init_routes(app)

    with app.app_context():
        print("Tables loaded by SQLAlchemy:", db.metadata.tables.keys())

    return app
