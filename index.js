var ngsi = require('./lib/NGSI.js');


/*
Las pruebas 

*/


//console.log(ngsi.detectType("Hola"))
//console.log(ngsi.detectType(4.5))
console.log(ngsi.detectType("geo:line", {}))
/*console.log(ngsi.parseEntity({
	id : 'room1',
	type : 'room',
	temperature : 45,
	humidity: 34,
	name: 'daniel'
}))*/

