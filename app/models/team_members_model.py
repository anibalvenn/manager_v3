from app import db

class Team_Members_Model(db.Model):
    __tablename__ = 'team_members'
    TeamID = db.Column(db.Integer, db.ForeignKey('teams.TeamID'), primary_key=True)
    PlayerID = db.Column(db.Integer, db.ForeignKey('players.PlayerID'), primary_key=True)

    @classmethod
    def insert_team_member(cls, team_id, player_id):
        """Inserts a new team member relationship into the database."""
        new_team_member = cls(TeamID=team_id, PlayerID=player_id)
        db.session.add(new_team_member)
        db.session.commit()
        return new_team_member

    @classmethod
    def update_team_member(cls, team_id, player_id, new_team_id=None, new_player_id=None):
        """Updates an existing team member's team or player ID."""
        # Note: Updating primary keys directly might not be common. Consider the logic and use case.
        team_member = cls.query.filter_by(TeamID=team_id, PlayerID=player_id).first()
        if team_member:
            if new_team_id is not None:
                team_member.TeamID = new_team_id
            if new_player_id is not None:
                team_member.PlayerID = new_player_id
            db.session.commit()
            return team_member
        return None

    @classmethod
    def delete_team_member(cls, team_id, player_id):
        """Deletes a team member from the database."""
        team_member = cls.query.filter_by(TeamID=team_id, PlayerID=player_id).first()
        if team_member:
            db.session.delete(team_member)
            db.session.commit()
            return True
        return False

    @classmethod
    def select_team_members(cls, team_id=None, player_id=None):
        """Selects team members based on team ID or player ID."""
        if team_id and not player_id:
            return cls.query.filter_by(TeamID=team_id).all()
        elif player_id and not team_id:
            return cls.query.filter_by(PlayerID=player_id).all()
        elif team_id and player_id:
            return cls.query.filter_by(TeamID=team_id, PlayerID=player_id).first()
        else:
            return None
        
    @classmethod
    def get_player_ids_by_team_id(cls, team_id):
        """Get an array of player IDs belonging to a specific team."""
        team_members = cls.query.filter_by(TeamID=team_id).all()
        player_ids = [team_member.PlayerID for team_member in team_members]
        return player_ids
