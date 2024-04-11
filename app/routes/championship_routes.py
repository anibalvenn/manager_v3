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
@championship_bp.route('/get_championships', methods=['GET'])
def get_championships():
    championships = Championship_Model.select_championship()
    championship_data = [{'championshipID': champ.ChampionshipID, 'name': champ.name, 'start_date': champ.creation_date.strftime('%Y-%m-%d'), 'acronym': champ.acronym} for champ in championships]
    return jsonify(championship_data)


@championship_bp.route('/delete_championship/<int:championship_id>', methods=['DELETE'])
def delete_championship(championship_id):
    print(championship_id)
    # Attempt to delete the championship with the provided ID from the database
    if Championship_Model.delete_championship(championship_id):
        return jsonify({'message': 'Championship removed successfully'}), 200
    else:
        return jsonify({'message': 'Failed to remove championship'}), 404

@championship_bp.route('/update_championship/<int:championship_id>', methods=['POST'])
def update_championship(championship_id):
    data = request.json

    # Extract data from the request
    championship_name = data.get('name')
    championship_acronym = data.get('acronym')
    championship_creation_date_string = data.get('creation_date')
    championship_creation_date = datetime.strptime(championship_creation_date_string, "%Y-%m-%d")


    # Update the championship in the database
    updated_championship = Championship_Model.update_championship(championship_id, name=championship_name, acronym=championship_acronym, creation_date=championship_creation_date)

    if updated_championship:
        return jsonify({'message': 'Championship updated successfully'}), 200
    else:
        return jsonify({'error': 'Failed to update championship'}), 400

def init_routes(app):
    app.register_blueprint(championship_bp)
