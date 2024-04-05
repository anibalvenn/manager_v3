from datetime import date

class Player:
    def __init__(self, name, sex, birthdate, country):
        self.name = name
        self.sex = sex
        self.birthdate = birthdate
        self.country = country
        self.age = self.calculate_age()  # Corrected indentation and method call

    def __repr__(self):
        return f"Player(name='{self.name}', sex='{self.sex}', birthdate='{self.birthdate}', country='{self.country}')"

    def calculate_age(self):
        today = date.today()
        age = today.year - self.birthdate.year - ((today.month, today.day) < (self.birthdate.month, self.birthdate.day))
        return age
