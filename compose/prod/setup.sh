#!/bin/bash -e
if test -f .env; then
    echo "[!] .env file exists"
    cat .env
    echo "Would you like to reconfigure setup? (Y/n)"
    read -r reconfigure
    if [[ $reconfigure == "n" ]]; then
      exit;
    fi
fi

echo "We will now setup directories on your host which will be used as volumes with each container."
echo "You will only need to provide the parent directory. We will check if child directories for each contianer exists. If not we will create them."
echo "Provide a full path to parent directory for container volumes:"
read -r VOLUMES_PARENT_DIR
printf "\n"

if [[ "$VOLUMES_PARENT_DIR" == */ ]]; then
  VOLUMES_PARENT_DIR=${VOLUMES_PARENT_DIR%?}
fi

NODE_VOLUME="$VOLUMES_PARENT_DIR/node"
KEYS_VOLUME="$NODE_VOLUME/.keys"
CERTS_VOLUME="$VOLUMES_PARENT_DIR/certs"
CERTBOTETC_VOLUME="$CERTS_VOLUME/certbot/etc"
CERTBOTVAR_VOLUME="$CERTS_VOLUME/certbot/var"

mkdir -p "$KEYS_VOLUME" 2> /dev/null
mkdir -p "$NODE_VOLUME/winston" 2> /dev/null
mkdir -p "$CERTS_VOLUME" 2> /dev/null
mkdir -p "$CERTBOTETC_VOLUME" 2> /dev/null
mkdir -p "$CERTBOTVAR_VOLUME" 2> /dev/null

echo "[*] Container volume parent directories are setup."
printf "\n"

if [[ -f "$CERTS_VOLUME/dhparam.pem" ]]; then
    echo "[*] DHParam exists for nginx server."
else
  openssl dhparam -out "$CERTS_VOLUME/dhparam.pem" 2048
  echo "[*] DHParam setup for nginx server."
fi


sudo openssl genrsa -out $KEYS_VOLUME/sats_sig.pem 4096
sudo openssl rsa -in $KEYS_VOLUME/sats_sig.pem -outform PEM -pubout -out $KEYS_VOLUME/sats_sig.pub
echo "[!] Giving node container GUI 1300 permission to use response signing keys."
# sudo chown -R $(whoami):1300 $NODE_VOLUME
# sudo chmod -R 770 $NODE_VOLUME
echo "[*] Generated new server signing keys."

## NGINX CONFIG
REPO="$(dirname $(dirname $(pwd)))"
REPO_NGINX_CONF="$REPO/infra/nginx/prod/nginx-conf"

rm -rf "$REPO_NGINX_CONF/pre" "$REPO_NGINX_CONF/post"

cp "$REPO_NGINX_CONF/pre_template" "$REPO_NGINX_CONF/pre" 

cp "$REPO_NGINX_CONF/post_template" "$REPO_NGINX_CONF/post" 

echo "[*] Created nginx pre & post conf files"

touch .env
echo "COMPOSE_PROJECT_NAME=cypherpostio-production" >> .env
echo "REPO=$REPO/app" > .env
echo "KEYS=$KEYS_VOLUME" >> .env
echo "NODE_VOLUME=$NODE_VOLUME" >> .env
echo "CERTS_VOLUME=$CERTS_VOLUME" >> .env

echo "[*] SETUP COMPLETE! VERIFY YOUR ENVIRONMENT VARIABLES."
cat .env
echo "[!] Make sure your domain name points to this server's IP."
echo "[!] Run issue_ssl.sh OR start.sh directly if you have ssl certs issued."