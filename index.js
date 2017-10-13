var ngsi = require('./lib/NGSI.js');

console.log("*************************parserEntity**************************************\n")

console.log(JSON.stringify(ngsi.parseEntity({
		id : "Room",
		type : "Room1",
		temperature : {
			value : 50 ,
			metadata : {
				frecuency: 40,
				scale: 'Celsious'
			}
		},
		dateStamp : new Date,
		ajson : {
			type : "StructuredValue",
			value : {
				jsonvalue : 34
			}
		}		
	})))

console.log("****************  parseAttrs Example ***********************************\n")
console.log(JSON.stringify(ngsi.parseAttrs({
	temperature : {
		value : 50,
		metadata :{
			frecuency : 50,
			scale: 'Fahrenheit'
		}
	}
})))

console.log("*******************parseValue Example ********************\n")

console.log(ngsi.parseValue(50.5))

