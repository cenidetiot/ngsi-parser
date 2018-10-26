'use strict'
var  ModelAnalizer = require('./ModelParser'); 

class NGSI extends ModelAnalizer{

	constructor(){
		super();
	}

	createQuery(json){
		let query = "?"
		let reservadas = {
			id : "id",
			type: "type",
			georel: "georel",
			geometry : "geometry",
			coords : "coords",
			options: "options",
			limit: "limit",
			offset: "offset"
		}
		let first =  true
		for (let item in json){
			if(reservadas[item] !== undefined){
				if (!first){
					query+="&"
				}
				if(item === "coords"){
					if( typeof json[item] !== 'string')
						json[item] = json[item].join(';')
				}
				query+=`${item}=${json[item]}`
				//console.log("Es reservada")
				first=false
			} else{
				if (!first){
					query+=`&q=${item}`
				}

				if(json[item][0] === ">" || json[item][0] === "<" || json[item][0] === "=" ){
					query+=`${json[item]}`
				}else {
					query+=`==${json[item]}`
				}
				first=false
			}
		}
		return query
	}

	detectType(){
		let val = arguments[0]
		let typeData = ""
		let jsonData = false
		let arrayData = false

		if (typeof val == 'string')
			typeData = "Text"
		else if (typeof val == 'number'){
			if (val % 1 == 0)
				typeData = "Number"
	        else
	            typeData =  "Float"
		}else if (typeof val == 'boolean') 
			typeData = "Boolean"
		else if (typeof val == 'object') {
			if (val === null)
				typeData = "None"	
			else{
				if(Object.prototype.toString.call(val) === "[object Array]"){
					typeData = "StructuredValue" 
				}else if(Object.prototype.toString.call(val) === "[object Object]") {
					jsonData = true
				}else if(Object.prototype.toString.call(val) === "[object Date]"){
					typeData = "DateTime"
					val = val.toISOString()
				}
			} 		
		} else {
			console.error(
				new Error("Data Type not supported, please check the Data Types Supported in https://ngsi-js-library.readthedocs.io/en/latest/ngsi/")
			)
			return
		}

		if (jsonData) {
			return this.parseJSON(val)
		}
			

		if (arguments[1] === false){
			return {
				'value' : val,
				'type' : typeData
			}
		}else {
			return {
				'value' : val,
				'type' : typeData,
				//'metadata' : {}
			}
		}
	}

	parseValue(value){
		return this.detectType(value)
	}

	parseEntity(json){
		let val = arguments[0]
		let type = val['type']
		let id = val['id']

		if (id === undefined ) {
			console.error(new Error("Missing id"))
			return 
		}
		if (type === undefined ) {
			console.error(new Error("Missing type"))
			return 
		}

		let temp = {}
		if(id && type && val ){
			temp = {
				'id' : id,
				'type' : type
			}
			for (let i in val){
				if (i !== "id" && i !== "type"){
					//if (i === 'location'){
					//	temp[i] = this.parseLocation(val[i])
					//}else {
						temp[i] = this.detectType(val[i])
					//}
					
				}
				
			}
		}
		return temp
	}


	parseAttrs(){
		let val = arguments[0]
		let temp = {}

		if(val){
			for (let i in val){
				temp[i] = this.detectType(val[i])
				if (temp[i] === undefined) 
				return
			}
		}
		return temp
	}	

	parseJSON(json){
		let temp ={}
		if(json.type === undefined){
			if(json.value === undefined){
				if (json.metadata !== undefined) {
					temp.metadata = json.metadata
				}
				temp['value'] = {}
				temp['type']='StructuredValue'
			}else {
				temp = this.detectType(json.value)
				if(temp === undefined)
					return
				if (json.metadata !== undefined) {
					let meta = {}
					for (let i in json.metadata){
						meta[i] = this.detectType(json.metadata[i], false)
					}
					temp.metadata = meta
				}
			}
		}else{
			temp.type= json.type
			temp.value= json.value
			if (json.metadata !== undefined) {
				let meta = {}
				for (let i in json.metadata){
					meta[i] = this.detectType(json.metadata[i], false)
				}
				temp.metadata = meta
			}
		}
		return temp
	}

}


module.exports = new NGSI()
module.exports.default = module.exports;