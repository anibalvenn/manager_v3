# routes/init.py

from app.routes import view_routes

def init_routes(app):
    # Initialize routes from view_routes module
    view_routes.init_routes(app)
