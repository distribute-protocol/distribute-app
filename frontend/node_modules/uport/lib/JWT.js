'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IAT_SKEW = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createJWT = createJWT;
exports.verifyJWT = verifyJWT;

var _jsontokens = require('jsontokens');

var _mnid = require('mnid');

var _base64url = require('base64url');

var _base64url2 = _interopRequireDefault(_base64url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var JOSE_HEADER = { typ: 'JWT', alg: 'ES256K' };

function encodeSection(data) {
  return _base64url2.default.encode(JSON.stringify(data));
}

var ENCODED_HEADER = encodeSection(JOSE_HEADER);

var LEGACY_MS = 1000000000000;

var IAT_SKEW = exports.IAT_SKEW = 60;

/**  @module uport-js/JWT */

/**
*  Creates a signed JWT given an address which becomes the issuer, a signer, and a payload for which the signature is over.
*
*  @example
*  const signer = SimpleSigner(process.env.PRIVATE_KEY)
*  createJWT({address: '5A8bRWU3F7j3REx3vkJ...', signer}, {key1: 'value', key2: ..., ... }).then(jwt => {
*      ...
*  })
*
*  @param    {Object}            [config]           an unsigned credential object
*  @param    {String}            config.address     address, typically the uPort address of the signer which becomes the issuer
*  @param    {SimpleSigner}      config.signer      a signer, reference our SimpleSigner.js
*  @param    {Object}            payload            payload object
*  @return   {Promise<Object, Error>}               a promise which resolves with a signed JSON Web Token or rejects with an error
*/
function createJWT(_ref, payload) {
  var address = _ref.address,
      signer = _ref.signer;

  var signingInput = [ENCODED_HEADER, encodeSection(_extends({ iss: address, iat: Math.floor(Date.now() / 1000) }, payload))].join('.');

  return new Promise(function (resolve, reject) {
    if (!signer) return reject(new Error('No Signer functionality has been configured'));
    if (!address) return reject(new Error('No application identity address has been configured'));
    return signer(signingInput, function (error, signature) {
      if (error) return reject(error);
      resolve([signingInput, signature].join('.'));
    });
  });
}

/**
*  Verifies given JWT. Registry is used to resolve uPort address to public key for verification.
*  If the JWT is valid, the promise returns an object including the JWT, the payload of the JWT,
*  and the profile of the issuer of the JWT.
*
*  @example
*  const registry =  new UportLite()
*  verifyJWT({registry, address: '5A8bRWU3F7j3REx3vkJ...'}, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJyZXF1Z....').then(obj => {
*      const payload = obj.payload
*      const profile = obj.profile
*      const jwt = obj.jwt
*      ...
*  })
*
*  @param    {Object}            [config]           an unsigned credential object
*  @param    {String}            config.address     address, typically the uPort address of the signer which becomes the issuer
*  @param    {UportLite}         config.registry    a uPort registry, reference our uport-lite library
*  @param    {String}            jwt                a JSON Web Token to verify
*  @param    {String}            callbackUrl        callback url in JWT
*  @return   {Promise<Object, Error>}               a promise which resolves with a response object or rejects with an error
*/
function verifyJWT(_ref2, jwt) {
  var registry = _ref2.registry,
      address = _ref2.address;
  var callbackUrl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  return new Promise(function (resolve, reject) {
    var _decodeToken = (0, _jsontokens.decodeToken)(jwt),
        payload = _decodeToken.payload;

    registry(payload.iss).then(function (profile) {
      if (!profile) return reject(new Error('No profile found, unable to verify JWT'));
      var publicKey = profile.publicKey.match(/^0x/) ? profile.publicKey.slice(2) : profile.publicKey;
      var verifier = new _jsontokens.TokenVerifier('ES256K', publicKey);
      if (verifier.verify(jwt)) {
        if (payload.iat >= LEGACY_MS && payload.iat > Date.now() + IAT_SKEW * 1000 || payload.iat < LEGACY_MS && payload.iat > Date.now() / 1000 + IAT_SKEW) {
          return reject(new Error('JWT not valid yet (issued in the future): iat: ' + payload.iat + ' > now: ' + Date.now() / 1000));
        }
        if (payload.exp && payload.exp >= LEGACY_MS && payload.exp <= Date.now() || payload.iat < LEGACY_MS && payload.exp <= Date.now() / 1000) {
          return reject(new Error('JWT has expired: exp: ' + payload.exp + ' < now: ' + Date.now() / 1000));
        }
        if (payload.aud) {
          if (payload.aud.match(/^0x[0-9a-fA-F]+$/) || (0, _mnid.isMNID)(payload.aud)) {
            if (!address) {
              return reject(new Error('JWT audience is required but your app address has not been configured'));
            }

            var addressHex = (0, _mnid.isMNID)(address) ? (0, _mnid.decode)(address).address : address;
            var audHex = (0, _mnid.isMNID)(payload.aud) ? (0, _mnid.decode)(payload.aud).address : payload.aud;
            if (audHex !== addressHex) {
              return reject(new Error('JWT audience does not match your address: aud: ' + payload.aud + ' !== yours: ' + address));
            }
          } else {
            if (!callbackUrl) {
              return reject(new Error('JWT audience matching your callback url is required but one wasn\'t passed in'));
            }
            if (payload.aud !== callbackUrl) {
              return reject(new Error('JWT audience does not match the callback url: aud: ' + payload.aud + ' !== url: ' + callbackUrl));
            }
          }
        }
        resolve({ payload: payload, profile: profile, jwt: jwt });
      } else {
        return reject(new Error('Signature invalid for JWT'));
      }
    }).catch(reject);
  });
}

exports.default = { createJWT: createJWT, verifyJWT: verifyJWT };