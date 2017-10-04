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
		acurrency : 50
	}
}).then((update) => {
	console.log(update)
}).catch((err) =>{
	console.log(err)
})
