import datetime
from flask import Blueprint, request, jsonify, send_file
from app import db
from app.models.championship_model import Championship_Model
from app.models.player_model import Player_Model
from app.models.series_model import Series_Model
from app.models.series_player_model import Series_Players_Model
import csv
from io import StringIO

from app.models.team_members_model import Team_Members_Model
from app.models.teams_model import Teams_Model

# Create a Blueprint for series routes
results_bp = Blueprint('results_bp', __name__)

@results_bp.route('/update_player_points', methods=['POST'])
def update_player_points():
    try:
        data = request.get_json()
        player_id = data.get('playerId')
        series_id = data.get('seriesId')
        total_points = data.get('total_points')

        # Optional parameters
        tisch_points = data.get('tisch_points')
        won_games = data.get('won_games')
        lost_games = data.get('lost_games')

        # Check if a record with the same series_id and player_id exists
        existing_record = Series_Players_Model.query.filter_by(SeriesID=series_id, PlayerID=player_id).first()

        # If the record exists, delete it
        if existing_record:
            db.session.delete(existing_record)
            db.session.commit()

        # Prepare the parameters for insertion
        insert_params = {
            'series_id': series_id,
            'player_id': player_id,
            'total_points': total_points
        }
        
        # Include optional parameters if they exist
        if tisch_points is not None:
            insert_params['table_points'] = tisch_points
        if won_games is not None:
            insert_params['won_games'] = won_games
        if lost_games is not None:
            insert_params['lost_games'] = lost_games

        # Insert the new record
        Series_Players_Model.insert_series_player_record(**insert_params)

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




@results_bp.route('/api/get_championship_rank', methods=['GET'])
def get_championship_rank():
    try:
        # Get the championship_id from query parameters
        championship_id = request.args.get('championship_id')

        # Ensure championship_id is provided
        if not championship_id:
            return jsonify(success=False, error="championship_id is required"), 400

        # Get all series for the championship
        series_list = Series_Model.select_series(championship_id=championship_id)
        
        # Sort series by SeriesID (ascending)
        series_list = sorted(series_list, key=lambda x: x.SeriesID)

        # Aggregate player points across all series
        player_points = {}
        series_ids = [series.SeriesID for series in series_list]

        for series in series_list:
            players_ordered_by_points = Series_Players_Model.select_series_players_ordered_by_total_points(series.SeriesID)

            for player in players_ordered_by_points:
                if player.PlayerID not in player_points:
                    player_info = Player_Model.query.filter_by(PlayerID=player.PlayerID).first()
                    player_points[player.PlayerID] = {
                        'player_name': player_info.name,
                        'player_id': player.PlayerID,
                        'total_points': 0,
                        'series_points': {}
                    }
                player_points[player.PlayerID]['total_points'] += player.TotalPoints
                player_points[player.PlayerID]['series_points'][series.SeriesID] = player.TotalPoints

        # Create CSV file
        csv_file = StringIO()
        csv_writer = csv.writer(csv_file)

        # Header row
        header = ['player_id', 'player_name'] + [f'series_{i}' for i in range(1, len(series_ids) + 1)] + ['total_points']
        csv_writer.writerow(header)

        # Data rows
        for player_id, data in player_points.items():
            row = [player_id, data['player_name']] + [data['series_points'].get(series_id, 0) for series_id in series_ids] + [data['total_points']]
            csv_writer.writerow(row)

        csv_file.seek(0)

        # Save the CSV file to a temporary location
        csv_filename = f"championship_{championship_id}_rank.csv"
        with open(csv_filename, "w", newline='') as f:
            f.write(csv_file.getvalue())

        # Prepare the JSON result
        result = sorted(player_points.values(), key=lambda x: x['total_points'], reverse=True)
        return jsonify(success=True, data=result)

    except Exception as e:
        return jsonify(success=False, error=str(e)), 500
    
@results_bp.route('/check_series_player_records', methods=['GET'])
def check_series_player_records():
    try:
        series_id = request.args.get('series_id')

        if not series_id:
            return jsonify(success=False, error="series_id is required"), 400

        existing_records = Series_Players_Model.select_series_player_records(series_id=series_id, min_total_points=1)

        if existing_records:
            return jsonify(success=True, exists=True)
        else:
            return jsonify(success=True, exists=False)
    except Exception as e:
        return jsonify(success=False, error=str(e)), 500
    
@results_bp.route('/api/import_series_results', methods=['POST'])
def import_series_results():
    try:
        data = request.json
        championship_id = data.get('championship_id')
        players_data = data.get('data')

        if not championship_id or not players_data:
            return jsonify(success=False, error="Invalid data"), 400

        # Loop through each series and insert data
        series_points = {player['player_id']: player['series_points'] for player in players_data}
        
        for i, series in enumerate(players_data[0]['series_points']):
            championship_serien = Series_Model.select_series(championship_id=championship_id)
            length_existing_serien = len(championship_serien)
            current_championship = Championship_Model.select_championship(championship_id=championship_id)
            current_championship_acronym = current_championship.acronym
            # cant b called series_name bcz series_name'll b used 2 the player dictionary below so its series_label
            series_label = current_championship_acronym + '_S#' + str(length_existing_serien + 1)
            series_name = series['series']
            new_series = Series_Model.insert_series(championship_id, series_name=series_label)

            for player in players_data:
                series_points = next((sp['points'] for sp in player['series_points'] if sp['series'] == series_name), None)
                if series_points is not None:
                    Series_Players_Model.insert_series_player_record(new_series.SeriesID, player['player_id'], total_points=series_points)

        return jsonify(success=True)

    except Exception as e:
        return jsonify(success=False, error=str(e)), 500


@results_bp.route('/api/import_single_series_results', methods=['POST'])
def import_single_series_results():
    try:
        data = request.json
        championship_id = data.get('championship_id')
        players_data = data.get('data')

        if not championship_id or not players_data:
            return jsonify(success=False, error="Invalid data"), 400

        # Create a new series for the championship
        championship_serien = Series_Model.select_series(championship_id=championship_id)
        length_existing_serien = len(championship_serien)
        current_championship = Championship_Model.select_championship(championship_id=championship_id)
        current_championship_acronym = current_championship.acronym
        series_name = current_championship_acronym + '_S#' + str(length_existing_serien + 1)        
        new_series = Series_Model.insert_series(championship_id, series_name)

        # Insert player records for the new series
        for player in players_data:
            Series_Players_Model.insert_series_player_record(
                new_series.SeriesID,
                player['player_id'],
                total_points=player['total_points']
            )

        return jsonify(success=True)

    except Exception as e:
        return jsonify(success=False, error=str(e)), 500


@results_bp.route('/api/get_teams_results', methods=['POST'])
def get_teams_results():
    try:
        data = request.json
        championship_id = data.get('championship_id')
        series_id = data.get('series_id', None)  # Get series_id if provided

        if not championship_id:
            return jsonify(success=False, error="Championship ID is required"), 400

        # Step 2: Get teams enrolled in the championship
        teams = Teams_Model.select_team(championship_id=championship_id)

        if not teams:
            return jsonify(success=False, error="No teams found for this championship"), 404

        team_results = []

        for team in teams:
            team_info = {
                'team_id': team.TeamID,
                'team_name': team.team_name,
                'players': []
            }

            # Step 2: Get players belonging to the team
            team_members = Team_Members_Model.select_team_members(team_id=team.TeamID)

            for member in team_members:
                player_info = {
                    'player_id': member.PlayerID,
                    'series_points': []
                }

                if series_id:
                    # Get player records for the specific series
                    series = Series_Model.select_series(series_id=series_id, championship_id=championship_id, is_random=True)
                    if series:
                        player_records = Series_Players_Model.select_series_player_records(series_id=series.SeriesID, player_id=member.PlayerID)
                        for record in player_records:
                            player_info['series_points'].append({
                                'series_id': series.SeriesID,
                                'series_name': series.series_name,
                                'total_points': record.TotalPoints
                            })
                else:
                    # Get series for the championship that are played randomly
                    series_list = Series_Model.select_series(championship_id=championship_id, is_random=True)

                    for series in series_list:
                        # Get player records for each series
                        player_records = Series_Players_Model.select_series_player_records(series_id=series.SeriesID, player_id=member.PlayerID)

                        for record in player_records:
                            player_info['series_points'].append({
                                'series_id': series.SeriesID,
                                'series_name': series.series_name,
                                'total_points': record.TotalPoints
                            })

                team_info['players'].append(player_info)

            team_results.append(team_info)

        return jsonify(success=True, data=team_results), 200

    except Exception as e:
        return jsonify(success=False, error=str(e)), 500

def init_routes(app):
    app.register_blueprint(results_bp)