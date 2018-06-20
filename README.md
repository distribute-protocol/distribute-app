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
Check that npm has been installed by typing this in terminal
```
npm -v
```
You need at least `npm v5.3.0` and `node v8.3.0` to proceed.

#### Installing Truffle
```
npm install -g truffle
```
#### Installing MongoDB
Open Terminal and enter
```
brew update
brew install mongodb
```
Create a default "db" directory to store the Mongo data files by running
```
mkdir -p /data/db
```
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
To get the ipfs daemon running, type the following in Terminal
```
go get -u -d github.com/ipfs/go-ipfs
```
Then cd into the directory where `go-ipfs` was downloaded.  
Once you have done this, in Terminal, type
```
make install
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
To test that it is working, type
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
#### Installing truffle
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

To test that it is working, type
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
git rm .gitmodules contracts
git submodule add https://github.com/distribute-protocol/distribute-contracts.git contracts
git submodule update --init --recursive
```

*Step 2:*    
In `distribute-app` (you should not have to change folders), install the node modules and dependencies from the `package.json` file.

```
yarn
```
*Step 3*:   
Open a new terminal window. Type
```
ganache-cli
```
This will deploy a local blockchain with 10 accounts, each preloaded with 100 ether.

*Step 4:*   
Open and sign in to MetaMask in your Google Chrome browser.
From the dropdown menu at the top, select the `Localhost 8545` network. Click the three dots and select "Copy Address to Clipboard".

**Remember to reset this account every time you run `ganache-cli`.**  
To reset the account, confirm that you are on Localhost 8545, then navigate to Settings from the three bars on the top right. Scroll down and select "Reset Account". This forces MetaMask to believe that this network ID is a clean network in a fresh state (**ordinary users of MetaMask should never have to do this!**).

*Step 5:*   
In a new Terminal window, navigate to the `contracts` folder you cloned from GitHub in Step 1. Deploy it to the local blockchain running in ganache by typing:
```
cd contracts
truffle migrate
```
Then enter the Truffle console.
```
truffle console
```
Send ether from your local blockchain to your account in MetaMask by typing the following in `truffle console`:
```
web3.eth.sendTransaction({to:'<MetaMask_address>', from: web3.eth.accounts[<i>], value: web3.toWei(90, 'ether')})
```
NOTE:   
For <MetaMask_address\>: Paste (Ctrl-Shift-V) the address you copied to clipboard in step 4.  
For <i\>: Type any number between 0 and 9. This is a reference to the 10 accounts in your locally running 10 accounts.

*Step 6:*
In another Terminal window, clear your database by typing:
```
mongo
use distribute
db.dropDatabase()
```
*Step 7*:   
You are now ready to take Distribute Protocol online. Open another Terminal window. Run
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
Cd into `distribute-app/server`, then install the necessary node modules and start up the server by typing:
```
npm install
npm start
```
The server should be running at localhost 3001.

*Step 9:*  
Your MetaMask account needs to be on localhost 8545, and reset (as described in Step 2 if it has been used before).
Cd into `distribute-app/frontend`, then install the necessary node modules and start up the frontend by typing:
```
yarn
yarn start
```
The frontend should open up in a browser tab and be running on localhost 3000. Make sure that it runs on a browser that has the MetaMask extension installed.

## Authors
Ashoka Finley (ashoka [dot] finley [at] consensys [dot] net)  
Jessica Marshall (jessica [dot] marshall [at] consensys [dot] net)
