var ngsi = require('./lib/NGSI.js');



console.log("EJEMPLO ENTITY")
console.log(JSON.stringify(ngsi.parseEntity('Room', 'Room1',{
		temperature : {
			value : 50 ,
			metadata : {
				frecuency: 40,
				scale: 'Celsious'
			}
		},
		dateStamp : new Date()
	})))

console.log("EJEMPLO PARA updateEntityAttrs")
console.log(JSON.stringify(ngsi.parseAttrs({
	temperature : {
		value : 50,
		metadata :{
			frecuency : 50,
			scale: 'Fahrenheit'
		}
	}
})))

console.log("EJEMPLO PARA updateJSONAttrEntity")

console.log(ngsi.parseValue(50))




//console.log(ngsi.parseValue("text"))