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

*/
/*let coords = [
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


var AlertScheema = {
	 "allOf": [
	  {
		"properties": {
//------------------------------------------
		"id": {
				"type": "string"
			},
		"location":{
			"type" : "object"
		},
//-------------------------------------------
		  "description": {
			"type": "string"
		  },
		  "dateObserved": {
			"type": "string",
			"format": "date-time"
		  },
		  "validFrom": {
			"type": "string",
			"format": "date-time"
		  },
		  "validTo": {
			"type": "string",
			"format": "date-time"
		  },
		  "severity": {
			"type": "string",
			"enum": [
			  "informational",
			  "low",
			  "medium",
			  "high",
			  "critical"
			]
		  },
		  "category": {
			"type": "string",
			"enum": [
			  "traffic",
			  "weather",
			  "environment",
			  "health",
			  "security"
			]
		  },
		  "subCategory": {
			"type": "string",
			"enum": [
			  "trafficJam",
			  "carAccident",
			  "carWrongDirection",
			  "carStopped",
			  "pothole",
			  "roadClosed",
			  "roadWorks",
			  "hazardOnRoad",
			  "injuredBiker",
			  "rainfall",
			  "highTemperature",
			  "lowTemperature",
			  "heatWave",
			  "ice",
			  "snow",
			  "wind",
			  "fog",
			  "flood",
			  "tsunami",
			  "tornado",
			  "tropicalCyclone",
			  "hurricane",
			  "asthmaAttack",
			  "bumpedPatient",
			  "fallenPatient",
			  "heartAttack",
			  "suspiciousAction",
			  "robbery",
			  "assault"
			]
		  },
		  "alertSource": {
			"oneOf": [
			  {
				"type": "string",
				"format": "uri"
			  },
			  {
				"type": "number",
				"format": "uri"
			  }
			]
		  },
		  "data": {
			"type": "object"
		  },
		  "type": {
			"type": "string",
			"enum": [
			  "Alert"
			],
			"description": "NGSI Entity type"
		  }
		}
	  }
	],

	"oneOf": [
	  {
		"required": [
		  "id",
		  "type",
		  "location",
		  "alertSource",
		  "category",
		  "dateObserved"
		]
	  },
	  {
		"required": [
		  "id",
		  "type",
		  "address",
		  "alertSource",
		  "category",
		  "dateObserved"
		]
	  }
	]
  }


var alert = {

	id: "Alert:Device_Smartphone_7a85d9df7209b8bc:1519086635021",
	type: "Alert",
	alertSource: 40,
	category: "Traffic",
	dateObserved: "2018-02-20T00:30:35.00Z",
	description: "prueba dani",
	location: {
		type : "geo:point",
		value : "18.81186166666667 ,-98.96342000000001"
	},
	severity: "medium",
	subCategory: "Car Accident",
	validFrom: "2018-02-20T00:30:35.00Z",
	validTo: "2018-02-20T00:30:35.00Z"
}

verifySchema(AlertScheema, alert)

function verifyAttr (schemaAttr , attr ) {
	var correctType = false ; 
	if (schemaAttr.type === typeof attr){
		correctType = true;
	}else {
		if(schemaAttr["oneOf"] !== undefined){
			schemaAttr["oneOf"].map((item) => {
				if(item.type === typeof attr){
					correctType = true
				}
			})
		}else{
			correctType = false ; 
		}
	}	
	return correctType ;
}
function verifySchema (Schema, Entity) {
	/* Verificamos si existe en los atributos añadidos en el equema*/
	for (attr in Entity){
		let exist = false;
		if (AlertScheema.allOf[0].properties[attr] !== undefined){
			var verification = verifyAttr(AlertScheema.allOf[0].properties[attr], Entity[attr])
			console.log("The atrr has a correctly type " + attr, verification)
		}else{
			console.log("No Existe en el schema " + attr)
		}
	}	
}




