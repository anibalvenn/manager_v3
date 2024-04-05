from datetime import datetime
from flask import Blueprint, request, jsonify
from app import db
from app.models import Player_Model

# Create a Blueprint for player routes
player_bp = Blueprint('player_bp', __name__)

# Define routes for player management
@player_bp.route('/add_player', methods=['POST'])
def add_player():
    data = request.json

    # Extract data from the request
    player_name = data.get('playerName')
    player_birth_str = data.get('playerBirth')  # Get date string from request
    player_birth = datetime.strptime(player_birth_str, '%Y-%m-%d').date()  # Convert to Python date object
    player_sex = data.get('playerSex')
    player_country = data.get('playerCountry')

    # Create a new player object
    new_player = Player_Model(name=player_name, birthdate=player_birth, sex=player_sex, country=player_country)

    # Add the new player to the database session
    db.session.add(new_player)
    db.session.commit()

    return jsonify({'message': 'Player added successfully'}), 201

# Add more routes for player management as needed

def init_routes(app):
    app.register_blueprint(player_bp)
