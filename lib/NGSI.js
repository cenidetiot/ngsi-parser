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


var  ModelAnalizer = require('./ModelAnalizer'); // Import the ModelAnalizer class

/**
 * Class used to analize non-structured JSON and transform into FIWARE-NGSIv2
 * @class NGSI
 * @external ModelAnalizer
 */
class NGSI extends ModelAnalizer { 

	/** @constructs */
	constructor(){ 
		super(); 
	}

	/**
	 * Create a new NGSIv2 Query from a JSON 
	 * @param {JSON}  json
	 * @returns {String} 
	*/
	createQuery(json){ 
		// if the parameter is not a JSON
		if (Object.prototype.toString.call(json) !== "[object Object]"){ 
			console.error(
				new Error("Expected JSON")
			)
			return " "
		}
	
		let query = "?"; 
		// The reserved words are used to add q= or not dependig that the JSON attribute is or not on the reserved words 
		let reserve = {
			id : "id",
			type: "type",
			georel: "georel",
			geometry : "geometry",
			coords : "coords",
			options: "options",
			limit: "limit",
			offset: "offset"
		}
		let first =  true; // if is the first attribute of the JSON not add the simbol & before the attribute name
		for (let item in json){ // iterate the JSON attributes 
			if(reserve[item] !== undefined){  // if the attribute is a reserved word
				if (!first){ // if isn't the first attribute
					query+="&"
				}
				if(item === "coords"){ // if the atribute is coords, should to convert the coords 
					if( typeof json[item] !== 'string')
						json[item] = json[item].join(';')
				}
				query+=`${item}=${json[item]}`; // add to the string to the query
				first=false;
			} else{ // if the word is not a reserved word
				if (!first){ // if isn't the first attribute
					query+=`&q=${item}`; 
				}

				if(json[item][0] === ">" || json[item][0] === "<" || json[item][0] === "=" ){ // if the attribute include a expression
					query+=`${json[item]}`; // convert the value to string and add to the query
				}else {
					query+=`==${json[item]}`; // convert the value to string and add == to the query before the value
				}
				first=false;
			}
		}
		return query
	}

	/**
	 * Detects the data type of one value and converts it into NGSIv2
	 * @param {String} {Number} {Boolean} {Array} {Datetime} {JSON} value
	 * @returns {JSON} NGSIv2 format
	*/ 
	detectType(value){
		let val = value; // Store the value to detect type
		let typeData = ""; // assigned to store the Type of the value
		let jsonData = false; // to determinate if is a JSON or not

		if (typeof val == 'string') // if the value is a string 
			typeData = "Text";
		else if (typeof val == 'number'){ // if the value is a number(integer, float or double)
			if (val % 1 == 0) // if the value is integer
				typeData = "Number";
	        else // if the value is float o double
	            typeData =  "Float";
		}else if (typeof val == 'boolean') // if the value is boolean
			typeData = "Boolean";
		else if (typeof val == 'object') { // if the value is a object (null,array, JSON or datetime )
			if (val === null) // if the value is null
				typeData = "None";
			else{
				if(Object.prototype.toString.call(val) === "[object Array]"){ // if the value is Array
					typeData = "StructuredValue";
				}else if(Object.prototype.toString.call(val) === "[object Object]") { // if the value is a JSON
					jsonData = true; // assigned when is a JSON
				}else if(Object.prototype.toString.call(val) === "[object Date]"){ // if the attribute is a datetime
					typeData = "DateTime"
					val = val.toISOString();
				}
			} 		
		} else { // if the datatype is not supported (undefined)
			console.error(
				new Error("Data Type not supported, please check the Data Types Supported in https://ngsi-js-library.readthedocs.io/en/latest/ngsi/")
			)
			return
		}

		if (jsonData) { // if the value is a JSON 
			return this.parseJSON(val)
		}
			
		return { // Return the JSON in NGSIv2 format
			'value' : val,
			'type' : typeData
		}
	}

	/**
	 * Converts one value into NGSIv2 format
	 * @param {String} {Number} {Boolean} {Array} {Datetime} {JSON} value
	 * @returns {JSON} NGSIv2 format
	*/
	parseValue(value){ 
		return this.detectType(value); // Use detectType to convert de value and convert
	}

	/**
	 * Converts an normal JSON entity into NGSIv2 format
	 * @param {JSON} entity
	 * @returns {JSON} NGSIv2 format
	*/
	parseEntity(entity){
		if (Object.prototype.toString.call(entity) !== "[object Object]"){ // if the entity isn't a JSON
			console.error(
				new Error("Expected JSON")
			)
			return " "
		}

		let val = entity; // assigned to store the temporal entity
		let type = val['type']; // store the type of the entity
		let id = val['id']; // store the entity id

		if (id === undefined ) { // if the entity id is missing
			console.error(new Error("Missing id"))
			return 
		}
		if (type === undefined ) { // if the type is missing 
			console.error(new Error("Missing type"))
			return 
		}

		let temp = {}; // create a empty temporal JSON
		if(id && type && val ){ 
			temp = { // assign the entity id and type 
				'id' : id,
				'type' : type
			}
			for (let i in val){ // iterate the entity attributes
				if (i !== "id" && i !== "type"){ // if the attributes name isn't id or name
					temp[i] = this.detectType(val[i]); // used to detect type and convert to NGSIv2
				}
				
			}
		}
		return temp; // return the entity in NGSIv2 format
	}

	/**
	 * Converts various attibutes
	 * @param {JSON} attributes
	 * @returns {JSON} NGSIv2 format
	*/
	parseAttrs(attributes){
		let val = attributes; // assign to store the attributes 
		if (Object.prototype.toString.call(val) !== "[object Object]"){ // if the attributes parameter is not JSON
			console.error(
				new Error("Expected JSON")
			)
			return " ";
		}
		let temp = {}; // create a temporal JSON
		if(val){ // if the val isn't a null value
			for (let i in val){ // iterate the attributes 
				temp[i] = this.detectType(val[i]) // used to detect the type ant convert into NGSIv2
				if (temp[i] === undefined) // if not a undefined value
				return
			}
		}
		return temp; // return the attributes into NGSIv2 format
	}	

	/**
	 * Converts a JSON attribute to NGSIv2 format
	 * @param {JSON} json
	 * @returns {JSON} NGSIv2 format
	*/
	parseJSON(json){
		let temp ={}; // create a temp JSON
		if(json.type === undefined){ // if the type isn't defined 
			if(json.value === undefined){ // if the value isn't defined
				if (json.metadata !== undefined) { // if metadata isn't defined
					temp.metadata = json.metadata // assigns the metadato to the temporal JSON
				}
				temp['value'] = {}; // assigns as value an empty JSON
				temp['type']='StructuredValue'; // assigns StructuredValue as type
			}else { // if the value is defined
				temp = this.detectType(json.value); // detects the type and convert into NGSIv2
				if(temp === undefined) // if the type is undefined
					return
				if (json.metadata !== undefined) { // if the metadata isn't defined
					let meta = {}; 
					for (let i in json.metadata){ // iterate the metadata attributes
						meta[i] = this.detectType(json.metadata[i]); // Detects the type and converts into NGSIv2
					}
					temp.metadata = meta; // assings the temporal metadata 
				}
			}
		}else{ // if the type is defined 
			temp.type= json.type; // assings the type to the temp JSON
			temp.value= json.value; // assings the value to the temp JSON
			if (json.metadata !== undefined) { // if the metadata isn't defined
				let meta = {}; 
				for (let i in json.metadata){ // iterate the metadata attributes
					meta[i] = this.detectType(json.metadata[i]); // Detects and convert the value into NGSIv2
				}
				temp.metadata = meta; // assigns the temporal metadata to the temporal JSON
			}
		}
		return temp; // return the tmeporal JSON
	}

}


module.exports = new NGSI(); // ES6 default export compatibility
module.exports.default = module.exports;