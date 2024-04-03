import math
import os
import csv
from app.services.classes.player import Player
from app.services.classes.tisch import Tisch
from app.services.classes.random_serie import RandomischeSerie

base_directory = "db/championships"

class Championship:

  def __init__(self, num_series,num_random_series,name,players):
    self.name= name
    self.num_series = num_series
    self.players = players
    self.teams = []
    self.player_groups = []
    self.random_rounds = []
    self.all_rounds = []
    self.num_random_series = num_random_series
    self.played_series = 0
    self.current_series = 0
    self.lost_game_value = 0
    self.num_blind_players = 0
    self.split_players_into_groups()
    self.player_groups_to_rounds = self.player_groups
    self.create_random_rounds()
    self.create_ranking_csv()


  
  def generate_one_serie_tische_array(self,groups):
    # The zip function combines elements from each group with the same index
    return [list(group) for group in zip(*groups)]
  
  def create_ranking_csv(self, filename="ranking.csv"):
    # Ensure the base and championship directories exist
    championship_directory = os.path.join(base_directory, self.name)
    os.makedirs(championship_directory, exist_ok=True)

    # Full path for the CSV file
    full_filename = os.path.join(championship_directory, filename)

    # Define the header for the CSV file
    headers = ['player_id', 'player_name', 'total']  # Only three columns
    
    # Create the CSV file with the headers
    with open(full_filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headers)

        # Write the player data
        for player in self.players:
            # Prepare a row for each player with ID, name, and an initial total of 0
            row = [player.playerID, player.name, '0']
            writer.writerow(row)


  def write_serie_to_csv(self,serie, championship_name):
    # Ensure the base and championship directories exist
    championship_directory = os.path.join(base_directory, championship_name)
    print(championship_directory)
    os.makedirs(championship_directory, exist_ok=True)

    # Construct the full file path for the CSV file
    filename = os.path.join(championship_directory, f'{serie.label}.csv')

    with open(filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        # Write header
        writer.writerow(['tisch_label', 'player_id', 'player_name', 'points', 'lost_games'])

        # Write data for each tisch and player in the series
        for tisch in serie.tische:
            for spieler in tisch.spielern:
                writer.writerow([
                    tisch.label,
                    spieler.playerID,
                    spieler.name,  # Assuming spieler object has a 'name' attribute
                    0,  # Initial Points
                    0   # Initial Lost Games
                ])


  def create_random_rounds(self):
    for i in range(self.num_random_series):
      self.player_groups_to_rounds = self.rotate_groups(self.player_groups_to_rounds)
      # print("After a rotation:")
      single_serie_tische_array = self.generate_one_serie_tische_array(self.player_groups_to_rounds)
      random_serie = RandomischeSerie(i,single_serie_tische_array)
      self.random_rounds.append(random_serie)
      self.all_rounds.append(random_serie)  
    for serie in self.random_rounds:
      self.write_serie_to_csv(serie, self.name)  

  def rotate_groups(self, groups):
      # Apply the rotation logic to each group with its index
    return [rotate_group_with_fixed_blind(group, index) for index, group in enumerate(groups)]
  
  def rotate_group_with_fixed_blind(self, group, index):
    # """Rotates the group while keeping the position of a player with playerID == -1 fixed."""
    # Find the index of the player with playerID == -1
    blind_player_index = next((i for i, player in enumerate(group) if player.playerID == -1), None)

    if blind_player_index is not None:
        # Temporarily remove the player with playerID == -1
        blind_player = group.pop(blind_player_index)
    else:
        blind_player = None

    # Rotate the group to the right by 'index' positions
    group = group[-index:] + group[:-index]

    # Reinsert the player with playerID == -1 at its original position if it was removed
    if blind_player is not None:
        group.insert(blind_player_index, blind_player)
        # for player.playerID in 

    return group

  def rotate_groups(self, groups):
      # Apply the rotation logic to each group with its index
    return [self.rotate_group_with_fixed_blind(group, index) for index, group in enumerate(groups)]

  def split_players_into_groups(self):
    num_players = len(self.players)
    num_groups = 4
    group_size = math.ceil(num_players / num_groups)
    remainder = num_players % num_groups
    if remainder>0:
      self.num_blind_players = num_groups - remainder
    else:
      self.num_blind_players=0
    # Initialize groups
    self.player_groups = [[] for _ in range(num_groups)]

    # Current index in the players list
    current_index = 0

    # Fill the first group with 'group_size' players
    self.player_groups[0] = self.players[current_index:current_index + group_size]
    current_index += group_size

    # For the remaining groups
    for i in range(1, num_groups):
        size = group_size - 1 if i >= num_groups - self.num_blind_players else group_size
        self.player_groups[i] = self.players[current_index:current_index + size]
        current_index += size

    # Print group sizes and compositions for verification
    for i in range(1, self.num_blind_players + 1):
      if i == 1:  # Special case for the last group
        insert_position = len(self.player_groups[-i])  # Append to the end
      else:
        insert_position = len(self.player_groups[-i]) - i+1  # Calculate the correct insert position
      blind_player = Player("","","","",-1)
      self.player_groups[-i].insert(insert_position, blind_player)
    for i, group in enumerate(self.player_groups):
      player_ids = [player.playerID for player in group]
      print(f"Group {i+1}: {player_ids}, Size: {len(group)}")



    



      