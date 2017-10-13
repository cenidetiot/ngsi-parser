var ngsi = require('./lib/NGSI.js');

console.log("*************************parserEntity**************************************\n")

console.log(ngsi.parseEntity({
		id : "Room",
		type : "Room1",
		/*temperature : {
			value : 50 ,
			metadata : {
				frecuency: 40,
				scale: 'Celsious'
			}
		},
		dateStamp : new Date(),
		json : {
			ok : 40
		},*/
		location : [ [0,1], [2,3]]
	}))

console.log("****************  parseAttrs Example ***********************************\n")
console.log(ngsi.parseAttrs({
	temperature : {
		value : 50,
		metadata :{
			frecuency : 50,
			scale: 'Fahrenheit'
		}
	}
}))

console.log("*******************parseValue Example ********************\n")

console.log(ngsi.parseValue({ ok : 20}))

