import os, csv
from app.services.classes.player import Player
from app.services.classes.championship import Championship
from app.services.classes.ranked_serie import RankedSerie

current_script_path = os.path.dirname(os.path.abspath(__file__))
base_directory = "db/championships"
playersFileCSV = "db/players.csv"

# Get the directory of the current script/file (start_championship.py)

def start_championship(num_series, num_random_series,  championship_name):
    if not championship_name:
        championship_name = 'hay_Skat'

    create_meisterschafts_directory(championship_name)

    players = []
    with open(playersFileCSV, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            player = Player(row['name'], row['sex'], row['birthdate'], row['country'], row['player_id'])
            players.append(player)
    
    championship = Championship(num_series,num_random_series,championship_name,players)

def create_meisterschafts_directory(meisterschafts_name):

    # Ensure the base directory exists
    os.makedirs(base_directory, exist_ok=True)

    # Process the directory name to ensure it's a valid folder name
    safe_directory_name = meisterschafts_name.replace(" ", "_")  # Replace spaces with underscores

    # Full path for the new directory
    full_directory_path = os.path.join(base_directory, safe_directory_name)

    try:
        os.makedirs(full_directory_path, exist_ok=True)  # Create the directory
        print(f"Directory '{full_directory_path}' created.")
        return full_directory_path  # Return the full path of the created directory
    except OSError as error:
        print(f"Error creating directory '{full_directory_path}': {error}")
        return None

def build_ranked_series(filename):
    print(filename, "filename")
    new_ranked_serie = RankedSerie("ranked", filename)
    new_ranked_serie.create_ranked_list_csv()



def add_series_to_ranking(filename):
    print("add begin")
    if not filename:
        print("No file selected")
        return

    directory = os.path.dirname(filename)
    ranking_file = os.path.join(directory, 'ranking.csv')

    if not os.path.exists(ranking_file):
        print(f"Ranking file not found in {directory}")
        return

    with open(filename, 'r') as file:
        reader = csv.DictReader(file)
        series_data = {row['player_id']: (row['points'], row['lost_games']) for row in reader}

    with open(ranking_file, 'r') as file:
        reader = csv.reader(file)
        ranking_data = list(reader)

    header = ranking_data[0]
    if 'total' in header:
        total_index = header.index('total')
        header.pop(total_index)
        for row in ranking_data[1:]:
            row.pop(total_index)
    
    series_cols = [col for col in header if col.startswith('series_')]
    highest_series_num = max([int(col.split('_')[1]) for col in series_cols], default=0)

    new_series_col = f'series_{highest_series_num + 1}'
    new_lost_games_col = f'verl_{highest_series_num + 1}'
    header.extend([new_series_col, new_lost_games_col, 'total']) 

    for row in ranking_data[1:]:
        player_id = row[0]
        points, lost_games = series_data.get(player_id, ('0', '0'))
        row.extend([points, lost_games])
        # Calculate total points sum for the player
        total_points = sum(int(row[header.index(col)]) for col in series_cols if col in header) + int(points)
        row.append(str(total_points))  # Append the calculated total points

    # Sort the players by total points in descending order
    ranking_data[1:] = sorted(ranking_data[1:], key=lambda x: int(x[-1]), reverse=True)

    with open(ranking_file, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(header)  # Write the header separately
        writer.writerows(ranking_data[1:])  # Write the sorted data
        print("written")
