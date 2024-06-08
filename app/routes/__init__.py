
from app.routes.view_routes import init_routes as init_view_routes
from app.routes.player_routes import init_routes as init_player_routes
from app.routes.championship_routes import init_routes as init_championship_routes
from app.routes.championship_player_routes import init_routes as init_championship_players_routes
from app.routes.team_player_routes import init_routes as init_teams_routes
from app.routes.series_routes import init_routes as init_series_routes
from app.routes.results_routes import init_routes as init_results_routes

def init_routes(app):
    init_view_routes(app)  # Register view routes
    init_player_routes(app)  # Register player routes
    init_championship_routes(app)  # Register championship routes
    init_championship_players_routes(app)  # Register championship players routes
    init_teams_routes(app)  # Register championship players routes
    init_series_routes(app)  # Register championship players routes
    init_results_routes(app)  # Register championship players routes
