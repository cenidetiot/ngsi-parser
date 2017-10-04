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
						typeData = "StructuredValue" 
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

	parseEntity(){
		let type = arguments[0]
		let id = arguments[1]
		let val = arguments[2]
		let t = this
		const promise = new Promise(function (resolve, reject) {
			if(!id && !type && !val ){
				reject(new Error('Parametros Incompletos'))
			}else{
				let temp = {
					'id' : id,
					'type' : type
				}
				for (let i in val){
					temp[i] = t.detectType(val[i])
				}
				resolve(temp)
			}
		})
		return promise
	}

	parseUpdate(){
		let val = arguments[0]
		let t = this
		const promise = new Promise(function (resolve, reject) {
			if(!val){
				reject(new Error('Parametros Incompletos'))
			}else{
				resolve(t.parseJSON(val))

			}
		})
		return promise
	}	
	parseJSON(json){
		let temp ={}
		if(json.type === undefined){
			if(json.value === undefined){
				if (json.metadata === undefined) {
					for (let i in json){
						temp[i] = this.detectType(json[i])
					}
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