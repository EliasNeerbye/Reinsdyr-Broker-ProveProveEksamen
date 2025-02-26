#!/bin/bash
sudo ufw default deny incoming
sudo ufw default deny outgoing
sudo ufw allow from 10.12.45.50 to any port 27017
sudo ufw allow to 10.12.45.50 from any port 27017
sudo ufw allow ssh
sudo ufw enable