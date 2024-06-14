from flask import Blueprint, request, jsonify
from app import db
from app.models.player_model import Player_Model
from app.models.series_model import Series_Model
from app.models.series_player_model import Series_Players_Model

# Create a Blueprint for series routes
results_bp = Blueprint('results_bp', __name__)

@results_bp.route('/update_player_points', methods=['POST'])
def update_player_points():
    try:
        data = request.get_json()
        player_id = data.get('playerId')
        series_id = data.get('seriesId')
        points = data.get('points')

        # Check if a record with the same series_id and player_id exists
        existing_record = Series_Players_Model.query.filter_by(SeriesID=series_id, PlayerID=player_id).first()

        # If the record exists, delete it
        if existing_record:
            db.session.delete(existing_record)
            db.session.commit()

        # Insert the new record
        Series_Players_Model.insert_series_player_record(
            series_id=series_id,
            player_id=player_id,
            total_points=points
        )

        return jsonify(success=True)

    except Exception as e:
        db.session.rollback()
        return jsonify(success=False, error=str(e)), 500
    
@results_bp.route('/api/get_series_rank', methods=['GET'])
def get_series_rank():
    try:
        # Get the series_id from query parameters
        series_id = request.args.get('series_id')

        # Ensure series_id is provided
        if not series_id:
            return jsonify(success=False, error="series_id is required"), 400

        # Get the players ordered by total points
        players_ordered_by_points = Series_Players_Model.select_series_players_ordered_by_total_points(series_id)

        # Build the result array
        result = []
        for player in players_ordered_by_points:
            player_info = Player_Model.query.filter_by(PlayerID=player.PlayerID).first()
            if player_info:
                result.append({
                    'player_name': player_info.name,
                    'player_id': player.PlayerID,
                    'total_points': player.TotalPoints
                })

        return jsonify(success=True, data=result)

    except Exception as e:
        return jsonify(success=False, error=str(e)), 500

@results_bp.route('/api/check_series', methods=['GET'])
def check_series():
    championship_id = request.args.get('championship_id')
    selected_series_id = request.args.get('selected_series_id')


    series_belongs_to_championship = check_series_in_championship(championship_id, selected_series_id)

    return jsonify({'belongs': series_belongs_to_championship})

def check_series_in_championship(championship_id, selected_series_id):
    selected_series = Series_Model.select_series(selected_series_id)
    selected_series_champ_id = selected_series.ChampionshipID
    print('81', selected_series_champ_id, ' ',championship_id)
    return str(selected_series_champ_id) == str(championship_id)

        # Return True if selected_series_id belongs to championship_id, otherwise False
def init_routes(app):
    app.register_blueprint(results_bp)
