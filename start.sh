#!/bin/bash

# Start ngrok in the background
ngrok http 5000 --log stdout &

# Start Flask
flask run --host 0.0.0.0
