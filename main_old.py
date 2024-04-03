import os
import tkinter as tk
from tkinter import ttk
from tkinter import filedialog
import csv
import subprocess
from tkinter import messagebox
from classes.player import Player
from classes.championship import Championship
from classes.ranked_serie import RankedSerie

base_directory = "championships"
playersFileCSV = "../players.csv"

def load_csv(filename):
    with open(filename, newline='') as csvfile:
        reader = csv.reader(csvfile)
        headers = next(reader)  # Get the first line in the CSV, which contains the headers

        # Restart the reading of the file for the DictReader
        csvfile.seek(0)
        next(csvfile)  # Skip the header row
        data =  list(csv.DictReader(csvfile, fieldnames=headers))
    return headers, data

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


def add_series_to_ranking():
    filename = filedialog.askopenfilename(title="Select a CSV file", filetypes=(("CSV files", "*.csv"),))
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

# Note: Ensure this script runs in an environment where filedialog, os, and csv modules are available,
# or adjust the file selection mechanism as per your environment.

def get_numeric_entry(entry_widget):
    """Attempts to retrieve a numeric value from an Entry widget."""
    try:
        return int(entry_widget.get())
    except ValueError:
        messagebox.showerror("Input Error", "Please enter a valid number.")
        return None

def display_data(tree, headers, data):
    # Set up the treeview columns using the headers
    tree['columns'] = headers
    for header in headers:
        tree.heading(header, text=header)
        tree.column(header, anchor=tk.W)  # Adjust column properties as needed

    # Insert data into the treeview
    for row in data:
        tree.insert('', tk.END, values=[row[header] for header in headers])

def edit_player(event):
    selected_item = tree.selection()[0]
    data = tree.item(selected_item, "values")

    edit_window = tk.Toplevel(root)
    entries = []
    for i, value in enumerate(data):
        tk.Label(edit_window, text=headers[i]).pack()
        entry = tk.Entry(edit_window)
        entry.insert(0, value)
        entry.pack()
        entries.append(entry)

    def save_changes():
        new_values = [e.get() for e in entries]
        tree.item(selected_item, values=new_values)
        # Here, you should also update the CSV data
        edit_window.destroy()

    tk.Button(edit_window, text="Save Changes", command=save_changes).pack()

def delete_player():
    selected_item = tree.selection()
    if selected_item:
        tree.delete(selected_item)
        # Here, you should also update the CSV data


def add_player():
    add_window = tk.Toplevel(root)
    entries = []
    for header in headers:
        tk.Label(add_window, text=header).pack()
        entry = tk.Entry(add_window)
        entry.pack()
        entries.append(entry)

    def insert_new_player():
        new_values = [e.get() for e in entries]
        tree.insert('', tk.END, values=new_values)
        # Here, you should also update the CSV data
        add_window.destroy()

    tk.Button(add_window, text="Add Player", command=insert_new_player).pack()

def main():
    global root, tree, headers

    def open_edit_players():
        home_frame.grid_remove()
        edit_players_frame.grid()

    def open_start_championship():
        home_frame.grid_remove()
        start_championship_frame.grid()

    def go_home():
        print ("teste")
        edit_players_frame.grid_remove()
        start_championship_frame.grid_remove()
        home_frame.grid()

    def on_submit():
        num_series = get_numeric_entry(entry_series)
        num_random_series = get_numeric_entry(entry_random_series)
        champ_name = entry_champ_name.get()  # Assuming this is a string and doesn't need validation

        if num_series is not None and num_random_series is not None:
            start_championship(num_series, num_random_series, champ_name)

    def populate_championships_tree(tree):
        tree.delete(*tree.get_children())  # Clear existing items
        base_path = "championships"  # Path to the championships directory
        if os.path.exists(base_path):
            for championship in os.listdir(base_path):
                full_path = os.path.join(base_path, championship)
                if os.path.isdir(full_path):
                    tree.insert('', 'end', text=championship, open=False)

    def populate_championship_files(tree, championship_directory):
        base_path = os.path.join("championships", championship_directory)
        print(f"Loading contents of: {base_path}")  # Debugging print

        if os.path.exists(base_path):
            for item in tree.get_children():
                tree.delete(item)

            for item in os.listdir(base_path):
                full_path = os.path.join(base_path, item)
                tree.insert('', 'end', text=item, open=False)

    
    def build_ranked_series():
        filename = filedialog.askopenfilename(
            title="Select a CSV file",
            filetypes=(("CSV files", "*.csv"),)  # Restrict to .csv files
        )
        # You can now use the selected filename
        print(f"Selected file: {filename}")
        new_ranked_serie = RankedSerie("ranked", filename)
        new_ranked_serie.create_ranked_list_csv()

        
    root = tk.Tk()
    root.title("Player Management App")

    # Configure grid for the root window
    root.grid_rowconfigure(0, weight=1)
    root.grid_columnconfigure(0, weight=1)
    
    #################################################################
    # Home Page Frame
    #################################################################
    
    home_frame = tk.Frame(root)
    home_frame.grid(row=0, column=0, sticky="nsew")
    
    edit_players_button = tk.Button(home_frame, text="Edit Players", command=open_edit_players)
    edit_players_button.grid(row=0, column=0, padx=10, pady=10)
    
    start_championship_button = tk.Button(home_frame, text="Start Championship", command=open_start_championship)
    start_championship_button.grid(row=1, column=0, padx=10, pady=10)
    
    insert_series_result_button = tk.Button(home_frame, text="Add Results to ranking", command=add_series_to_ranking)
    insert_series_result_button.grid(row=2, column=0, padx=10, pady=10)

    open_button = tk.Button(home_frame, text="New Ranked List (select ranking.csv)", command=build_ranked_series)
    open_button.grid(row=3, column=0, padx=10, pady=10)
    # Edit Players Frame
    edit_players_frame = tk.Frame(root)
 
    # Setup for the editing functionality
    tree = ttk.Treeview(edit_players_frame)
    headers, data = load_csv(playersFileCSV)
    display_data(tree, headers, data)
    tree.grid(row=0, column=0, columnspan=2, sticky="nsew")
    tree.bind("<Double-1>", edit_player)


    delete_button = tk.Button(edit_players_frame, text="Delete Player", command=delete_player)
    delete_button.grid(row=1, column=0, sticky="ew", padx=5, pady=5)

    add_button = tk.Button(edit_players_frame, text="Add Player", command=add_player)
    add_button.grid(row=1, column=1, sticky="ew", padx=5, pady=5)

    home_button = tk.Button(edit_players_frame, text="Home", command=go_home)
    home_button.grid(row=2, column=0, columnspan=2, sticky="ew", padx=5, pady=5)

 
    #################################################################
    # Start Championship Frame
    #################################################################
    
    start_championship_frame = tk.Frame(root)
    lbl_championship_name = tk.Label(start_championship_frame, text="Enter Championship Name:")
    lbl_championship_name.grid(row=0, column=0, padx=5, pady=5)
    entry_champ_name = tk.Entry(start_championship_frame)
    entry_champ_name.grid(row=0, column=1, padx=5, pady=5)

    lbl_series = tk.Label(start_championship_frame, text="Number of series:")
    lbl_series.grid(row=1, column=0, padx=5, pady=5)
    entry_series = tk.Entry(start_championship_frame)
    entry_series.grid(row=1, column=1, padx=5, pady=5)

    lbl_random_series = tk.Label(start_championship_frame, text="Number of random series:")
    lbl_random_series.grid(row=2, column=0, padx=5, pady=5)
    entry_random_series = tk.Entry(start_championship_frame)
    entry_random_series.grid(row=2, column=1, padx=5, pady=5)



    start_button = tk.Button(start_championship_frame, text="Start", command=on_submit)
    start_button.grid(row=6, column=0, columnspan=2, padx=5, pady=5)

    home_button_championship = tk.Button(start_championship_frame, text="Home", command=go_home)
    home_button_championship.grid(row=7, column=0, columnspan=20, padx=5, pady=5)

    root.mainloop()

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






if __name__ == "__main__":
    main()

