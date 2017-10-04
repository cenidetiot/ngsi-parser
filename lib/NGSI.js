'use strict'


class NGSI {
	/*Metodos*/

	detectType(){
		/* SI se recibió un solo argumento */
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
					}else {
						//typeData = 'StructuredValue'
						arrayData = true
					}
				} 		
			} 

			/* Tipo JSON */
			if (jsonData) {
				return this.parseJSON(val)
			}if (arrayData) {
				return this.arrayDataType(val)
			}else{
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
		

		
	}
	arrayDataType(array){
		console.log(array.length)
		console.log("Es un Array")
		return array
	}

	jsonDataType(json){
		console.log("Es un json")
		return json
	}

	parseEntity(){
		let type = arguments[0]
		let id = arguments[1]
		let val = arguments[2]
		let temp = {
			'id' : id,
			'type' : type
		}
		for (let i in val){
			temp[i] = this.detectType(val[i])
		}
		return temp
	}

	parseJSON(json){
		let temp ={}

		if (json.type !== undefined){
			temp.type = json.type
			temp.value = json.value
		}else{
			if (json.value !== undefined && json.metadata === undefined){
				temp = this.detectType(json.value) 
			}else if (json.value !== undefined && json.metadata !== undefined){
				let data = this.detectType(json.value)
				temp.type = data.type 
				temp.value = data.value
				temp.metadata = json.metadata
			}else{
				for (let i in json)
					temp[i] = this.detectType(json[i],false)
			}
			
		}
		return temp
	}


}


module.exports = new NGSI()