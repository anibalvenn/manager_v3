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
@player_bp.route('/select_player', methods=['GET'])
def select_player():
    player_id = request.args.get('player_id')
    name = request.args.get('name')
    sex = request.args.get('sex')
    birthdate = request.args.get('birthdate')
    country = request.args.get('country')
    
    players = Player_Model.select_player(player_id=player_id, name=name, sex=sex, birthdate=birthdate, country=country)
    player_data = [{'PlayerID': player.PlayerID, 'name': player.name, 'sex': player.sex, 'birthdate': player.birthdate.strftime('%Y-%m-%d'), 'country': player.country} for player in players]
    
    return jsonify(player_data)

@player_bp.route('/update_player/<int:player_id>', methods=['PUT'])
def update_player(player_id):
    data = request.json
    
    name = data.get('playerName')
    sex = data.get('playerSex')
    birthdate_str = data.get('playerBirth')
    birthdate = datetime.strptime(birthdate_str, '%Y-%m-%d').date()
    country = data.get('playerCountry')
    
    updated_player = Player_Model.update_player(player_id, name=name, sex=sex, birthdate=birthdate, country=country)
    
    if updated_player:
        return jsonify({'message': 'Player updated successfully'}), 200
    else:
        return jsonify({'error': 'Player not found'}), 404

@player_bp.route('/delete_player/<int:player_id>', methods=['DELETE'])
def delete_player(player_id):
    deleted = Player_Model.delete_player(player_id)
    
    if deleted:
        return jsonify({'message': 'Player deleted successfully'}), 200
    else:
        return jsonify({'error': 'Player not found'}), 404

def init_routes(app):
    app.register_blueprint(player_bp)
