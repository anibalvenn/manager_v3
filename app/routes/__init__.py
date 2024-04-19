
from app.routes.view_routes import init_routes as init_view_routes
from app.routes.player_routes import init_routes as init_player_routes
from app.routes.championship_routes import init_routes as init_championship_routes
from app.routes.championship_player_routes import init_routes as init_championship_players_routes

def init_routes(app):
    init_view_routes(app)  # Register view routes
    init_player_routes(app)  # Register player routes
    init_championship_routes(app)  # Register championship routes
    init_championship_players_routes(app)  # Register championship players routes
