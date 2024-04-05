class Tisch:
    def __init__(self, table_name, series_id):
        self.table_name = table_name
        self.series_id = series_id
        self.tableID = None  # Initially set to None

    def __repr__(self):
        return f"Table(table_name='{self.table_name}', series_id='{self.series_id}')"

    def set_tableID(self, tableID):
        self.tableID = tableID
