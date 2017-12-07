'use strict';
const popsicle = require('popsicle');
const defaultCurrencies = 'BTC,USD,EUR,AUD,CHF,CAD,GBP';

const getEthPriceNow= toSymbol => {
	let now = new Date().getTime();
	let ts =  new Date(now);

	// params
	if (typeof toSymbol === 'string') {
		toSymbol = toSymbol.toUpperCase();
	} else {
		toSymbol = defaultCurrencies;
	}

	return popsicle.request({
		method: 'POST',
		url: 'https://min-api.cryptocompare.com/data/price',

		query: {
			fsym: 'ETH',
			tsyms: toSymbol,
      		sign: true
		}
	})
		.use(popsicle.plugins.parse(['json']))
		.then(resp => resp.body)
		.then(data => {
			//format  ts : data 
			let rtn = {}
			rtn[ts] = { 'ETH': data};
			return rtn});

};


const getEthPriceHistorical= (n,toSymbol) => {
	var days = n || 7;
    if (typeof toSymbol === 'string') {
       toSymbol = toSymbol.toUpperCase();
    } else {
        toSymbol = defaultCurrencies;
    }
    
	return Promise.all(Array.from({length:days}).map((unused, i) => {
        
		let ts =  new Date(new Date().getTime() - (24*(i+1) * 60 * 60 * 1000));
        
		return popsicle.request({
           method: 'POST',
           url: 'https://min-api.cryptocompare.com/data/pricehistorical',

           query: {
            fsym: 'ETH',
            tsyms: toSymbol,
            timestamp: ts
           }
       })
         .use(popsicle.plugins.parse(['json']))
         .then(resp => resp.body)
         .then(data => {
            // const symbols = Object.keys(data);
            return {ts, data};
        });
    })).then(results => results.reduce((result, {ts, data}) => {
        result[ts] = data;
        return result;
    }, {}));
}


exports.getEthPriceNow = getEthPriceNow;
exports.getEthPriceHistorical = getEthPriceHistorical;
