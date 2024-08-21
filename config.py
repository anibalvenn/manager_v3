# config.py

import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    # Other configuration settings...
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'


    # Use environment variable for database URI or default to SQLite file
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///' + os.path.join(basedir, 'db', 'manager_database.db'))
    SQLALCHEMY_TRACK_MODIFICATIONS = False
