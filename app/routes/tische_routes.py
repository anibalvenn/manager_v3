from flask import Blueprint, request, jsonify
from app import db
from app.models.player_model import Player_Model
from app.models.series_model import Series_Model
from app.models.series_player_model import Series_Players_Model
from app.models.tische_model import Tische_Model

# Create a Blueprint for tische routes
tische_bp = Blueprint('tische_bp', __name__)

@tische_bp.route('/build_edited_tische', methods=['POST'])
def build_edited_tische():
    try:
        request_data = request.get_json()

        # Extract variables from request_data
        championship_id = request_data.get('championship_id')
        series_id = request_data.get('series_id')
        series_name = request_data.get('series_name')
        tisch_data = request_data.get('tisch_data')

 # Insert tische into the database
        for tisch_index, player_ids in tisch_data.items():
            tisch_name = f"{series_name}_{tisch_index}"
            pos_a = player_ids[0] if len(player_ids) > 0 else None
            pos_b = player_ids[1] if len(player_ids) > 1 else None
            pos_c = player_ids[2] if len(player_ids) > 2 else None
            pos_d = player_ids[3] if len(player_ids) > 3 else -1

            Tische_Model.insert_tisch(series_id, tisch_name, pos_a, pos_b, pos_c, pos_d)

        return jsonify({'success': True, 'message': 'Tische built successfully'})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 400

   

        # Return True if selected_series_id belongs to championship_id, otherwise False
def init_routes(app):
    app.register_blueprint(tische_bp)
