#!/bin/bash

# NVM (Node Version Manager) Installation Script

# Exit on any error
set -e

# Update package lists
sudo apt update

# Download and install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Source the NVM script to make it available in the current session
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Install the latest LTS version of Node.js
nvm install node

# Set the installed LTS version as default
nvm use node
# Verify installations
echo "NVM version:"
nvm --version

echo "Node.js version:"
node --version

echo "npm version:"
npm --version

# Add NVM to .bashrc to ensure it's loaded in future sessions
if ! grep -q "NVM_DIR" ~/.bashrc; then
    echo '
# NVM Configuration
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
' >> ~/.bashrc
fi

echo "NVM and Node.js installation complete!"
echo "Please restart your terminal or run 'source ~/.bashrc' to apply changes."