import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

// window.addEventListener('load', function() {
//
// // Checking if Web3 has been injected by the browser (Mist/MetaMask)
//   if (typeof web3 !== 'undefined') {
//
//     // Use the browser's ethereum provider
//     var provider = window.web3.currentProvider
//
//   } else {
//     console.log('No web3? You should consider trying MetaMask!')
//   }
// })
