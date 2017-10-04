var ngsi = require('./lib/NGSI.js');


/*
Las pruebas 

*/


var metadata  = ngsi.parseJSON({
	accuracy : 0.8
})

console.log(metadata)

console.log(ngsi.parseEntity('Room', 'Room1',{
	temperature : 50,
	humidity: {
		value : 60,
		metadata : {
			acurrency : 20,
			telego : "ok"
		}
	},
	modification : { type : "DateTime",value : "Fecha"} 
}))

//console.log(ngsi.detectType("Hola"))
//console.log(ngsi.detectType(4.5))
//console.log(ngsi.detectType("geo:line", {  }))
/*console.log(ngsi.parseEntity({
	id : 'room1',
	type : 'room',
	temperature : 45,
	humidity: 34,
	name: 'daniel'
}))*/

