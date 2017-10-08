Welcome to NGSI-Parser!
===================


ngsi-parser is an npm module for parsing and converting a simple JSON or value to an NSGI-compliant object

----------


* [How to Install](#how-to-install)
* [Usage](#usage)
	* [Import](#import)
	* [Basic Functions](#basic-functions)
		* [Parse an Entity](#parse-an-entity)
		* [Parse an Attribute ](#parse-an-attribute)
		* [Parse a value](#build-and-install)
	* [Usage with ocb-sender](#usage-with-ocb-sender)
* [License](#license)

### How to Install


    npm install ngsi-parser 
    
   or
   
	 yarn add ngsi-parser


----------
### Import

#### ES5 

```js
	var ngsi = require('ngsi-parser')
```

#### ES6 
	

```js
	import NGSI from 'ngsi-parser'
```

	



### Basic Functions


#### Parse an Entity

```js
	var entity = ngsi.parseEntity('Room', 'Room1',{
		temperature : {
			value : 50 ,
			metadata : {
				frecuency: 40,
				scale: 'Celsious'
			}
		},
		dateStamp : new Date()
	})
```
 
Output

```json
	{
		"id":"Room1",
		"type":"Room",
		"temperature":{
			"value":50,
			"type":"Number",
			"metadata":{
				"frecuency"{
					"value":40,
					"type":"Number"
				},
				"scale":{
					"value":"Celsious",
					"type":"Text"
				}
			}
		},
		"dateStamp":{
			"value":"2017-10-08T04:01:19.560Z",
			"type":"DateTime",
			"metadata":{}
		}
	}

```
#### Parse an Attribute

```js
	var attribute = ngsi.parseAttrs({
		temperature : {
			value : 50,
			metadata :{
				frecuency : 50,
				scale: 'Fahrenheit'
			}
		}
	})
```


Output

```json
	{
		"temperature":{
			"value":50,
			"type":"Number",
			"metadata":{
				"frecuency":{
					"value":50,
					"type":"Number"
				},
				"scale":{
					"value":"Fahrenheit",
					"type":"Text"
				}
			}
		}
	}

```


#### Parse a Value

```js
	var value = ngsi.parseValue(50)
```

Output

```json
	{
		 "value": 50,
		 "type": "Number",
		 "metadata": {}
	 }

```

### Usage with ocb-sender

For more information about [ocb-sender](https://github.com/cenidetiot/OCB.jsLibrary) see its documentation.

#### Create an Entity in the ContextBroker
```js
	//Convert a Json to Ngsi
	var entity = ngsi.parseEntity('Room', 'Room1',{
		temperature : {
			value : 50 ,
			metadata : {
				frecuency: 40,
				scale: 'Celsious'
			}
		},
		dateStamp : new Date()
	})
	// Send to ContextBroker 
	cb.createEntity(entity)
	.then((result) => console.log(result))
	.catch((err) => console.log(err))
```

#### Update all the object attributes of a entity
```js
	//Convert a Json to Ngsi
	var attribute = ngsi.parseAttrs({
		temperature : {
			value : 50
		}
	})
	// Send to ContextBroker 
	cb.updateEntityAttrs('Room1', attribute)
	.then((result) => console.log(result))
	.catch((err) => console.log(err))
```
#### Update the JSON Object of a atttribute of the entity
```js
	//Convert a Json to Ngsi
	var value = ngsi.parseValue(50)
	
	// Send to ContextBroker 
	cb.updateJSONAttrEntity(
		'idEntity', 'nameAttribute', value
	)
	.then((result) => console.log(result))
	.catch((err) => console.log(err))
```

#### License 

MIT &copy; Daniel Torres & Haidée Onofre