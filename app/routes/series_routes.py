from datetime import datetime
from flask import Blueprint, request, jsonify
from app import db
from app.models import Series_Model
from app.models.series_player_model import Series_Players_Model
from app.models.tische_model import Tische_Model
from app.services.random_3er_series_service import create_3er_random_rounds
from app.services.random_4er_series_service import create_4er_random_rounds

# Create a Blueprint for series routes
series_bp = Blueprint('series_bp', __name__)

# Define routes for series management
@series_bp.route('/build_all_random_series', methods=['POST'])
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
        series_name=current_championship_acronym+'_'+str(i+1)
        Series_Model.insert_series(championship_id=current_campionship_ID,
                                  series_name=series_name,
                                   is_random=False,
                                    seek_4er_tische= seek_4er_tische)

    return jsonify({'message': 'series added successfully'}), 201

@series_bp.route('/get_serien/<int:championship_id>', methods=['GET'])
def get_serien(championship_id):
    serien = Series_Model.select_series(championship_id=championship_id)
    serien_data = [{'serieID': serie.SeriesID, 'serieName': serie.series_name,
                    'isRandomSerie': serie.is_random, 'seek_4er_tische': serie.seek_4er_tische} 
                    for serie in serien]
    return jsonify(serien_data)

@series_bp.route('/delete_serie/<int:serie_id>', methods=['DELETE'])
def delete_serie(serie_id):
    # Wrap operations in a transaction
    try:
        # Delete the serie itself
        serie = Series_Model.query.get(serie_id)
        if not serie:
            return jsonify({'message': 'Serie not found'}), 404

        # Get all entries for the specified serie ID
        series_player_entries = Series_Players_Model.query.filter_by(SeriesID=serie_id).all()
        tische_entries = Tische_Model.query.filter_by(SeriesID=serie_id).all()

        if series_player_entries or tische_entries:
            # Prevent deletion if there are associated records
            return jsonify({'message': 'Cannot delete the serie because it is associated with other records. Please remove the associated records first.'}), 400

        # Delete the serie
        db.session.delete(serie)

        # Commit the deletion
        db.session.commit()
        return jsonify({'message': f'Serie {str(serie.series_name)} removed successfully'}), 200

    except Exception as e:
        # Rollback transaction if any error occurs
        db.session.rollback()
        return jsonify({'message': f'Error deleting serie: {str(e)}'}), 500

def init_routes(app):
    app.register_blueprint(series_bp)
