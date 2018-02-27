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
    }


    checkEnum (enm, attr ) {
        for(let iA = 0 ; iA <= attr.length ; iA ++ ){
            let exist = false;
            let errIndex = -1;
            for(let iE = 0 ; iE <= enm.length ; iE ++ ){
                if (attr[iA] === enm[iE]) {
                    exist = true;
                }
            }	
            if(!exist){
                throw  new Error(`Error ${attr[errIndex]} not found in the list`);
            }
        }
        return true
    }

    checkStringEnum (enm, attr ) {
        let exist = false;
        enm.map((en) => {
            if(en === attr ){
                exist = true;
            }
        })	
        if(!exist){
            throw  new Error(`Error ${attr} not found in the list`);
        }
        return true
    }

    checkOneOf(oneOf, attr){
        let err = true;
        oneOf.map((one) =>{
            try{
                this.verifyAttr(one, attr)
                err =false
            }catch (e) {}
        })
        if(err) {
            throw  new Error(`Error type not match ${attr}`).stack;
        }
    }

    checkItems(items, attr){
        let errorIndex = -1; 
        attr.map((attrItem, index) =>{
            if(typeof attrItem !== items.type){
                errorIndex = index;
            }
        })
        if(errorIndex !== -1){
            throw  new Error(`Error type not match ${attr[errorIndex]}`);
        }
        if(items["enum"] !== undefined ){
            if(this.checkEnum(items.enum, attr)){
                return true
            }else{
                return false
            }	
        }else if(items["oneOf"] !== undefined){
            this.checkOneOf(items["oneOf"], attr);
        }
        
    }


    verifyAttr (schemaAttr , attr ) {
        let correctType = false;
        
        if( schemaAttr.type === "array"){
            if (!(typeof attr === "object" && typeof attr !== "string") ){
                throw  new Error(`Error type not match ${schemaAttr.type}`);
            }else {
                if( schemaAttr.minItems !== undefined ){
                    if ( attr.length < schemaAttr.minItems ){
                        throw  new Error(`Error the minItems ${attr.length}`);
                    }
                }
                if(schemaAttr.items !== undefined)
                this.checkItems(schemaAttr.items, attr)
            }
        } else if( schemaAttr.type === "integer" ||  schemaAttr.type === "number"){
            if( schemaAttr.type !== typeof attr){
                throw  new Error(`Error type not match ${attr}`);
            }
            if(schemaAttr.minimum > attr){
                throw  new Error(`Error the minimun is ${schemaAttr.minimum} in ${attr}`);
            }
            if(schemaAttr.maximum < attr){
                throw  new Error(`Error the maximum is ${schemaAttr.maximunm} in ${attr}`);
            }
        }else if( schemaAttr.type === "string"){
            
            if( !(schemaAttr.type === typeof attr || Object.prototype.toString.call(attr) === "[object Date]")){
                throw  new Error(`Error type not match ${attr}`);
            }
            
            if(schemaAttr.maxLength !== undefined){
                if( attr.length > schemaAttr.maxLength){
                    throw  new Error(`Error the maxLength is ${schemaAttr.maxLength} in ${attr}`);
                }
            }
            if(schemaAttr.minLength !== undefined){
                if( attr.length < schemaAttr.minLength){
                    throw  new Error(`Error the minLength is ${schemaAttr.minLength} in ${attr}`);
                }
            }
            if(schemaAttr.format !== undefined){
                if(schemaAttr.format === "date-time"){
                    if(!Object.prototype.toString.call(attr) === "[object Date]"){                
                        try {
                            let d = new Date(attr);
                            d.toISOString()
                        }catch (e) {
                            throw  new Error(`Error format in date ${attr}`);
                        }
                    }
                }
            }
            if(schemaAttr["enum"] !== undefined){
                this.checkStringEnum(schemaAttr["enum"], attr)
            }
            if(schemaAttr["pattern"] !== undefined){
                let re = schemaAttr["pattern"]
                let exp = re.match(attr);
            }
        }else if( schemaAttr.type === undefined){
            if(schemaAttr.oneOf !== undefined){
                this.checkOneOf(schemaAttr.oneOf, attr);
            }		
        }
        else { // Boolean, null, object 

            if( schemaAttr.type !== typeof attr){
                throw  new Error(`Error type not match ${attr}`);
            }

            if(schemaAttr.type === typeof attr){
                correctType = true;
            }
        }
        

    }

    verifyModel (Schema, Entity) {

        if(Schema["allOf"] !== undefined && Schema["definition"] === undefined ){

            if(Object.prototype.toString.call(Schema["allOf"]) === "[object Array]" ){
                for (let attr in Entity){
                    let exist = false;
                    Schema["allOf"].map((all ) =>{
                        if(all["properties"][attr] !== undefined){
                            exist = true
                            this.verifyAttr(all["properties"][attr], Entity[attr])
                        }
                    })
                    if(!exist){
                        throw  new Error(`Attribute ${attr} not found in the model`);
                    }
                }
            } else {
                throw  new Error(`The allOf atribute should be Array`);
            }
        }
        else if (Schema["definition"] !== undefined && Schema["allOf"] === undefined){

            if(Object.prototype.toString.call(Schema["definition"]) === "[object Object]")  {
                for (let attr in Entity){
                    let exist = false;
                    if(Schema["definition"]["properties"][attr] !== undefined){
                        exist = true
                        this.verifyAttr(Schema["definition"]["properties"][attr], Entity[attr])
                    }
                    if(!exist){
                        throw  new Error(`Attribute ${attr} not found in the model`);
                    }
                }
            }else {
                throw  new Error(`The definition atribute should be JSON`);
            }
        }else {
            throw  new Error(`The model is malformed need allOf or definition propertie`);
        }
        if(Schema["oneOf"] !== undefined && Schema["required"] === undefined ){
            if(Object.prototype.toString.call(Schema["oneOf"]) === "[object Array]" ){
                let isOk = false;
                Schema["oneOf"].map((required) => {
                    let complete = true; 
                    required["required"].map((attrReq) =>{
                        if(Entity[attrReq] === undefined){
                            complete = false
                        }
                    })
                    if(complete){
                        isOk = true;
                    }
                })
                if(!isOk){
                    throw  new Error(`the model does not comply with the required attribute options`)
                }
            }else {
                throw  new Error(`The oneOf atribute should be Array`);
            }
        } else if(Schema["required"] !== undefined && Schema["oneOf"] === undefined ){   
            if(Object.prototype.toString.call(Schema["required"]) === "[object Array]")  {
                Schema["required"].map((attrReq) =>{
                    if(Entity[attrReq] === undefined){
                        throw  new Error(`The attribute ${attrReq} is required`)
                    }
                }) 
            }else {
                throw  new Error(`The oneOf atribute should be Array`);
            }
        }else {
            throw  new Error(`The model is malformed need oneOf or required properties`);
        }
        return true;
    }

}


module.exports = ModelAnalizer;
module.exports.default = module.exports;