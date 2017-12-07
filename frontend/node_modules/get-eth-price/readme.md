## get-eth-price
A price checker returning the current ETH price in various currencies including BTC

## Install
```
npm install -S get-eth-price
```

## Require/Import + Usage
```js
const {getEthPriceNow,getEthPriceHistorical}= require('get-eth-price');


getEthPriceNow()
.then( data => {
  console.log(data);
});

//indicate the number of days, default 7
getEthPriceHistorical(2)
.then( data => {
  console.log(data);
});
/*
{ 'Thu Jun 15 2017 06:22:03 GMT+0200 (CEST)': 
   { ETH: 
      { BTC: 0.1377,
        USD: 336.8,
        EUR: 300.06,
        AUD: 491.13,
        CHF: 338.32,
        CAD: 473.65,
        GBP: 268.28 } } }
{ 'Wed Jun 14 2017 06:22:03 GMT+0200 (CEST)': 
   { ETH: 
      { BTC: 0.1383,
        USD: 341.3,
        EUR: 308.66,
        AUD: 496.58,
        CHF: 342.11,
        CAD: 471.93,
        GBP: 269.88 } },
  'Tue Jun 13 2017 06:22:03 GMT+0200 (CEST)': 
   { ETH: 
      { BTC: 0.1383,
        USD: 341.3,
        EUR: 308.66,
        AUD: 494.58,
        CHF: 342.11,
        CAD: 471.93,
        GBP: 269.88 } } }
*/
```

## Donations
email me for an ETH address to donate to

## License
MIT

## Possible improvements?
* Pull down historical data
* Control over exchange used
* Average of exchanges




## API
[CryptoCompare API](https://min-api.cryptocompare.com/)
