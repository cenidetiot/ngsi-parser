var ngsi = require('./lib/NGSI.js');


/*
console.log("*************************parserEntity**************************************\n")

console.log(ngsi.parseEntity({
		id : "Room",
		type : "Room1",
		temperature : {
			value : 50 ,
			metadata : {
				frecuency: 40,
				scale: 'Celsious'
			}
		},
		dateStamp : new Date(),
		json : {
			ok : 40
		},
		location : {
			value :[ 0, 0],
			type: "geo:point"
		}

	}))
*/
/*
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


let coords = [
	[18.876992,-99.220316,],
	[18.876789,-99.219189,],
	[18.876545,-99.219243,],
	[18.875611,-99.21972,],
	[18.875708,-99.219897,],
	[18.875809,-99.22008,],
	[18.875906,-99.220171,],
	[18.876073,-99.220187,],
	[18.876342,-99.220171,],
	[18.876596,-99.220262,],
	[18.876743,-99.22031,],
	[18.876992,-99.220316,],
	]

let query = ngsi.createQuery({
	"id":"Alert:Device_Smartphone_.*",
	"type":"Alert",
	"options":"keyValues",
	"dateObserved" : ">=2018-02-20T16:54:03.931-06:00"
	})
console.log(query)
*/

var AlertModel = require('./ModelsExamples/AlertModel1.json')

var AlertModel1 = require('./ModelsExamples/AlertModel2.json')

// "pattern": "^[\w\-\.\{\}\$\+\*\[\]`|~^@!,:\\]+$",

var alert = { 
	id: "Alert:Device_Smartphone_7a85d9df7209b8bc:1519086635021",
	type: "Alert",
	alertSource: 22,
	category: "traffic",
	dateObserved: "2018-02-20T00:30:35.00Z",
	description: "prueba dani",
	location: {
		type : "geo:point",
		value : "18.81186166666667 ,-98.96342000000001"
	},
	severity: "medium",
	subCategory: "carAccident",
	validFrom: "2018-02-20T00:30:35.00Z",
	validTo: "2018-02-20T00:30:35.00Z",
}



//ngsi.verifyModel(AlertModel1, alert) 



/**/



