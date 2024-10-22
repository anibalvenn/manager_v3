from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_login import login_required
from app import db
from app.models import Series_Model
from app.models.championship_model import Championship_Model
from app.models.series_player_model import Series_Players_Model
from app.models.tische_model import Tische_Model
from app.models.user_model import User_Model
from app.services.random_3er_series_service import create_3er_random_rounds, get_player_ids_for_championship
from app.services.random_4er_series_service import create_4er_random_rounds
from app.services.utils import set_initial_values_to_players_into_series
from werkzeug.security import generate_password_hash, check_password_hash


# Create a Blueprint for series routes
series_bp = Blueprint('series_bp', __name__)

# Define routes for series management
@series_bp.route('/build_all_random_series', methods=['POST'])
@login_required
def build_all_random_series():
    data = request.json

    # Extract data from the request
    random_series_amount = data.get('randomSeriesAmount')
    players_per_tisch_amount = data.get('playersPerRandomTischAmount')  
    current_campionship_ID = data.get('currentChampionshipID')
    current_championship_name = data.get('currentChampionshipName')
    current_championship_acronym = data.get('currentChampionshipAcronym')

    if players_per_tisch_amount==4 or players_per_tisch_amount=='4':
        create_4er_random_rounds(random_series_amount=random_series_amount,                             
                                 current_championship_ID=current_campionship_ID,                             
                                 current_championship_acronym=current_championship_acronym)
        
    if players_per_tisch_amount==3 or players_per_tisch_amount=='3':
        create_3er_random_rounds(random_series_amount=random_series_amount,                             
                                 current_championship_ID=current_campionship_ID,                             
                                 current_championship_acronym=current_championship_acronym)

    # Create a new series object



    return jsonify({'message': 'series added successfully'}), 201

# Define routes for series management
@series_bp.route('/add_ranked_series', methods=['POST'])
@login_required
def add_ranked_series():
    data = request.json

    # Extract data from the request
    ranked_series_amount = int(data.get('rankedSeriesAmount'))
    players_per_ranked_tisch_amount = data.get('playersPerRankedTischAmount')  
    current_campionship_ID = data.get('currentChampionshipID')
    current_championship_name = data.get('currentChampionshipName')
    current_championship_acronym = data.get('currentChampionshipAcronym')
    seek_4er_tische = players_per_ranked_tisch_amount == 4 or players_per_ranked_tisch_amount == '4'
    for i in range(ranked_series_amount):
        championship_serien = Series_Model.select_series(championship_id=current_campionship_ID)
        length_existing_serien = len(championship_serien)
        series_name=current_championship_acronym+'_S#'+str(length_existing_serien+1)
        series=Series_Model.insert_series(championship_id=current_campionship_ID,
                                  series_name=series_name,
                                   is_random=False,
                                    seek_4er_tische= seek_4er_tische)
        
        set_initial_values_to_players_into_series(championship_id=current_campionship_ID,series=series)

    return jsonify({'message': 'series added successfully'}), 201

@series_bp.route('/get_serien/<int:championship_id>', methods=['GET'])
@login_required
def get_serien(championship_id):
    serien = Series_Model.select_series(championship_id=championship_id)
    serien_data = [{'serieID': serie.SeriesID, 'serieName': serie.series_name,
                    'isRandomSerie': serie.is_random, 'seek_4er_tische': serie.seek_4er_tische} 
                    for serie in serien]
    return jsonify(serien_data)

# @series_bp.route('/delete_serie/<int:serie_id>', methods=['DELETE'])
# @login_required
# def delete_serie(serie_id):
#     # Wrap operations in a transaction
#     try:
#         # Delete the serie itself
#         serie = Series_Model.query.get(serie_id)
#         if not serie:
#             return jsonify({'message': 'Serie not found'}), 404

#         # Delete all entries in series_players and tische associated with the series ID
#         Series_Players_Model.delete_series_records_by_series_id(serie_id)
#         Tische_Model.delete_tische_by_series_id(serie_id)

#         # Now delete the serie itself
#         db.session.delete(serie)

#         # Commit all deletions
#         db.session.commit()
#         return jsonify({'message': f'Serie {str(serie.series_name)} and associated records removed successfully'}), 200

#     except Exception as e:
#         # Rollback transaction if any error occurs
#         db.session.rollback()
#         return jsonify({'message': f'Error deleting serie: {str(e)}'}), 500

@series_bp.route('/delete_series', methods=['POST'])
@login_required
def delete_series():
    # Get the JSON data from the request body
    data = request.get_json()

    # Extract password and series_id from the JSON body
    password = data.get('password')
    series_id = data.get('series_id')
    print(password, series_id)

    if not series_id or not password:
        return jsonify({'message': 'Series ID and password are required'}), 400

    # Fetch the series based on the given series ID
    series = Series_Model.query.get(series_id)
    
    if not series:
        return jsonify({'message': 'Series not found'}), 404

    # Fetch the championship the series belongs to
    championship = Championship_Model.query.get(series.ChampionshipID)

    if not championship:
        return jsonify({'message': 'Championship not found'}), 404

    # Fetch the user who owns the championship (creator)
    championship_creator = User_Model.query.get(championship.user_id)

    if not championship_creator:
        return jsonify({'message': 'Championship creator not found'}), 404

    # Check if the provided password matches the championship creator's password
    if check_password_hash(championship_creator.password, password):
        # Delete related records from series_players and tische
        Series_Players_Model.delete_series_records_by_series_id(series_id)
        Tische_Model.delete_tische_by_series_id(series_id)

        # Now delete the series itself
        db.session.delete(series)

        # Commit all deletions
        try:
            db.session.commit()
            return jsonify({'success': True, 'message': f'Series {series.series_name} deleted successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': f'Error during deletion: {str(e)}'}), 500
    else:
        # If the password is incorrect
        return jsonify({'message': 'Invalid password or unauthorized action'}), 403

def init_routes(app):
    app.register_blueprint(series_bp)
