# Use the official Python image from the Docker Hub
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /

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

# Set Flask environment to development
ENV FLASK_ENV=development

# Copy the contents of the project into the container's /app directory
COPY . /

# Copy the start script into the container
COPY start.sh /start.sh

# Make the start script executable
RUN chmod +x /start.sh

# Expose the port that the app runs on
EXPOSE 5000

# Start both ngrok and Flask using the start script
CMD ["/start.sh"]