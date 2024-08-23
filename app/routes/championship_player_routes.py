from flask import Blueprint, request, jsonify, render_template
from flask_login import login_required
from app import db
from app.models import Championship_Player_Model
from app.services import championship_players_service

# Create a Blueprint for championship player routes
championship_player_bp = Blueprint('championship_player_bp', __name__)

@championship_player_bp.route('/add_player_to_championship', methods=['POST'])
@login_required
def add_player_to_championship():
    data = request.json
    player_id = data.get('playerId')
    championship_id = data.get('championshipId')
    player_group_id = data.get('playerGroupId')
    player_group_position = data.get('playerGroupPosition')

    if player_id and championship_id:
        new_entry = Championship_Player_Model.insert_championship_player(player_id, championship_id,player_group_id,player_group_position)
        if new_entry:
            return jsonify({'message': 'Player added to championship successfully'}), 201
        else:
            return jsonify({'error': 'Failed to add player to championship'}), 400
    else:
        return jsonify({'error': 'Missing required data'}), 400
    
@championship_player_bp.route('/add_players_to_championship', methods=['POST'])
@login_required
def add_players_to_championship():
    data = request.json
    players = data.get('players', [])    
    successful_entries = 0
    failed_entries = 0

    for player in players:
        player_id = player.get('playerId')
        championship_id = player.get('championshipId')
        player_group = player.get('playerGroupId')
        player_position_in_group = player.get('playerGroupPosition')        
        new_entry = Championship_Player_Model.insert_championship_player(player_id, championship_id,player_group,player_position_in_group)
        if new_entry:
            successful_entries += 1
        else:
            failed_entries += 1

    if successful_entries > 0:
        if failed_entries == 0:
            return jsonify({'message': f'All {successful_entries} players added to championship successfully'}), 201
        else:
            return jsonify({'message': f'{successful_entries} players added to championship successfully. {failed_entries} failed entries.'}), 201
    else:
        return jsonify({'message': 'No players were added to the championship'}), 200

@championship_player_bp.route('/remove_player_from_championship', methods=['DELETE'])
@login_required
def remove_player_from_championship():
    data = request.json
    player_id = data.get('playerId')
    championship_id = data.get('championshipId')

    if player_id and championship_id:
        success = Championship_Player_Model.delete_championship_player(player_id, championship_id)
        if success:
            return jsonify({'message': 'Player removed from championship successfully'}), 200
        else:
            return jsonify({'error': 'Failed to remove player from championship'}), 404
    else:
        return jsonify({'error': 'Missing required data'}), 400

@championship_player_bp.route('/get_players_by_championship/<int:championship_id>', methods=['GET'])
@login_required
def get_players_by_championship(championship_id):
    players = Championship_Player_Model.select_championship_players_by_championship_id(championship_id=championship_id)
    if players:
        player_data = [{'playerId': player.PlayerID, 'championshipId': player.ChampionshipID,'playerGroupId':player.player_group,'playerGroupPosition':player.player_position_in_group} for player in players]
        return jsonify(player_data), 200
    else:
        return jsonify({'error': 'No players found for this championship'}), 404
    
@championship_player_bp.route('/remove_all_players_from_championship', methods=['DELETE'])
@login_required
def remove_all_players_from_championship():
    data = request.json
    championship_id = data.get('championshipId')

    if not championship_id:
        return jsonify({'error': 'Missing championship ID'}), 400

    # Get all entries for the specified championship ID
    entries = Championship_Player_Model.query.filter_by(ChampionshipID=championship_id).all()

    if entries:
        # Delete each entry
        for entry in entries:
            db.session.delete(entry)
        db.session.commit()
        return jsonify({'message': 'All players removed from championship successfully'}), 200
    else:
        return jsonify({'message': 'No players found for the specified championship. No action required.'}), 200

    
def init_routes(app):
    app.register_blueprint(championship_player_bp)
