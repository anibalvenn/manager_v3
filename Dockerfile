# Use the official Python image from the Docker Hub
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Install wget and unzip
RUN apt-get update && apt-get install -y wget unzip

# Copy the requirements file into the container
COPY requirements.txt .

# Install the required packages
RUN pip install --no-cache-dir -r requirements.txt

# Download the ngrok binary
RUN wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-stable-linux-amd64.zip \
    && unzip ngrok-stable-linux-amd64.zip \
    && mv ngrok /usr/local/bin/ngrok \
    && rm ngrok-stable-linux-amd64.zip

# Set the ngrok authtoken using an environment variable
ARG NGROK_AUTH_TOKEN
RUN ngrok authtoken $NGROK_AUTH_TOKEN

# Copy the rest of the application code into the container
COPY . .

# Expose the port that the app runs on
EXPOSE 5000

# Start ngrok and the Flask app concurrently
CMD ngrok http 5000 --log stdout & python run.py
