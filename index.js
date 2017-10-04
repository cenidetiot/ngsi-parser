var ngsi = require('./lib/NGSI.js');



console.log("EJEMPLO ENTITY")
console.log(ngsi.parseEntity('Room', 'Room1',{
	temperature : {
		value : 50 ,
		metadata : {
			uno: 40,
			dos: 56
		}
	}
	
}))

console.log("EJEMPLO PARA updateEntityAttrs")
console.log(JSON.stringify(ngsi.parseUpdate({
	temperature : {
		value : 50,
		metadata :{
			acurrency : 50,
			otro : 40
		}
	}
})))

console.log("EJEMPLO PARA updateJSONAttrEntity")

console.log(ngsi.parseValue(new Date))




//console.log(ngsi.parseValue("text"))