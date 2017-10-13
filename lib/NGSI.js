'use strict'


class NGSI {

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
					if (i === 'location'){
						temp[i] = this.parseLocation(val[i])
					}else {
						temp[i] = this.detectType(val[i])
					}
					
				}
				
			}
		}
		return temp
	}

	parseLocation (coor){
		let temp = {}
			if (typeof coor === 'string') { //if is a geo:point
				temp['type'] = "geo:point"  
				temp['value'] = coor
			}else if (typeof coor == 'object') {
				if (coor.toString() === '[object Object]') {
					temp['type'] = "geo:json"  
					temp['value'] = coor
				}else {
					try {
						coor = coor.toISOString() // Descart Object Date
						console.error(Error("Date Type not accepted"))
						return
					}catch(e){ // reconize that is an Array
						//select the type of the first element
						if (coor.length !== 0){
							if(typeof coor[0] === 'string' ){
								console.log("Veré si es line o box")	
							}else{
								console.log("Veré si es poligon")
							}	
						}else{
							console.log(Error("Need Coordinates to location"))
							return	
						} 
					}
				}
			}else {
				console.error(Error("Date type not accepted"))
				return
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