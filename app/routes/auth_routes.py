from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, login_required
from werkzeug.security import check_password_hash
from app import db
from app.models import User_Model
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        user = User_Model.query.filter_by(username=username).first()

        if user and check_password_hash(user.password, password):
            login_user(user)
            return render_template('championships.html')
        else:
            flash('Invalid username or password', 'danger')

    return render_template('login.html')

@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))  # Redirect to the login page or another public page

# Add a simple register route if needed
@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        
        # Create new user and hash the password
        hashed_password = generate_password_hash(password, method='sha256')
        new_user = User_Model(username=username, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        
        login_user(new_user)
        return redirect(url_for('main.dashboard'))

    return render_template('register.html')
