var ngsi = require('./lib/NGSI.js');
var AlertModel = require('./ModelsExamples/AlertModel.json')
var OffStreetParking = require('./ModelsExamples/OffStreetParking.json')

// Agregar definiciones oficiales
AlertModel["allOf"].push(ngsi.GSMA)
AlertModel["allOf"].push(ngsi.Location)
//AlertModel["allOf"].push(ngsi.PhysicalObject)


//Agregar un solo atributo de una definición oficial
AlertModel["allOf"][0]["properties"]["alertSource"]["oneOf"].push(ngsi.GSMA.properties.id)
var alert = { 
	id: "Alert:Device_Smartphone_7a85d9df7209b8bc:1519086635021",
	type: "Alert",
	alertSource: "22",
	category: "traffic",
	dateObserved: new Date(),
	description: "prueba dani",
	location: {
		type : "geo:point",
		value : "18.81186166666667 ,-98.96342000000001"
	},
	severity: "medium",
	subCategory: "carAccident",
	validFrom: new Date(),
	validTo: new Date(),
	dateCreated : new Date()
}

/*if (ngsi.verifyModel(AlertModel, alert)){
	console.log("Entidad Alert cumple con el modelo")
	//console.log(ngsi.parseEntity(alert))
}*/

OffStreetParking["allOf"].push(ngsi.GSMA)
OffStreetParking["allOf"].push(ngsi.Location) 

OffStreetParking["allOf"][0]["properties"]["refParkingAccess"] = ngsi.GSMA.properties.id
OffStreetParking["allOf"][0]["properties"]["refParkingGroup"] = ngsi.GSMA.properties.id
OffStreetParking["allOf"][0]["properties"]["refParkingSpot"] = ngsi.GSMA.properties.id

let OffStreetParkingEntity = {
	"id": "porto-ParkingLot-23889",
	"type": "OffStreetParking",
	"name": "Parque de estacionamento Trindade",
	"category": ["underground", "public", "feeCharged", "mediumTerm", "barrierAccess"],
	"chargeType": ["temporaryPrice"],
	"requiredPermit": [],
	"layout": ["multiLevel"],
	//"maximumParkingDuration": "PT8H",
	"location": {
	  "coordinates": [-8.60961198807, 41.150691773],
	  "type": "Point"
	},
	"allowedVehicleType": ["car"],
	"totalSpotNumber": 414,
	"availableSpotNumber": 132,
	"address": {
	  "streetAddress": "Rua de Fernandes Tomás",
	  "addressLocality": "Porto",
	  "addressCountry": "Portugal"
	},
	"description": "Municipal car park located near the Trindade metro station and the Town Hall",
	"dateModified": "2016-06-02T09:25:55.00Z"
}
//ngsi.verifyModel(OffStreetParking,OffStreetParkingEntity)
if(ngsi.verifyModel(require('./AlertSchema.json'), alert)){
	console.log("EL modelo cumple ")
}








