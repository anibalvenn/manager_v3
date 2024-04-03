from app import create_app, db

# Create an instance of your Flask application
app = create_app()

# Push an application context manually
with app.app_context():
    # Now you can access db.engine.table_names() within the application context
    print(db.engine.table_names())
