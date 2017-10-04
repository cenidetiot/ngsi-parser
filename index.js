var ngsi = require('./lib/NGSI.js');


ngsi.parseEntity('Room', 'Room1',{
	temperature : 50
}).then((jsonNgsi) => {
	console.log(jsonNgsi)
}).catch((err) => {
	console.log(err)
})

ngsi.parseUpdate({
	value : new Date(),
	metadata : {
		acurrency : 50,
		otracosa: "Todo chido"
	}
}).then((update) => {
	console.log(update)
}).catch((err) =>{
	console.log(err)
})

console.log(ngsi.parseValue("text"))