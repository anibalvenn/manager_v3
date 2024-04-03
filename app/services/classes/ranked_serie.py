import csv
import os
from app.services.classes.tisch import Tisch
from app.services.classes.player import Player

base_directory = "db/championships"
playersFileCSV = "db/players.csv"

class RankedSerie:
  def __init__(self, series_label ,filename='ranking_total.csv'):
    self.series_label = series_label
    self.label = series_label
    self.tische = []
    self.filename="C:/Users/User/Documents/skat/manager_v2/db/championships/Paulista/"+filename
    self.neuer_gesetzte_tisch()

   
  # def bau_gesetzte_tische(self):
  #   local_filename = f'championships/{self.champ_name}/{self.filename}'
  #   player_ids = self.sort_csv_by_total(local_filename)
  #   tables_grouped_by_player_ids=self.ranked_tables_by_groups_of_player_id(player_ids)
  #   self.tische = self.build_players_tables(tables_grouped_by_player_ids)

  def neuer_gesetzte_tisch(self):
    player_ids = self.sort_csv_by_total(self.filename)
    tables_grouped_by_player_ids=self.ranked_tables_by_groups_of_player_id(player_ids)
    self.tische = self.build_players_tables(tables_grouped_by_player_ids)


   
  def sort_csv_by_total(self,filename):
    with open(filename, 'r') as file:
      reader = csv.reader(file)
      header = next(reader)  # Extract the header
      #from ranking.csv
      if "ranking" in filename:
        total_index = header.index("total")  # Find the index of the 'total' column
      #from any series_*.csv
      else:
        total_index = header.index("points")  # Find the index of the 'total' column
         
      player_id_index = header.index("player_id")  # Find the index of the 'player_id' column
      data = list(reader)


    # Sorting the data by the 'total' column in descending order
    sorted_data = sorted(data, key=lambda x: int(x[total_index]), reverse=True)

    # Extracting player_id values from sorted data
    sorted_player_ids = [row[player_id_index] for row in sorted_data]

    # Filter out negative values
    sorted_player_ids_no_blinds = [id for id in sorted_player_ids if int(id) >= 0]

    return sorted_player_ids_no_blinds


  def ranked_tables_by_groups_of_player_id(self,player_ids):
    slice_size = 4
    remainder = len(player_ids) % slice_size
    amount_three_pl_tische = 4 - remainder if remainder != 0 else 0
    print(player_ids)
    # If remainder is 0, all tables will have 4 players
    if remainder == 0:
      ranked_tables = [player_ids[i:i + slice_size] for i in range(0, len(player_ids), slice_size)]
    else:
    # Separate out players for three-player groups
      three_tische_players = player_ids[-amount_three_pl_tische*3:]
      player_ids = player_ids[:-amount_three_pl_tische*3]

      # Create groups of four players
      four_player_groups = [player_ids[i:i + slice_size] for i in range(0, len(player_ids), slice_size)]

      # Create groups of three players
      three_player_groups = [three_tische_players[i:i + 3] for i in range(0, len(three_tische_players), 3)]

      # Combine four-player and three-player groups into a single list
      ranked_tables = four_player_groups + three_player_groups
  
    return ranked_tables
  
  def get_player_by_id(self, target_player_id=''):
    with open(playersFileCSV, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row['player_id'] == target_player_id:
                # Assuming Player is a class that takes name, sex, birthdate, country, player_id as arguments
                player = Player(row['name'], row['sex'], row['birthdate'], row['country'], row['player_id'])
                return player  # Return the player if the ID matches
    return None  # Return None if no matching player is found

  def build_players_tables(self, groups_of_ids=[]):
    tische = []
    for tisch_index, group in enumerate(groups_of_ids):
        player_group = []
        for player_id in group:
            player = self.get_player_by_id( player_id)
            if player:
                player_group.append(player)
        if(len(player_group)==3):
           blind_player=Player('-1','-1','-1','-1','-1')
           player_group.append(blind_player)
        tisch = Tisch(player_group, self.label, self.series_label, tisch_index)
        tische.append(tisch)

    return tische



  def create_ranked_list_csv(self):
    # Get the directory of the filename (one level above)
    championship_directory = os.path.dirname(self.filename)

    # Construct the full file path for the CSV file
    new_filename = os.path.join(championship_directory, f'{self.label}.csv')

    with open(new_filename, 'w', newline='') as csvfile:
      writer = csv.writer(csvfile)
      # Write header
      writer.writerow(['tisch_label', 'player_id', 'player_name', 'points', 'lost_games'])

      # Write data for each tisch and player in the series
      for tisch in self.tische:
        for spieler in tisch.spielern:
          writer.writerow([
            tisch.label,
            spieler.playerID,
            spieler.name,  # Assuming spieler object has a 'name' attribute
            0,  # Initial Points
            0   # Initial Lost Games
          ])


