from datetime import date

class Championship:
    def __init__(self, name, acronym, creation_date):
        self.name = name
        self.acronym = acronym
        self.creation_date = creation_date
        self.championshipID = None  # Initially set to None

    def __repr__(self):
        return f"Championship(championshipID={self.championshipID}, name='{self.name}', acronym='{self.acronym}', creation_date='{self.creation_date}')"

    def set_championshipID(self, championshipID):
        self.championshipID = championshipID
