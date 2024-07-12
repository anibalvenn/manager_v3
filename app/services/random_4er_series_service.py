import math
from app.models import Championship_Player_Model, Tische_Model, Series_Model
from app.models.series_player_model import Series_Players_Model
from app.services.utils import get_player_ids_for_championship, set_initial_values_to_players_into_series

def create_4er_random_rounds(random_series_amount, current_championship_ID, current_championship_acronym):
    playerIDsArray = get_player_ids_for_championship(current_championship_ID)

    player_ids_groups_with_blinds = split_players_into_groups(playerIDsArray)
    success = True
    
    for i in range(int(random_series_amount)):
        # Use the result of rotate_groups from the previous iteration as input for the next
        player_ids_groups_with_blinds = rotate_groups(player_ids_groups_with_blinds)
        player_groups_to_rounds = player_ids_groups_with_blinds
        
        single_serie_tische_array = generate_one_serie_tische_array(player_groups_to_rounds)
        
        championship_serien = Series_Model.select_series(championship_id=current_championship_ID)
        length_existing_serien = len(championship_serien)
        series_name = current_championship_acronym + '_S#' + str(length_existing_serien + 1)
        series = Series_Model().insert_series(current_championship_ID, series_name=series_name, 
                                              is_random=True, seek_4er_tische=True)
        
        set_initial_values_to_players_into_series(championship_id=current_championship_ID,series=series)

        if not bau_randomische_tische(i, single_serie_tische_array=single_serie_tische_array, 
                                      series=series):
            # If creation of tisches fails, handle the error here
            print(f"Error creating randomische tische for series {series_name}")
            success = False
    
    return success
def generate_one_serie_tische_array(groups):
    # The zip function combines elements from each group with the same index
    return [list(group) for group in zip(*groups)]
  

def bau_randomische_tische(series_index, single_serie_tische_array, series):
    remainder = series_index % 4

    for tisch_index, tisch in enumerate(single_serie_tische_array):
        rotated_tisch = tisch[-remainder:] + tisch[:-remainder]

        tisch_name = series.series_name + "_T#" + str(tisch_index + 1)
        # Insert the tisch into the database
        tisch_inserted = Tische_Model().insert_tisch(
            series_id=series.SeriesID, tisch_name=tisch_name,
            pos_a=rotated_tisch[0], pos_b=rotated_tisch[1],
            pos_c=rotated_tisch[2], pos_d=rotated_tisch[3]
        )
        
        if not tisch_inserted:
            return False  # Return False if insertion fails

    return True  # Return True if all insertions are successful


def rotate_groups(groups):
      # Apply the rotation logic to each group with its index
    return [rotate_group_with_fixed_blind(group, index) for index, group in enumerate(groups)]
  
def rotate_group_with_fixed_blind( group, index):
    # """Rotates the group while keeping the position of a player with playerID == -1 fixed."""
    # Find the index of the player with playerID == -1
    blind_player_index = next((i for i in enumerate(group) if i == -1), None)

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


def split_players_into_groups(players_ids_arr):
    num_players = len(players_ids_arr)
    num_groups = 4
    group_size = math.ceil(num_players / num_groups)
    remainder = num_players % num_groups
    if remainder>0:
      num_blind_players = num_groups - remainder
    else:
      num_blind_players=0
    # Initialize groups
    player_groups = [[] for _ in range(num_groups)]

    # Current index in the players list
    current_index = 0

    # Fill the first group with 'group_size' players
    player_groups[0] = players_ids_arr[current_index:current_index + group_size]
    current_index += group_size

    # For the remaining groups
    for i in range(1, num_groups):
        size = group_size - 1 if i >= num_groups - num_blind_players else group_size
        player_groups[i] = players_ids_arr[current_index:current_index + size]
        current_index += size
    

    # Print group sizes and compositions for verification
    for i in range(1, num_blind_players + 1):
      if i == 1:  # Special case for the last group
        insert_position = len(player_groups[-i])  # Append to the end
      else:
        insert_position = len(player_groups[-i]) - i+1  # Calculate the correct insert position
      blind_player = -1
      player_groups[-i].insert(insert_position, blind_player)
    return player_groups



