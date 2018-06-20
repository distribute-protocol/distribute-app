#!/bin/bash

mongod &
ipfs &
ganache-cli &
cd contracts && truffle migrate &
cd ../ && node server &
cd frontend && yarn start
