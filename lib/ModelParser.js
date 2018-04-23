'use strict'

class ModelAnalizer {


    constructor(){
        this.GSMA = {
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
        this.Location = {
            "properties" : {
                "location":{
                    "type" : "object"
                },
                "address": {
                    "type": "object"
                }
            }
        }
        this.PhysicalObject = {
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

        this.models = {}
    }

    
    setModel(schemas, name = undefined){

        if (name === undefined){ //JSON de URLS
            if(Object.prototype.toString.call(schemas) === "[object Object]"){
                for (let schema in schemas ){
                    this.models[schema] = schemas[schema];
                }
            }
        }else { //Una sola url
            this.models[name] = schemas;
        }
        
        
    }

    checkEnum (enm, attr , errors) {
        for(let iA = 0 ; iA <= attr.length ; iA ++ ){
            let exist = false;
            let errIndex = -1;
            for(let iE = 0 ; iE <= enm.length ; iE ++ ){
                if (attr[iA] === enm[iE]) {
                    exist = true;
                }
            }	
            if(!exist){
                errors.push(`Error ${attr[errIndex]} not found in the list`)
                //throw  new Error(`Error ${attr[errIndex]} not found in the list`);
            }
        }
        return errors
    }

    checkStringEnum (enm, attr , errors) {
        let exist = false;
        enm.map((en) => {
            if(en === attr ){
                exist = true;
            }
        })	
        if(!exist){
            errors.push(`Error ${attr} not found in the list`)
            //throw  new Error(`Error ${attr} not found in the list`);
        }
        return errors
    }

    checkOneOf(oneOf, attr, errors){
        let err = true;
        oneOf.map((one) =>{
            try{
                errors  = this.verifyAttr(one, attr, errors)
                err =false
            }catch (e) {}
        })
        if(err) {
            errors.push(`Error type not match ${attr}`)
            //throw  new Error(`Error type not match ${attr}`).stack;
        }
        return errors
    }

    checkItems(items, attr, errors){
        let errorIndex = -1; 
        attr.map((attrItem, index) =>{
            if(typeof attrItem !== items.type){
                errorIndex = index;
            }
        })
        if(errorIndex !== -1){
            errors.push(`Error type not match ${attr[errorIndex]}`)
            //throw  new Error(`Error type not match ${attr[errorIndex]}`);
        }
        if(items["enum"] !== undefined ){
            errors = this.checkEnum(items.enum, attr, errors)
                	
        }else if(items["oneOf"] !== undefined){
            errors = this.checkOneOf(items["oneOf"], attr, errors);
        }
        return errors
        
    }


    verifyAttr (schemaAttr , attr , errors) {
        let correctType = false;
        
        if( schemaAttr.type === "array"){
            if (!(typeof attr === "object" && typeof attr !== "string") ){
                errors.push(`Error type not match ${schemaAttr.type}`)
                //throw  new Error(`Error type not match ${schemaAttr.type}`);
            }else {
                if( schemaAttr.minItems !== undefined ){
                    if ( attr.length < schemaAttr.minItems ){
                        errors.push(`Error the minItems ${attr.length}`)
                        //throw  new Error(`Error the minItems ${attr.length}`);
                    }
                }
                if(schemaAttr.items !== undefined)
                errors = this.checkItems(schemaAttr.items, attr, errors)
            }
        } else if( schemaAttr.type === "integer" ||  schemaAttr.type === "number"){
            if( schemaAttr.type !== typeof attr){
                errors.push(`Error type not match ${attr}`)
                //throw  new Error(`Error type not match ${attr}`);
            }
            if(schemaAttr.minimum > attr){
                errors.push(`Error the minimun is ${schemaAttr.minimum} in ${attr}`)
                //throw  new Error(`Error the minimun is ${schemaAttr.minimum} in ${attr}`);
            }
            if(schemaAttr.maximum < attr){
                errors.push(`Error the maximum is ${schemaAttr.maximunm} in ${attr}`)
                //throw  new Error(`Error the maximum is ${schemaAttr.maximunm} in ${attr}`);
            }
        }else if( schemaAttr.type === "string"){
            
            if( !(schemaAttr.type === typeof attr || Object.prototype.toString.call(attr) === "[object Date]")){
                errors.push(`Error type not match ${attr}`)
                //throw  new Error(`Error type not match ${attr}`);
            }
            
            if(schemaAttr.maxLength !== undefined){
                if( attr.length > schemaAttr.maxLength){
                    errors.push(`Error the maxLength is ${schemaAttr.maxLength} in ${attr}`)
                    //throw  new Error(`Error the maxLength is ${schemaAttr.maxLength} in ${attr}`);
                }
            }
            if(schemaAttr.minLength !== undefined){
                if( attr.length < schemaAttr.minLength){
                    errors.push(`Error the minLength is ${schemaAttr.minLength} in ${attr}`)
                    //throw  new Error(`Error the minLength is ${schemaAttr.minLength} in ${attr}`);
                }
            }
            if(schemaAttr.format !== undefined){
                if(schemaAttr.format === "date-time"){
                    if(!Object.prototype.toString.call(attr) === "[object Date]"){                
                        try {
                            let d = new Date(attr);
                            d.toISOString()
                        }catch (e) {
                            errors.push(`Error format in date ${attr}`)
                            //throw  new Error(`Error format in date ${attr}`);
                        }
                    }
                }
            }
            if(schemaAttr["enum"] !== undefined){
                errors = this.checkStringEnum(schemaAttr["enum"], attr, errors)
            }
            if(schemaAttr["pattern"] !== undefined){
                let re = schemaAttr["pattern"]
                let exp = re.match(attr);
               
            }
        }else if( schemaAttr.type === undefined){
            if(schemaAttr.oneOf !== undefined){
                errors = this.checkOneOf(schemaAttr.oneOf, attr, errors);
            }		
        }
        else { // Boolean, null, object 

            if( schemaAttr.type !== typeof attr){
                errors.push(`Error type not match ${attr}`)
                //throw  new Error(`Error type not match ${attr}`);
            }
            if(schemaAttr.type === typeof attr){
                correctType = true;
            }
        }

        return errors
        

    }

    prepareModel (Schema) {
        Schema["allOf"].map((all, index ) =>{
            if(all['$ref'] !== undefined){ 
                if(all['$ref'] === 'https://fiware.github.io/dataModels/common-schema.json#/definitions/GSMA-Commons'){ //GSMA
                    Schema["allOf"][index] = this.GSMA
                }else if(all['$ref'] === 'https://fiware.github.io/dataModels/common-schema.json#/definitions/Location-Commons'){ //Location
                    Schema["allOf"][index] = this.Location
                }else if(all['$ref'] === 'https://fiware.github.io/dataModels/common-schema.json#/definitions/PhysicalObject-Commons'){ //Location
                    Schema["allOf"][index] = this.PhysicalObject
                }else {
                    throw  new Error(`Actualy the only the refs supported are GSMA, Location and PhysicalObject commons` );
                }
            }else{
                if (all["properties"] !== undefined){
                    for (let attr in all["properties"]) {
                        if(all["properties"][attr]['$ref'] !== undefined){
                            if(all["properties"][attr]['$ref'] !== 'https://fiware.github.io/dataModels/common-schema.json#/definitions/EntityIdentifierType'){
                                all["properties"][attr] = this.GSMA.properties.id   
                            }
                        } 
                        if(all["properties"][attr]['oneOf'] !== undefined){
                            all["properties"][attr]['oneOf'].map((item, ind)=> {
                                if(item['$ref'] !== undefined){
                                    if(item['$ref'] === 'https://fiware.github.io/dataModels/common-schema.json#/definitions/EntityIdentifierType'){
                                        //all["properties"][attr]['oneOf'][index]   
                                        Schema["allOf"][index]["properties"][attr]['oneOf'][ind] = this.GSMA.properties.id  
                                    }
                                }
                                //console.log(item['$ref'])
                            })
                        } 
                    }
                }
            }

        })
        return Schema
    }

    verifyModel (Schema, Entity, ocb = null) {
        let  errors = [];
        if(Object.prototype.toString.call(Schema) === "[object Object]"){ //Se ingresa schema json
        
            if(Schema["allOf"] !== undefined && Schema["definition"] === undefined ){

                if(Object.prototype.toString.call(Schema["allOf"]) === "[object Array]" ){
                    
                    Schema  = this.prepareModel(Schema)

                    for (let attr in Entity){
                        let exist = false;
                        Schema["allOf"].map((all ) =>{
                            if(all["properties"][attr] !== undefined){
                                exist = true
                                errors = this.verifyAttr(all["properties"][attr], Entity[attr], errors)
                            }
                        })
                        if(!exist){
                            errors.push(`Attribute ${attr} not found in the model`)
                            //throw  new Error(`Attribute ${attr} not found in the model`);
                        }
                    }
                } else {
                    errors.push(`The allOf atribute should be Array`)
                    //throw  new Error(`The allOf atribute should be Array`);
                }
            }
            else if (Schema["definition"] !== undefined && Schema["allOf"] === undefined){

                if(Object.prototype.toString.call(Schema["definition"]) === "[object Object]")  {
                    for (let attr in Entity){
                        let exist = false;
                        if(Schema["definition"]["properties"][attr] !== undefined){
                            exist = true
                            errors = this.verifyAttr(Schema["definition"]["properties"][attr], Entity[attr], errors)
                        }
                        if(!exist){
                            errors.push(`Attribute ${attr} not found in the model`)
                            //throw  new Error(`Attribute ${attr} not found in the model`);
                        }
                    }
                }else {
                    errors.push(`The definition atribute should be JSON`)
                    //throw  new Error(`The definition atribute should be JSON`);
                }
            }else {
                errors.push(`The model is malformed need allOf or definition propertie`)
                //throw  new Error(`The model is malformed need allOf or definition propertie`);
            }
            if(Schema["oneOf"] !== undefined && Schema["required"] === undefined ){
                if(Object.prototype.toString.call(Schema["oneOf"]) === "[object Array]" ){
                    let isOk = false;

                    Schema["oneOf"].map((required) => {
                        let complete = true; 
                        required["required"].map((attrReq) =>{
                            if(Entity[attrReq] === undefined){
                                //errors.push(`Mising required propertie ${attrReq}`)
                                //console.log(attrReq)
                                complete = false
                            }
                        })
                        if(complete){
                            isOk = true;
                        }
                    })
                    if(!isOk){
                        errors.push(`the model does not comply with the required attribute options`)
                        //throw  new Error(`the model does not comply with the required attribute options`)
                    }
                }else {
                    errors.push(`The oneOf atribute should be Array`)
                    //throw  new Error(`The oneOf atribute should be Array`);
                }
            } else if(Schema["required"] !== undefined && Schema["oneOf"] === undefined ){   
                if(Object.prototype.toString.call(Schema["required"]) === "[object Array]")  {
                    Schema["required"].map((attrReq) =>{
                        if(Entity[attrReq] === undefined){
                            errors.push(`The attribute ${attrReq} is required`)
                            //throw  new Error(`The attribute ${attrReq} is required`)
                        }
                    }) 
                }else {
                    errors.push(`The oneOf atribute should be Array`)
                    //throw  new Error(`The oneOf atribute should be Array`);
                }
            }else {
                errors.push(`The model is malformed need oneOf or required properties`)
                //throw  new Error(`The model is malformed need oneOf or required properties`);
            }
            
        }else {
            if(this.models[Schema] !== undefined  ) { // se ingresa nombre registrado de schema
                errors = this.verifyModel(this.models[Schema], Entity)
            }else{
                if(ocb !== null) { // se ingresa url de schema
                    let t =  this;
                    const promise = new Promise(async function (resolve, reject) {
                        await ocb.downloadModel(Schema)
                        .then((json)=> {
                            resolve(t.verifyModel(json,Entity))
                        })
                        .catch(reject)
                    })
                    errors = promise;
                }
            }
        }
        return errors;
    }

}


module.exports = ModelAnalizer;
module.exports.default = module.exports;