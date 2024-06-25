from flask import Blueprint, request, jsonify
from app import db
from app.models.player_model import Player_Model
from app.models.series_model import Series_Model
from app.models.series_player_model import Series_Players_Model
from app.models.tische_model import Tische_Model

# Create a Blueprint for tische routes
tische_bp = Blueprint('tische_bp', __name__)

@tische_bp.route('/get_serie_tische/<int:serie_id>', methods=['GET'])
def get_serie_tische(serie_id):
    tische = Tische_Model.query.filter_by(SeriesID=serie_id).all()
    
    tische_data = []
    for tisch in tische:
        tisch_info = {
            'tischID': tisch.TischID,
            'tischName': tisch.tisch_name,
            'idPosA': tisch.PosA,
            'idPosB': tisch.PosB,
            'idPosC': tisch.PosC,
            'idPosD': tisch.PosD
        }

        # Fetch player names if player IDs are valid
        tisch_info['namePosA'] = Player_Model.query.get(tisch.PosA).name if tisch.PosA and tisch.PosA > 0 else None
        tisch_info['namePosB'] = Player_Model.query.get(tisch.PosB).name if tisch.PosB and tisch.PosB > 0 else None
        tisch_info['namePosC'] = Player_Model.query.get(tisch.PosC).name if tisch.PosC and tisch.PosC > 0 else None
        tisch_info['namePosD'] = Player_Model.query.get(tisch.PosD).name if tisch.PosD and tisch.PosD > 0 else None

        tische_data.append(tisch_info)

    return jsonify(tische_data)

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
            tisch_name = f"{series_name}_T#{tisch_index}"
            pos_a = player_ids[0] if len(player_ids) > 0 else None
            pos_b = player_ids[1] if len(player_ids) > 1 else None
            pos_c = player_ids[2] if len(player_ids) > 2 else None
            pos_d = player_ids[3] if len(player_ids) > 3 else -1

            Tische_Model.insert_tisch(series_id, tisch_name, pos_a, pos_b, pos_c, pos_d)

        return jsonify({'success': True, 'message': 'Tische built successfully'})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 400

   

@tische_bp.route('/check_existing_tische', methods=['GET'])
def check_existing_tische():
    try:
        series_id = request.args.get('series_id')

        if not series_id:
            return jsonify(success=False, error="series_id is required"), 400

        existing_tische = Tische_Model.select_tisch(series_id=series_id)

        if existing_tische:
            return jsonify(success=True, exists=True)
        else:
            return jsonify(success=True, exists=False)
    except Exception as e:
        return jsonify(success=False, error=str(e)), 500


@tische_bp.route('/delete_existing_tische', methods=['DELETE'])
def delete_existing_tische():
    try:
        series_id = request.args.get('series_id')

        if not series_id:
            return jsonify(success=False, error="series_id is required"), 400

        existing_tische = Tische_Model.select_tisch(series_id=series_id)

        if existing_tische:
            for tisch in existing_tische:
                Tische_Model.delete_tisch(tisch.TischID)
            return jsonify(success=True)
        else:
            return jsonify(success=False, error="No tische found to delete"), 404
    except Exception as e:
        return jsonify(success=False, error=str(e)), 500


def init_routes(app):
    app.register_blueprint(tische_bp)

