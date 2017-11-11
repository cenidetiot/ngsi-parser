'use strict'


class NGSI {

	createQuery(json){
		let query = "?"
		let reservadas = {
			id : "id",
			type: "type",
			georel: "georel",
			geometry : "geometry",
			coords : "coords",
			options: "options"
		}
		let first =  true
		for (let item in json){
			if(reservadas[item] !== undefined){
				if (!first){
					query+="&"
				}
				if(item === "coords"){
					json[item] = json[item].join(';')
				}
				query+=`${item}=${json[item]}`
				console.log("Es reservada")
				first=false
			} else{
				if (!first){
					query+="&"
				}
				query+=`q=${item}==${json[item]}`
				console.log("No es reservada")
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
				if (val.toString() === '[object Object]') {
					jsonData = true
				}else{
					try {
						typeData = "DateTime"
						val = val.toISOString()
					}catch(e){
						typeData = "Array" 
					}
					
				}
			} 		
		} 

		if (jsonData) 
			return this.parseJSON(val)

		if (arguments[1] === false){
			return {
				'value' : val,
				'type' : typeData
			}
		}else {
			return {
				'value' : val,
				'type' : typeData,
				'metadata' : {}
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
			console.error(new Error("id is necessary"))
			return 
		}
		if (type === undefined ) {
			console.error(new Error("type is necessary"))
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
			}
		}
		return temp
	}	

	parseJSON(json){
		let temp ={}
		if(json.type === undefined){
			if(json.value === undefined){
				if (json.metadata === undefined) {
					temp['value'] = json
					temp['type']='StructuredValue'
				}else{
					temp.metadata = json.metadata
				}
			}else {
				temp = this.detectType(json.value)
				if (json.metadata !== undefined) {
					let meta = {}
					for (let i in json.metadata){
						meta[i] = this.detectType(json.metadata[i], false)
					}
					temp.metadata = meta
				}else {
					temp.metadata = {}
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
			}else {
				temp.metadata = {}
			}
		}
		return temp
	}

}


module.exports = new NGSI()
module.exports.default = module.exports;