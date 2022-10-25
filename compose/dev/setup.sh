#!/bin/bash -e
mkdir -p ~/.keys 2> /dev/null
openssl genrsa -out ~/.keys/sats_sig.pem 4096 2> /dev/null
openssl rsa -in ~/.keys/sats_sig.pem -outform PEM -pubout -out $HOME/.keys/sats_sig.pub 2> /dev/null
echo "[*] Generated new server signing keys."

MY_DOMAIN_NAME="localhost"
REPO="$(dirname $(dirname $(pwd)))"
REPO_APP="$REPO/app"
REPO_NGINX_CONF="$REPO/infra/nginx/dev/nginx-conf"
rm -rf "$REPO_NGINX_CONF/default.conf"
cp "$REPO_NGINX_CONF/template.conf" "$REPO_NGINX_CONF/default.conf" 
perl -i -pe"s/___DOMAIN___/$MY_DOMAIN_NAME/g" "$REPO_NGINX_CONF/default.conf"
echo "[*] Created nginx default.conf with $MY_DOMAIN_NAME as hostname."


rm -rf .env
touch .env
chmod +r .env

echo "COMPOSE_PROJECT_NAME=cypherpost-landing-dev" >> .env
echo "REPO=$REPO_APP" >> .env
echo "KEYS=$HOME/.keys" >> .env

echo "[!] Adjuisting permissions! Requires sudo."

sudo chown -R $(whoami):1000 ~/.keys
sudo chmod -R 770 ~/.keys

echo "[*] SETUP COMPLETE!"