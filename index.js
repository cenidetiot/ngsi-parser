var ngsi = require('./lib/NGSI.js');


/*
Las pruebas 

*/


var metadata  = ngsi.parseJSON({
	accuracy : 0.8
})

console.log(metadata)

console.log(JSON.stringify(ngsi.parseEntity('Room', 'Room1',{
	temperature : 50,
	humidity: {
		value : 60,
		metadata : {
			acurrency : 20,
			telego : "ok"
		}
	},
	modification : { 
		type : "DateTime",
		value : "Fechasss"
	},
	location: {
	    "value": "41.3763726, 2.186447514",
	    "type": "geo:point"
	  }

})))

