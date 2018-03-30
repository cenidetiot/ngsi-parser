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

let err = ngsi.verifyModel(require('./AlertSchema.json'), alert)

/*if (err.length > 0){
	console.log("La entidad no cumple con el squema del modelo")
}else {
	console.log("La entidad  cumple con el esquema del modelo")
}*/










