var ngsi = require('./lib/NGSI.js');
var AlertModel = require('./ModelsExamples/AlertModel.json')
var AirQualityObserved = require('./ModelsExamples/AirQualityObserved.json')

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

if (ngsi.verifyModel(AlertModel, alert)){
	console.log("Entidad Alert cumple con el modelo")
	//console.log(ngsi.parseEntity(alert))
}

let AirQualityObservedEntity = {
	"id": "Madrid-AmbientObserved-28079004-2016-03-15T11:00:00",
	"type": "AirQualityObserved",
	"address": {
	  "addressCountry": "ES",
	  "addressLocality": "Madrid",
	  "streetAddress": "Plaza de España"
	},
	"dateObserved": "2016-03-15T11:00:00/2016-03-15T12:00:00",
	"location": {
	  "type": "Point",
	  "coordinates": [-3.712247222222222, 40.423852777777775]
	},
	"source": "http://datos.madrid.es",
	//"precipitation": 0,
	//"relativeHumidity": 0.54,
	//"temperature": 12.2,
	//"windDirection": 186,
	//"windSpeed": 0.64,
	"airQualityLevel": "moderate",
	"airQualityIndex": 65,
	"reliability": 0.7,
	//"CO": 500,
	//"NO": 45,
	//"NO2": 69,
	//"NOx": 139,
	//"SO2": 11,
	//"CO_Level": "moderate",
	"refPointOfInterest": "28079004-Pza.deEspanya"
  }


AirQualityObserved["allOf"].push(ngsi.GSMA)
AirQualityObserved["allOf"].push(ngsi.Location) 

AirQualityObserved["allOf"][0]["properties"]["refDevice"] = ngsi.GSMA.properties.id
AirQualityObserved["allOf"][0]["properties"]["refPointOfInterest"] = ngsi.GSMA.properties.id
AirQualityObserved["allOf"][0]["properties"]["refWeatherObserved"] = ngsi.GSMA.properties.id


ngsi.verifyModel(AirQualityObserved,AirQualityObservedEntity)





//console.log(ngsi.verifyModel(AlertModel1, alert))








