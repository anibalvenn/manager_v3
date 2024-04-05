from datetime import datetime
from flask import Blueprint, request, jsonify
from app import db
from app.models import Championship_Model

# Create a Blueprint for championship routes
championship_bp = Blueprint('championship_bp', __name__)

# Define routes for championship management
@championship_bp.route('/add_championship', methods=['POST'])
def add_championship():
    data = request.json

    # Extract data from the request
    championship_name = data.get('championshipName')
    championship_creation_str = data.get('championshipStart')  # Get date string from request
    championship_cretion_date = datetime.strptime(championship_creation_str, '%Y-%m-%d').date()  # Convert to Python date object
    championship_acronym = data.get('championshipAcronym')

    # Create a new championship object
    new_championship = Championship_Model(name=championship_name,acronym=championship_acronym,creation_date=championship_cretion_date )

    # Add the new championship to the database session
    db.session.add(new_championship)
    db.session.commit()

    return jsonify({'message': 'championship added successfully'}), 201

# Add more routes for championship management as needed

def init_routes(app):
    app.register_blueprint(championship_bp)
