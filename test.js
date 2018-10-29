var ngsi  =  require("./lib/NGSI")

//ngsi.createQuery(0) // Expected JSON
//ngsi.createQuery({}) // OK

//ngsi.parseEntity(0) // Expected JSON
//ngsi.parseEntity({}) // Missing id
//ngsi.parseEntity({id : "Room.*"}) // Missing type
ngsi.parseEntity({id : "Room.*", type : "Room"}) // OK
//ngsi.parseEntity({id : "Room.*", type : "Room", other : undefined}) // Data Type not supported, please check the Data Types Supported in https://ngsi-js-library.readthedocs.io/en/latest/ngsi/

//ngsi.parseAttrs({
  //  attr : undefined
//})// Data Type not supported, please check the Data Types Supported in https://ngsi-js-library.readthedocs.io/en/latest/ngsi/
//ngsi.parseAttrs(0) // Expected JSON
ngsi.parseAttrs({}) //OK

//ngsi.parseValue(undefined)// Data Type not supported, please check the Data Types Supported in https://ngsi-js-library.readthedocs.io/en/latest/ngsi/
ngsi.parseValue("ok")



// Schema

//Attribute X not found in the model
//The allOf atribute should be Array
//The definition atribute should be JSON
//The model is malformed need allOf or definition properties
//The model does not comply with the required attribute options
//The oneOf atribute should be Array
//The attribute X is required
//The model is malformed need oneOf or required properties
//Actualy the only the refs supported are GSMA, Location and PhysicalObject commons

//Attributes
// X = Entity atribute value
// A = Schema attribute 

//Error type not match X
//Error format in date X
//Error the minLength is A.minLength in X
//Error the maxLength is A.maxLength in X
//Error the maximum is A.maximunm in X
//Error the minimun is A.minimum in X
//Error the minItems A.length
//Error X not found in the list

