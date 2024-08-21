from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from config import Config

# Initialize the SQLAlchemy instance at the module level
db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize the database with the Flask app
    db.init_app(app)

    # Initialize Flask-Login
    login_manager.init_app(app)
    
    # Set the login view for redirecting unauthorized users
    login_manager.login_view = 'auth.login'  # Notice the 'auth.' prefix since it's in the auth blueprint
    login_manager.login_message_category = "info"  # Optional: Category for the flashed message when redirecting

    # Import and register blueprints (after db.init_app to avoid circular imports)
    from app.routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp)

    # Configure the static URL path and folder
    app.static_url_path = '/static'
    app.static_folder = 'static'

    # Initialize routes
    from app.routes import init_routes
    init_routes(app)

    from app.models.user_model import User_Model
    # User loader function for Flask-Login
    @login_manager.user_loader
    def load_user(user_id):
        return User_Model.select_user(int(user_id))

    # Print the tables loaded by SQLAlchemy (with app context)
    with app.app_context():
        print("SQLALCHEMY_DATABASE_URI:", app.config['SQLALCHEMY_DATABASE_URI'])
        print("Tables loaded by SQLAlchemy:", db.metadata.tables.keys())

    return app
