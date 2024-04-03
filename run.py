import sqlite3
from app import create_app

print(sqlite3.version+"sqlite")
print(sqlite3.version)

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
