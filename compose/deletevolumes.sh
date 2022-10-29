#!/bin/bash

docker volume rm     dev_cpio-server-code
docker volume rm     dev_cpio-server-keys
docker volume rm     dev_cpio-server-code
docker volume rm     dev_cpio-server-keys
docker volume rm     dev_cpio-server-logs
docker volume rm     dev_cpio-web-root


docker volume rm     prod_cpio-server-code
docker volume rm     prod_cpio-server-keys
docker volume rm     prod_cpio-server-code
docker volume rm     prod_cpio-server-keys
docker volume rm     prod_cpio-server-logs
docker volume rm     prod_cpio-web-root