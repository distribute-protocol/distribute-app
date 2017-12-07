const {getEthPriceNow,getEthPriceHistorical}= require('./index');

//example use

getEthPriceNow()
.then( data => {
  console.log(data);
});

//indicate the number of days, default 7
getEthPriceHistorical(2)
.then( data => {
  console.log(data);
});
