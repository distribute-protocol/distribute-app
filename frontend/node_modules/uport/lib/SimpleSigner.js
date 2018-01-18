'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SimpleSigner;

var _jsontokens = require('jsontokens');

/**
*  The SimpleSigner returns a configured function for signing data. It also defines
*  an interface that you can also implement yourself and use in our other modules.
*
*  @example
*  const signer = SimpleSigner(process.env.PRIVATE_KEY)
*  signer(data, (err, signature) => {
*    ...
*  })
*
*  @param    {String}         privateKey    a private key
*  @return   {Function}                     a configured signer function
*/

function SimpleSigner(privateKey) {
  return function (data, callback) {
    var hash = _jsontokens.SECP256K1Client.createHash(data);
    var signature = _jsontokens.SECP256K1Client.signHash(hash, privateKey);
    callback(null, signature);
  };
}