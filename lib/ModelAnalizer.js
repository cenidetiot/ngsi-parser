'use strict'
/*
 * The NGSI-parser module analyzes the syntax of non-structured JSON objects
 * to transform them into FIWARE-NGSIv2 entities
 * 
 * Part of ngsijs-library for SMARTSDK
 * @autor Daniel Torres & Haidée Onofre
 * @version 2.2.6
 *
*/

/**
 * Class used to Analize if the entity complies the specification
 * defined in a JSON Schema
 * @class ModelAnalizer
 */

class ModelAnalizer {
    /**
     * Assigns global variables to use the Common definitions
     * for FIWARE Harmonized Data Models
     * @constructs
     *  
    */
    constructor(){  
        this.GSMA = { // GSMA-Commons
            "properties" : {
                "id": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 256,
                    "pattern": "^[\w\-\.\{\}\$\+\*\[\]`|~^@!,:\\]+$"
                },
                "dateCreated": {
                    "type": "string",
                    "format": "date-time"
                },
                "dateModified": {
                    "type": "string",
                    "format": "date-time"
                },
                "source": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "alternateName": {
                    "type": "string"
                },
                "description": {
                    "type": "string"
                },
                "dataProvider": {
                    "type": "string"
                }
            }
        }
        this.Location = { // Location Commons
            "properties" : {
                "location":{
                    "type" : "object"
                },
                "address": {
                    "type": "object"
                }
            }
        }
        this.PhysicalObject = { // PhysicalObject Commons
            "properties" : {

                "color": {
                    "type": "string"
                },
                "image": {
                    "type": "string",
                    "format": "uri"
                },
                "annotations": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            }
        }

        this.models = {}; // assings a empty JSON to store the data models
    }

    /**
	 * Set a model schema or name to store ready to use
	 * @param {json} schemas
     * @param {String} {undefined} name 
	*/
    setModel(schemas, name = undefined){ 

        if (name === undefined){ // if name is undefined
            if(Object.prototype.toString.call(schemas) === "[object Object]"){ // the schemas is a JSON
                for (let schema in schemas ){ // iterate the JSON attributes to store
                    this.models[schema] = schemas[schema]; // assigns the schema into the global models variable
                }
            }
        }else { // if the name isn't undefined
            this.models[name] = schemas; // assigns the name and the schema as attribute into the global models varible
        }
        
        
    }

    /**
	 * Check if the values list is on the registered posible values 
	 * @param {String} name
     * @param {Array} enm
     * @param {Array} attr
     * @param {Array} errors
     * @returns {Array} errors
	*/
    checkEnum (name ,enm, attr , errors) { 
        for(let iA = 0 ; iA <= attr.length ; iA ++ ){ // iterate the posible values 
            let exist = false; // assigned to define if the value is on the list
            let errIndex = -1; 
            for(let iE = 0 ; iE <= enm.length ; iE ++ ){ // iterate the values 
                if (attr[iA] === enm[iE]) { // if the value are in the posibles values
                    exist = true;
                }
            }	
            if(!exist){ // if some value isn't into the posible values list
                errors.push(`Error: the attribute ${attr[errIndex]} is not in the list of allowed values for the attribute ${name}`);
            }
        }
        return errors; // return the errors array 
    }

    /**
	 * Check if the values list is on the registered posible values using strings
	 * @param {String} name
     * @param {Array} enm
     * @param {Array} attr
     * @param {Array} errors
	*/
    checkStringEnum (name, enm, attr ,errors) {
        let exist = false; // assigned to define if the value is on the list
        enm.map((en) => { // iterate the values 
            if(en === attr ){ // if the value are in the posibles values
                exist = true;
            }
        })	
        if(!exist){ // if some value isn't into the posible values list
            errors.push(`Error: the attribute ${attr} is not in the list of allowed values for the attribute ${name}`)
        }
        return errors; // return the errors array 
    }

    /**
	 * Check the attribute complies some of the specifications defined
	 * @param {String} name
     * @param {Array} enm
     * @param {Array} attr
     * @param {Array} errors
	*/
    checkOneOf(name, oneOf, attr, errors){
        let err = true; // assigned to define if the value isn't on the posible list
        oneOf.map((one) =>{ // iterate the posible list 
            try{
                errors  = this.verifyAttr(name, one, attr, errors); // check if the attribute complies the specification
                err = false; 
            }catch (e) {}
        })
        if(err) { // if the value not complies the specification
            errors.push(`Error in the type of ${name} attribute`)
        }
        return errors; // return the errors 
    }

    /**
	 * Check the list when the attribute have items property
	 * @param {String} name
     * @param {Array} items
     * @param {Array} attr
     * @param {Array} errors
	*/
    checkItems(name ,items, attr, errors){
        let errorIndex = -1; // assigns to determinate if exist an error
        attr.map((attrItem, index) =>{ // iterate the attributes
            if(typeof attrItem !== items.type){ // if the attribute type isn't in the item type
                errorIndex = index;
            }
        })
        if(errorIndex !== -1){ // if the error index is diferent of -1
            errors.push(`Error in the type of ${name} attribute`)
        }
        if(items["enum"] !== undefined ){ // if the item have the enum attribute
            errors = this.checkEnum(name, items.enum, attr, errors); // check that the attribute complies the enum
                	
        }else if(items["oneOf"] !== undefined){ // if the item have oneOf attribute 
            errors = this.checkOneOf(name, items["oneOf"], attr, errors); // check if the attribute complies the oneOf 
        }
        return errors; // returns the errors found
        
    }

    /**
	 * Check that the attributes complies the specification
	 * @param {String} name
     * @param {Array} schemaAttr
     * @param {Array} attr
     * @param {Array} errors
	*/
    verifyAttr (name ,schemaAttr , attr , errors) {
        let correctType = false; 
        
        // if the attribute type should be an Array
        if( schemaAttr.type === "array"){ 
            // check that  the attribute realy is an array and not a string
            if (!(typeof attr === "object" && typeof attr !== "string") ){ 
                errors.push(`Error in the type of ${name} attribute `); 
            }else {
                // check if the schema attribute have a minItems attribute 
                if( schemaAttr.minItems !== undefined ){
                    // if the attribtute complies with the minItems range
                    if ( attr.length < schemaAttr.minItems ){
                        errors.push(`Error the minItems of ${name} must be ${schemaAttr.minItems}`)
                    }
                }
                // if the schema have an attribute items 
                if(schemaAttr.items !== undefined)
                errors = this.checkItems(name ,schemaAttr.items, attr, errors);
            }
        } 
        // if the attribute type should be a integer or a number
        else if( schemaAttr.type === "integer" ||  schemaAttr.type === "number"){
            // if the specifications type is diferent that the attribute type
            if( schemaAttr.type !== typeof attr){ 
                errors.push(`Error in the type of ${name} attribute Error `)
            }
            // if the minimun attribute of the specificatios is greater than the attribute value
            if(schemaAttr.minimum > attr){
                errors.push(`Error: the minimum value of ${name} attribute must be ${schemaAttr.minimum}`)
            }
            // if the minimun attribute of the specificatios is less than the attribute value
            if(schemaAttr.maximum < attr){
                errors.push(`Error: the minimum value of ${name} attribute must be ${schemaAttr.maximunm}`)
            }
        }
        // if the attribute type should be a string 
        else if( schemaAttr.type === "string"){
            // if the attribute type is the same of the specification and is not a date 
            if( !(schemaAttr.type === typeof attr || Object.prototype.toString.call(attr) === "[object Date]")){
                errors.push(`Error in the type of ${name} attribute `)
            }
            // if the attribute maxLength is defined
            if(schemaAttr.maxLength !== undefined){
                // if the attribute length is greater than the specification maxtLength attribute
                if( attr.length > schemaAttr.maxLength){
                    errors.push(`Error: the maxLength of ${name} attribute must be X ${schemaAttr.maxLength}`)
                }
            }
            // if the attribute minLength is defined
            if(schemaAttr.minLength !== undefined){
                // if the attribute length is less than the specification maxtLength attribute
                if( attr.length < schemaAttr.minLength){
                    errors.push(`Error: the minLength of ${name} attribute must be X ${schemaAttr.minLength}`)
                }
            }
            // if the attribute minLength is defined
            if(schemaAttr.format !== undefined){
                // if the specification format is date-time
                if(schemaAttr.format === "date-time"){
                    // if the attribute type is Date 
                    if(!Object.prototype.toString.call(attr) === "[object Date]"){                
                        try { // try to convert the string to date
                            let d = new Date(attr);
                            d.toISOString()
                        }catch (e) { // if the string is not a date
                            errors.push(`Error in the format date of ${name} attribute`)
                        }
                    }
                }
            }
            // if the attribute enum is defined in the specification
            if(schemaAttr["enum"] !== undefined){
                // check if the string complies the Enum
                errors = this.checkStringEnum(name ,schemaAttr["enum"], attr, errors)
            }
            // if the attribute pattern is defined in the specification
            if(schemaAttr["pattern"] !== undefined){
                // check if the string complies the pattern 
                let re = schemaAttr["pattern"];
                let exp = re.match(attr);
            }
        }
        // if the type attribute is not defined in the specification
        else if( schemaAttr.type === undefined){
            // if the oneOf attribute is defined 
            if(schemaAttr.oneOf !== undefined){
                // check if the attibute complies the checkOneOf
                errors = this.checkOneOf(name, schemaAttr.oneOf, attr, errors);
            }		
        }
        else { //if the specification type is boolean, null or object 
            // if the attribute type is diferent to the attribute type
            if( schemaAttr.type !== typeof attr){
                errors.push(`Error in the format date of ${name} attribute `)
            }else { // if the attribute type is equals to the attribute type
                correctType = true;
            }
        }
        return errors; // returns the error found 
    }

    /**
	 * Complete the model replacing the url by the commons variables 
	 * @param {JSON} Schema
	*/
    prepareModel (Schema) {
        // iterate the elements of the allOf attribute 
        Schema["allOf"].map((all, index ) =>{
            if(all['$ref'] !== undefined){ // if the elements includes $ref property
                // remplace the url by the GSMA object properties
                if(all['$ref'] === 'https://fiware.github.io/dataModels/common-schema.json#/definitions/GSMA-Commons'){
                    Schema["allOf"][index] = this.GSMA;
                }
                // remplace the url by the Location object properties
                else if(all['$ref'] === 'https://fiware.github.io/dataModels/common-schema.json#/definitions/Location-Commons'){ 
                    Schema["allOf"][index] = this.Location;
                }
                // remplace the url by the PhysicalObject object properties
                else if(all['$ref'] === 'https://fiware.github.io/dataModels/common-schema.json#/definitions/PhysicalObject-Commons'){ 
                    Schema["allOf"][index] = this.PhysicalObject;
                }else {
                    throw  new Error(`Currently, the analyzer only supports the common refs of GSMA, Location and PhysicalObject` );
                }
            }else{
                // if the element have the properties attribute
                if (all["properties"] !== undefined){
                    // iterate the attributes in the properties 
                    for (let attr in all["properties"]) {
                        // if the properties attribute have $ref
                        if(all["properties"][attr]['$ref'] !== undefined){
                            // remplace the url by the GSMA id property
                            if(all["properties"][attr]['$ref'] !== 'https://fiware.github.io/dataModels/common-schema.json#/definitions/EntityIdentifierType'){
                                all["properties"][attr] = this.GSMA.properties.id   
                            }
                        } 
                        // if the properties attribute have oneOf attribute
                        if(all["properties"][attr]['oneOf'] !== undefined){
                            // iterate the elements of oneOf
                            all["properties"][attr]['oneOf'].map((item, ind)=> {
                                // if the element have $ref
                                if(item['$ref'] !== undefined){
                                    // remplace the url by the GSMA id property
                                    if(item['$ref'] === 'https://fiware.github.io/dataModels/common-schema.json#/definitions/EntityIdentifierType'){
                                        Schema["allOf"][index]["properties"][attr]['oneOf'][ind] = this.GSMA.properties.id  
                                    }
                                }
                            })
                        } 
                    }
                }
            }

        })
        return Schema; // returns the schema modified
    }

    /**
	 * Verify if the entity complies the schema specification
	 * @param {JSON} Schema
	*/
    verifyModel (Schema, Entity, ocb = null) {
        let  errors = [];
        if(Object.prototype.toString.call(Schema) === "[object Object]"){ // if the Schema is a JSON
            // if the attibute have allOf attribute and don't have definition attribute
            if(Schema["allOf"] !== undefined && Schema["definition"] === undefined ){ 
                // if the allOf attribute is an Array 
                if(Object.prototype.toString.call(Schema["allOf"]) === "[object Array]" ){
                    Schema  = this.prepareModel(Schema); // Prepare the schema 
                    for (let attr in Entity){ // iterate the entity attributes
                        let exist = false;
                        Schema["allOf"].map((all ) =>{ // iterate the allOf attribute elements
                            // if the properties attribute of the element includes the name of the attribute
                            if(all["properties"][attr] !== undefined){
                                exist = true;
                                errors = this.verifyAttr( // verifies if the attribute
                                    attr ,
                                    all["properties"][attr], 
                                    Entity[attr], errors);
                            }
                        })
                        if(!exist){ // if the attribute don't exist
                            errors.push(`The attribute ${attr} is not an official attribute of the data model `)
                        }
                    }
                } else { // if the allOf attribute is not an Array
                    errors.push(`The allOf property should be an array`)
                }
            }
            // if the schema have definition attribute an don't have allOf attribute
            else if (Schema["definition"] !== undefined && Schema["allOf"] === undefined){
                // if the definition attribute is a JSON
                if(Object.prototype.toString.call(Schema["definition"]) === "[object Object]")  {
                    for (let attr in Entity){ // iterate the entity attributes
                        let exist = false;
                        // if the schema definition properties have an element called like the attribute
                        if(Schema["definition"]["properties"][attr] !== undefined){
                            exist = true;
                            // check if the attribute complies the specification
                            errors = this.verifyAttr(attr ,Schema["definition"]["properties"][attr], Entity[attr], errors);
                        }
                        if(!exist){ // if the attribute don't exist in the properties 
                            errors.push(`The attribute ${attr} is not an official attribute of the data model`)
                        }
                    }
                }else { // if the definition attribute is not a JSON
                    errors.push(`The definition property should be a JSON`)
                }
            }else { // if the schema don't have the definition property 
                errors.push(`The schema is not well-defined, needs the property allOf or definition`)
            }
            // if the schema have oneOf atribute and don't have required 
            if(Schema["oneOf"] !== undefined && Schema["required"] === undefined ){
                // if the oneOf attribute is an Array
                if(Object.prototype.toString.call(Schema["oneOf"]) === "[object Array]" ){
                    let isOk = false;
                    // iterate the oneOf elements
                    Schema["oneOf"].map((required) => {
                        let complete = true; 
                        // iterate the required attributes defined
                        required["required"].map((attrReq) =>{
                            // if some of required attribute is not in the entity
                            if(Entity[attrReq] === undefined){
                                complete = false
                            }
                        })
                        if(complete){ // if complete continues being true
                            isOk = true;
                        }
                    })
                    if(!isOk){ // if the entity complies some of the requied attributes list
                        errors.push(`The schema does not fulfill with the required attribute: options`)
                    }
                }else { // if the oneOf is not an Array
                    errors.push(`The oneOf property should be an array`)
                }
            } 
            // the schema have required property and don't have oneOf
            else if(Schema["required"] !== undefined && Schema["oneOf"] === undefined ){   
                // if the required is an Array
                if(Object.prototype.toString.call(Schema["required"]) === "[object Array]")  {
                    // iterate the required atributes
                    Schema["required"].map((attrReq) =>{
                        // if some of required attribute is not in the entity
                        if(Entity[attrReq] === undefined){
                            errors.push(`The attribute ${attrReq} is required in the model definition`)
                        }
                    }) 
                }else { // if the required property is not an Array
                    errors.push(`The required property should be an array`) 
                }
            }else { // if the schema don't have oneOf or required properties
                errors.push(`The schema is not well-defined, needs the property oneOf or required`)
            }
            
        }else { // if the schema is not an JSON
            // if the schema is registred in the models JSON
            if(this.models[Schema] !== undefined  ) { 
                // recursive method using the schema registred in the models JSON
                errors = this.verifyModel(this.models[Schema], Entity);
            }else{ // if is necesary download the schema
                if(ocb !== null) { // if ocb parameter is included
                    let t =  this;
                    // initialize an promise 
                    const promise = new Promise(async function (resolve, reject) {
                        // make the request using ocb as a fetcher 
                        await ocb.downloadModel(Schema)
                        .then((json)=> {
                            // if the schema is download 
                            resolve(t.verifyModel(json,Entity))
                        })
                        .catch(reject) // if any error occurs
                    })
                    errors = promise; // convert the error to promise
                }
            }
        }
        return errors; // return the error or promise
    }

}


module.exports = ModelAnalizer; // ES6 default export compatibility
module.exports.default = module.exports;