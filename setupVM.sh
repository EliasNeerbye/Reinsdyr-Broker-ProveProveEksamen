#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# --- 1. Install nvm ---
echo "Installing nvm..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Load nvm into current shell session (adjust the profile file as needed)
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
else
    echo "nvm not found; please check installation."
    exit 1
fi

# --- 2. Install Node via nvm and set it as default ---
echo "Installing latest Node..."
nvm install node
nvm use node

# --- 3. Clone the Git repository ---
echo "Cloning repository..."
git clone https://github.com/EliasNeerbye/Reinsdyr-Broker-ProveProveEksamen.git

# --- 4. Change directory to the server folder ---
cd Reinsdyr-Broker-ProveProveEksamen/server

# --- 5. Install npm dependencies ---
echo "Installing npm dependencies..."
npm install

# --- 6. Install pm2 globally ---
echo "Installing pm2 globally..."
npm install -g pm2

# --- 7. Install nginx ---
echo "Installing nginx..."
sudo apt-get install -y nginx

# --- 8. Create nginx configuration ---
echo "Creating nginx configuration..."
# Write a new nginx configuration file that listens on port 80,
# uses the server name kukkikk-ano.caracal.ikt-fag.no, and reverse proxies to localhost:3000.
sudo tee /etc/nginx/sites-available/kukkikk-ano > /dev/null <<'EOF'
server {
    listen 80;
    server_name kukkikk-ano.caracal.ikt-fag.no;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the new configuration by linking it into sites-enabled.
sudo ln -sf /etc/nginx/sites-available/kukkikk-ano /etc/nginx/sites-enabled/kukkikk-ano

# Optionally, remove the default configuration to avoid conflicts.
sudo rm -f /etc/nginx/sites-enabled/default

# --- 9. Test, enable, and restart nginx ---
echo "Testing nginx configuration..."
sudo nginx -t

echo "Restarting and enabling nginx..."
sudo systemctl restart nginx
sudo systemctl enable nginx

# --- 10. Create the .env file dynamically ---
echo "Creating .env file..."

# Get the machine's primary IP address
machine_ip=$(hostname -I | awk '{print $1}')
mongo_ip=$(echo "$machine_ip" | awk -F. '{OFS="."; $4+=1; print}')

echo "Machine IP: $machine_ip"
echo "MongoDB IP: $mongo_ip"


# Generate the .env file
cat <<EOF > .env
MONGO_USER=username
MONGO_PWD=password
MONGO_IP=${mongo_ip}:27017

SALT_ROUNDS=10
PROD_TRUE=false
SESSION_SECRET=$(node ./super-secret.js)
PORT=3000

APP_IP=${machine_ip}
SSL_STATE=http
EOF

echo "Setup complete."
