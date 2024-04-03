
class Tisch:
  def __init__(self, spielern, series_label,series_index, tisch_index):
      self.label =''
      self.spielern = spielern
      self.series_label = series_label
      self.series_index = series_index
      self.tisch_index = tisch_index
      self.set_tisch_label()

  def set_tisch_label(self):
    self.label = self.series_label+"_T"+str(self.tisch_index+1)

