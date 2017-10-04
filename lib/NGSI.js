'use strict'


class NGSI {
	/*Metodos*/

	detectType(){

		console.log(arguments.length)
		/* SI se recibió un solo argumento */
		if (arguments.length === 1){
			let val = arguments[0]
			let typeData = ""
			let jsonData = false

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
					if (val.toString() !== '[object Object]') {
						typeData = 'StructuredValue'
					}else {
						jsonData = true
					}
				} 		
			} 

			/* Tipo JSON */
			if (jsonData) {
				return this.jsonDataType(val)

			}else{
				return {
					'value' : val,
					'type' : typeData
				}
			}
		} else if (arguments.length === 2){

			let jsonData = false

			console.log(arguments[1])
			/* Tipo JSON */
			if (arguments[1] !== '[object Object]') {
				console.log("no es objeto")
				return {
					'value' : arguments[1],
					'type' : arguments[0]
				}
			}else {
				jsonData = true
			}

			if (jsonData) {
				return this.jsonDataType(val)
			}
			
		}

		
	}

	jsonDataType(json){
		console.log("Es un json")
		return json
	}

	parseEntity( json ){
		/*let id = json.id
		let type = json.type*/
		console.log(this.detectType(json))

		return json
	}



}


module.exports = new NGSI()