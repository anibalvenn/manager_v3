# Skat Championship Manager

## Description
This is a tool to aid people who are in charge of organizing and managing Skat (the card game) championships. It has an internal database done on SQL Alchemy, which allows you to insert players, championships.
Once you have players and championships, you can add series to a championship, and then tables (Tische) to your series. We also provide a tool to calculate players points in a Tisch based on List registered results, and updates championship's ranking immediately as the points are inputed.
Our system mandatorily separates players of a championship in four groups, what ensures that players of a same group won't meet in random Tische.
Users are allowed to build random and ranked Tische in with 3 or 4 players/Tisch. After a series is inserted in the system, the manager can change manually the players distribution, excluding absent players from a single series, for instance.
There are two ways of inserting results in the system. In the simple, the manager writes the results directly. In the complete, the manager insert the List results, the system calculates the total points. In both cases the system is updated immediately.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Installation
1. Clone the repo:
```bash
git clone https://github.com/anibalvenn/manager_v3.git
```

## Usage
### Running with Python
1. Navigate to the root directory of the project:
```bash
cd /path/to/project
```
2. Run the code:
```bash
python run.py
```
### Running with Docker

#### Prerequisites

- [Docker](https://www.docker.com/get-started) must be installed on your machine.

1. Navigate to the root directory of the project:
```bash
cd <your_repository>
```
2. Build docker image:
```bash
docker build -t manager_v3 .
```
3. Run the Docker container:
```bash
docker run -p 5000:5000 manager_v3
```
4. Access the application at http://localhost:5000


## Features
Skat MAnager app is divided in seven tabs, Championships, Players, Series, Tische, Teams, Print and Import

### Championships
This is where you insert and update a championship.
When you insert one, it is automatically sent to the database.
When you click "players", you'll be redirected to page championship_players, where you should select from all players in the DB those who'll take part in the championship you selected.
You should also pay attention to the order you place the players, because the system will split the players in four groups. Players of a same team shall be put in a same group, so that they don't meet in a same table in a random Series, whose results will be counted for teams' championship.
The group each added player belongs correspond to the color of the line where a single player's data is displayed.
If you wanna change a player position within a group or change the group he belongs, you should select check box of corresponding player, keep ALT key pressed + arrow UP or arrow DOWN, to move respective player position.

### Players
This is where you insert and update a player.
When you click edit, you may edit the data of a single player.
### Series
This is where you create a new series. Random series shall be created all at once, so that the sorting system takes into account the previous random table sorting to sort a new one. Ranked tables might be created one by one, albeit ideal would be to create all series of a same championship before it to start being played.

#### Sort players Button
Sort players button allows the manager to change player's position in Tische and even Tisch change.
In view edit_serie_tische, if manager clicks Shuffle, players wil be sorted randomly.
If he clicks sort be series, players will be sorted according to results of desired series.
Sort by overall results sorts players by overall results in the championship.
Create Tische button overwrites the new Tische to those existing before manager's editions.

#### Insert Results button
Insert results button leads the manager to simple inserting results page, which is simple_serie_results.
In there, manager should assign final points for each player. Data are automatically saved as manager fill the fields.

### Tische
Shows the Tische build for the respective Series.
When clicking on Insert Results, manager is led to edit_tisch_results, in which he should fill data with won games, lost games and tables points of each player, so that the system can caculate total points.

### Teams
Shows current teams for the respective championship.
When clicking on Edit, the manager has access to edit_teams page, in which he can add, remove players or update team's name.

### Print
Gathers all functionalities related to paper printing. All printing buttons generate a PDF file, with corresponding info.
Pay attention to the difference between Listen and Listendatei. First option generates a complete list, with columns and rows, besides players data. Listendatei generate only players data, assuming the original paper sheets follow the same List model we hold in São Paulo.

### Import 
Enables the user to import or export data from a certain championship, with no need of doing it manually.
Both import and export shall be done using .csv files, and the header of a series results to import shall be
  ```bash
    player_id,total_points
```
whereas the header of overall results shall be
```bash
 player_id,s_1,s_2,s_[i]
 ```
Imported data will take player ID as reference, so you must ensure that the player IDs listed on the csv find due correspondence in your players table. Import feature was not designed to register players from scratch.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Project**
   - Go to the project repository and click the "Fork" button at the top right.

2. **Clone Your Fork**
   - Clone your forked repository to your local machine:
     ```bash
     git clone https://github.com/your-username/manager_v3.git
     ```

3. **Create a New Branch**
   - Create a branch for your feature or bug fix:
     ```bash
     git checkout -b feature/AmazingFeature
     ```

4. **Make Changes**
   - Make your changes in your local repository.

5. **Commit Your Changes**
   - Commit your changes with a descriptive commit message:
     ```bash
     git commit -m 'Add some AmazingFeature'
     ```

6. **Push to Your Branch**
   - Push your changes to your forked repository:
     ```bash
     git push origin feature/AmazingFeature
     ```

7. **Open a Pull Request**
   - Go to the original repository and open a pull request with a description of your changes.

### Coding Standards

- Ensure your code follows the project's coding standards and conventions.
- Write clear, concise commit messages.

### Report Issues

- If you find a bug, please report it by opening an issue in the repository.
- Include as much detail as possible in your issue report, such as steps to reproduce the issue, expected behavior, and screenshots if applicable.

### Feature Requests

- If you have a feature request, please open an issue to discuss your idea.
- Provide as much detail as possible to explain your idea and its potential benefits.

Thank you for your contributions!


## Contact
Anibal Venn - anibal.venn@gmail.com

Project Link: https://github.com/anibalvenn/manager_v3