from datetime import datetime
from flask import Blueprint, request, jsonify
from app import db
from app.models import Series_Model
from app.services.random_3er_series_service import create_3er_random_rounds
from app.services.random_4er_series_service import create_4er_random_rounds

# Create a Blueprint for series routes
series_bp = Blueprint('series_bp', __name__)

# Define routes for series management
@series_bp.route('/build_all_random_series', methods=['POST'])
def add_series():
    data = request.json

    # Extract data from the request
    random_series_amount = data.get('randomSeriesAmount')
    players_per_tisch_amount = data.get('playersPerTischAmount')  
    current_campionship_ID = data.get('currentChampionshipID')
    current_championship_name = data.get('currentChampionshipName')
    if players_per_tisch_amount==4 or players_per_tisch_amount=='4':
        create_4er_random_rounds(random_series_amount=random_series_amount,                             
                                 current_championship_ID=current_campionship_ID,                             
                                 current_championship_name=current_championship_name)
        
    if players_per_tisch_amount==3 or players_per_tisch_amount=='3':
        create_3er_random_rounds(random_series_amount=random_series_amount,                             
                                 current_championship_ID=current_campionship_ID,                             
                                 current_championship_name=current_championship_name)

    # Create a new series object



    return jsonify({'message': 'series added successfully'}), 201



def init_routes(app):
    app.register_blueprint(series_bp)
