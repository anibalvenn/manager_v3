from app.services.classes.tisch import Tisch

class RandomischeSerie:
  def __init__(self, series_index ,players_line_up):
    self.players_line_up = players_line_up
    self.series_index = series_index
    self.label = 'S'+str(series_index+1)
    self.tische = []
    self.bau_randomische_tische()

  def bau_randomische_tische(self):
    # for player in self.players_line_up:
      # print(player.player_id)
    remainder = self.series_index % 4

    for tisch_index, tisch in enumerate(self.players_line_up):
      # Rotating each tisch by the remainder amount
      rotated_tisch = tisch[-remainder:] + tisch[:-remainder]
      tisch = Tisch(rotated_tisch, self.label, self.series_index, tisch_index)
      self.tische.append(tisch)





