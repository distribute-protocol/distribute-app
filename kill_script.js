#!/bin/bash

# mongod
kill $(lsof -i :27017 | awk '{print $2}' | tail -n+2) &
# ipfs
kill $(lsof -i :5001 | awk '{print $2}' | tail -n+2) &
# ganache-cli
kill $(lsof -i :8545 | awk '{print $2}' | tail -n+2) &
# server
kill $(lsof -i :3001 | awk '{print $2}' | tail -n+2) &
# frontend
kill $(lsof -i :3000  | awk '{print $2}' | tail -n+2) &
