var ngsi = require('./lib/NGSI.js');


/*
Las pruebas 

*/
var d = new Date();
var n = d.toISOString();
var json = {}
console.log(d.toString())
console.log(n)
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
		value : new Date()
	},
	location: {
	    value: [
	      "40.63913831188419, -8.653321266174316",
	      "40.63881265804603, -8.653149604797363"
	    ],
	    type: "geo:box"
	  }
})))
console.log("PASSS")
console.log(ngsi.parseJSON({
	value : d,
	metadata : {
		acurrency : 50
	}
}))

