#!/bin/bash
sudo docker compose pull
sudo docker compose up -d
sudo docker container prune
sudo docker image prune
