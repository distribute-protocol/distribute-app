# Distribute Protocol

The Distribute Protocol aims to create a general purpose decentralized utility protocol that helps scale distributed infrastructure systems, in a
way that can be responsive and accountable to the needs of its users, while also creating broader value that can be shared
among network participants.

## Getting Started

These instructions will allow you to run Distribute on your local machine for development and testing purposes.

**PLEASE NOTE THAT THE DISTRIBUTE PROTOCOL IS STILL IN PRODUCTION AND IS NOT READY FOR DEPLOYMENT ON THE MAINNET.**

## Prerequisites

Distribute has been tested for compatibility with Mac and Linux (Ubuntu 16.04).

Distribute Protocol requires the following software to be downloaded:
  + [yarn](https://yarnpkg.com/lang/en/docs/install/#mac-stable)
  + [Node.js/npm](https://nodejs.org/en/)
  + [Truffle Suite](http://truffleframework.com/docs/getting_started/installation) (Ethereum development framework)
  + [mongoDB](https://docs.mongodb.com/manual/installation/)
  + [ipfs daemon](https://ipfs.io/docs/install/)
  + [MetaMask](metamask.io) (Google Chrome extension)

For notes on how to install each of the above please refer to the section on Installing the Prerequisites for [Mac](#installing-the-prerequisites-for-mac) or [Linux](#installing-the-prerequisites-for-linux). If your system has all of the above, please visit the section [Installing the Distribute Protocol](#installing-the-distribute-protocol).

### Installing the Prerequisites (for Mac)
Note that it is essential to have all of these softwares before proceeding with the installation of the Distribute Protocol.

#### Installing yarn (and Node.js)
Make sure that Homebrew is installed. If not, go to this [link](https://brew.sh/) and follow the documentation.
You can install yarn through the Homebrew package manager. This will also install Node.js if it is not already installed.
```
brew install yarn
```
If you use "nvm" or similar, you should exclude installing Node.js so that the "nvm" version of Node.js is used.
```
brew install yarn --without-node
```
Test that yarn and node are installed by running:
```
yarn --version
node -v
```

#### Installing npm
npm is distributed with Node.js, which means that when you download Node.js, you automatically get npm installed on your computer. To update it, run
```
npm install npm@latest -g
```
Check that npm has been installed by running this in terminal
```
npm -v
```
You need at least `npm v5.3.0` and `node v8.3.0` to proceed.

#### Installing Truffle and Ganache
```
npm install -g truffle
```
```
npm install -g ganache-cli
```

#### Installing MongoDB

*Note: installing mongo locally is now optional, ping [Sarah](https://github.com/ana0) for the needed env vars*

Open terminal and enter
```
brew update
brew install mongodb
```
Create a default "db" directory to store the Mongo data files by running
```
mkdir -p /data/db
```
To initialise the Mongo shell, run `mongod`.
To run the Mongo shell, run `mongo`.  
To exit the Mongo shell, run `quit()`.  

#### Installing the IPFS daemon

We use IPFS (more information about this alternative to http found [here](https://ipfs.io/#why)) because ...

Update your packages and make sure that you have a version of Go beyond 1.7.0
```
brew update
brew install golang
```
To check that the Go language has downloaded successfully, run
```
go version
```
To get the ipfs daemon running, run the following in terminal
```
go get -u -d github.com/ipfs/go-ipfs
```
Then cd into the directory where `go-ipfs` was downloaded.  
Once you have done this, in terminal, run
```
make install
```
If `make install` doesn't work, install from a pre-built package following the documentation [here](https://ipfs.io/docs/install/).
```
brew install ipfs
```
Initialize the daemon by entering
```
ipfs init
```
You will see a command asking you to enter a
Enter the command they say starting with
```
ipfs cat /ipfs/
```
To test that it is working, run
```
ipfs help
```
Run the following lines to ensure everything will work properly:
```
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'
```
#### Installing MetaMask
Go to [this](https://metamask.io/) site in your Google Chrome browser.



### Installing the Prerequisites for Linux
Note that it is essential to have all of these softwares before proceeding with the installation of the Distribute Protocol.

#### Installing Node.js and npm

``npm`` is bundled with Node.js, so you only need to install Node.js.   

**Node.js** - detailed download details for different Linux distros from [here](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions))

To install Node.js 7.x on Ubuntu 16.04, run the following commands:
```
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs
```
Verify the installation of npm is successful:
```
npm -v
node -v
```
You need at least ```npm v5.3.0``` and ```node v8.3.0``` to proceed.

#### Installing yarn

_On Debian/Ubuntu_  
First, configure the repository for download.
```
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
```
Then, simply:
```
sudo apt-get update && sudo apt-get install yarn
```
Test that Yarn has been successfully installed by running
```
yarn --version
```
#### Installing truffle and ganache
Run:
```
npm install -g truffle
npm install -g ganache-cli
```
#### Installing mongoDB
Please remember to make sure that you are running `glibc 2.23`. To make sure, run `ldd --version` in terminal to check.

Follow the steps from the [following manual.](https://hevodata.com/blog/install-mongodb-on-ubuntu/).

#### Installing the IPFS daemon
We use IPFS (more information about this alternative to http found [here](https://ipfs.io/#why)) because ...

Update your packages and make sure that you have a version of Go beyond 1.7.0
```
sudo apt-get update
sudo apt-get install golang-go -y
```

Get the tarball from the web, then untar it.
```
wget https://dist.ipfs.io/go-ipfs/v0.4.10/go-ipfs_v0.4.10_linux-386.tar.gz
tar xvfz go-ipfs_v0.4.10_linux-386.tar.gz
```

Move the `ipfs` binary in your local path.
```
sudo mv go-ipfs/ipfs /usr/local/bin/ipfs
```

To test that it is working, run
```
ipfs help
```
Run the following lines to ensure everything will work properly:
```
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'
```

#### Installing MetaMask

Go to [this](https://metamask.io/) site in your Google Chrome browser.


### Installing the Distribute Protocol
Note that all of these steps _must_ be carried out before sending any transactions on distribute.

*Step 1:*    
Clone this repository to your machine and add the contracts repository as a submodule. This will give you access to all the frontend, server, and contract code you will need from both repositories.
```
git clone https://github.com/distribute-protocol/distribute-app.git
cd distribute-app
git rm .gitmodules contracts
git submodule add https://github.com/distribute-protocol/distribute-contracts.git contracts
git submodule add git@github.com:distribute-protocol/abis.git server/abi/build
git submodule add git@github.com:distribute-protocol/abis.git frontend/src/abi/build
git submodule update --init --recursive
```
If you receive the error that `'frontend/src/abi/build' already exists in the index` then you can move to the next command
Updating submodules can be achieved easily from the root folder using
```
git submodule foreach git pull origin master
```

*Step 2:*    

`cd server` and install the node modules and dependencies from the `package.json` file.

```
yarn
```

Then `cd ../frontend` and install dependencies with `yarn`.  

Alternately, you can do these steps with docker:

To do this, make sure docker is installed, then from the server subdirectory:

```
sudo docker build .
```
If this is successful, the container will build and log the output of each build step, eventually ending with something like `Successfully built <exampleBuildId>`

Start the container with

```
sudo docker run -p 3001:3001 --network "host" <exampleBuildId>
```
The process for the front end is the same, but should be done from the `frontend` subdirectory, and the port that should be mapped is `3000`.  

You can stop the containers at any time with 

```
sudo docker stop <exampleBuildId>
```

*Step 3*:   
Open a new terminal window and run
```
ganache-cli
```
This will deploy a local blockchain with 10 accounts, each preloaded with 100 ether.

*Step 4:*   
Open and sign in to MetaMask in your Google Chrome browser.
Open MetaMask. From the dropdown menu at the top, select the `Localhost 8545` network. Then, click your account name. This will automatically copy your address to clipboard.

**Remember to reset this account every time you run `ganache-cli`.**  
To reset the account, confirm that you are on Localhost 8545, then navigate to Settings by clicking on your account image at the top right. Scroll down and select "Reset Account". This forces MetaMask to believe that this network ID is a clean network in a fresh state (**ordinary users of MetaMask should never have to do this!**).

*Step 5:*   
In a new terminal window, navigate to the `contracts` folder you cloned from GitHub in Step 1. Deploy it to the local blockchain running in ganache by running:
```
cd contracts
truffle migrate --network app
```
Then enter the Truffle console.
```
truffle console
```
Send ether from your local blockchain to your account in MetaMask by running the following in `truffle console`:
```
web3.eth.sendTransaction({to:'<MetaMask_address>', from: web3.eth.accounts[<i>], value: web3.toWei(90, 'ether')})
```
NOTE:   
For <MetaMask_address\>: Paste (Ctrl-Shift-V) the address you copied to clipboard in step 4.  
For <i\>: Type any number between 0 and 9. This is a reference to the 10 accounts in your locally running 10 accounts.

*Step 6:*
In a new terminal window, clear your database by running
```
mongo
use distribute
show collections

Then for each collection:

db.<collectionName>.drop()
```
*Step 7*:   
You are now ready to take Distribute Protocol online. Open another terminal window. Run
```
ipfs daemon
```
Wait for the following three lines to appear.
```
Initializing daemon...
API server listening on /ip4/127.0.0.1/tcp/5001
Gateway server listening on /ip4/127.0.0.1/tcp/8080
```
*Step 8:*   
mongoDB must be running before this step.  
cd into `distribute-app/server`, then install the necessary node modules and start up the server by running
```
yarn
yarn start
```
The server should be running at localhost 3001.

*Step 9:*  
Your MetaMask account needs to be on localhost 8545, and reset (as described in Step 2 if it has been used before).
cd into `distribute-app/frontend`, then install the necessary node modules and start up the frontend by running
```
yarn
yarn start
```
The frontend should open up in a browser tab and be running on localhost 3000. Make sure that it runs on a browser that has the MetaMask extension installed.

### Running the services with docker-compose
After running yarn in the contract, frontend and server, you can use one command to start all the remaining services that is docker-compose
First you will need to run:
```
docker volume create mongodbdata
```
Alternately, the services can be run with docker-compose. Before doing so, you must set up the gitmodules and `yarn` or `npm i` in both `frontend` and `server` subdirectories, then you should be able to start the services with 
```
docker-compose up
```
*Note: the docker-compose file assumes a remote mongo instance is being used and that the connection string for it is set in the server `.env`.*

### Known Issues

*Mongo Fails to Start:*       
If mongo fails to start when running `mongo` in a terminal window, open a new terminal tab and run
```
mongod
```
leave that process running, then run
```
mongo
```
in the original terminal window.

*Localhost Already in Use:*    
When starting the server, if it does not start up and returns `error="listen tcp :3001: bind: address already in use"` then you will need to terminate whatever process is on port 3001. To do that, run
```
lsof -i :3001
```
see the engine running on port 3001 and kill the process.

`lsof -i :3001` returns something of this form:
```
COMMAND     PID   USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
enginepro 28813 Ariana    4u  IPv6 0xe86d79c77aad86ad      0t0  TCP *:redwood-broker (LISTEN)
```
To kill the process above, copy the `PID` number and run
```
kill 28813
```
Then the server should be able to start normally.   

*Javascript Out of Memory:*    
After running the frontend for an extended period of time, the process may occasionally quit and return an `Out of Memory` error. To restart the frontend, run `yarn start` in the same terminal window. No extra precautions need to be taken.

*ENOSPC error: Run*
If the frontend fails to run with `exit code 1` and returns `ENOSPC error: run`, run
```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```
in the same terminal window.

## Authors
Ashoka Finley (ashoka [dot] finley [at] consensys [dot] net)  
Jessica Marshall (jessica [dot] marshall [at] consensys [dot] net)
