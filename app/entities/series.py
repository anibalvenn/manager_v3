class Series:
    def __init__(self, series_name, championship_id):
        self.series_name = series_name
        self.championship_id = championship_id
        self.seriesID = None  # Initially set to None


    def __repr__(self):
        return f"Series(series_name='{self.series_name}', championship_id='{self.championship_id}')"

    def set_seriesID(self, seriesID):
        self.seriesID = seriesID