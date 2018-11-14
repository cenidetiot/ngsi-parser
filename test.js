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



// ERORRES DEL SCHEMA

/* ERRORES EN DEFINICION DE LOS ATRIBUTOS  */
//*The model is malformed need allOf or definition properties  // El atributo donde se encuentran las propiedades del schema deber ser allOf o definition
//*The allOf atribute should be Array  // Si el atributo principal es allOf pero no es de typo array
//The definition attribute should be JSON // Si el atributo principal es definition pero no es de tipo json
//*Attribute X not found in the model --- Existe un atributo que no se encuentra en el Schema

/* ERRORES EN DEFINICION DE LOS ATTRIBUTOS REQUERIDOS  */
//*The model is malformed need oneOf or required properties // El atributo principal de los campos requeridos debe ser un oneOf
//*The oneOf attribute should be Array   // Si el atributo principal oneOf pero no es de typo array
//*The attribute X is required --- Los atributos que son requeridos y no se encuentran
//The model does not comply with the required attribute options
//Actualy the only the refs supported are GSMA, Location and PhysicalObject commons

/* ERRORES EN EL VALOR DE LOS ATRIBUTOS  */
//Error type not match X
//Error format in date X
//Error the minLength is A.minLength in X
//Error the maxLength is A.maxLength in X
//Error the maximum is A.maximunm in X
//Error the minimun is A.minimum in X
//Error the minItems A.length
//Error X not found in the list

//ERRORS IN THE DEFINITION OF A SCHEMA

/* ********************************************* */
//*The schema is not well-defined, needs the property allOf or definition
//*The allOf property should be an array
//*The definition property should be a JSON 
//*The schema is not well-defined needs the property oneOf or required
//*The oneOf property should be an array
//*The schema does not fulfill with the required attribute: options
//*Currently, the analyzer only supports the common refs of GSMA, Location and PhysicalObject

/* ********************************************** */

// ERRORS IN THE DEFINITION OF A DATA MODEL

//*The attribute X is not a official attribute of the data model
//*The attribute X is required in the model definition 
//*Error in the type of X attribute
//*Error in the format date of X attribute
//For attributes type text:
//*Error: the minLength of X attribute is attribute.minLength
//*Error: the maxLength of X attribute is attribute.maxLength
//For attributes type number:
//Error: the maximum value of X attribute is attribute.maximum
//Error: the minimum value of X attribute is attribute.minimum
//For attributes type array:
//*Error: the minItems of X attribute is attribute.length
//*Error: the attribute X is not in the list of allowed values
/* ********************************************* */
