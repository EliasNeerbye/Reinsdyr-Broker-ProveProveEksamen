#!/bin/bash

# NVM (Node Version Manager) Installation Script for User Environment

# Exit on any error
set -e

# Download and install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Source the NVM script to make it available in the current session
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

nvm install node

nvm use node

# Verify installations
echo "NVM version:"
nvm --version

echo "Node.js version:"
node --version

echo "npm version:"
npm --version