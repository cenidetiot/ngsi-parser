var ngsi  =  require("./lib/NGSI")
var a =0 ;
console.log(Object.prototype.toString.call(undefined))
console.log(Object.prototype.toString.call({}))


var attribute = ngsi.parseAttrs({
    j : {},
    j4: {
        value : undefined
    },

/*    j2: {
        type:'geo:point',
         value: [0,1]
    },
    j3: {
        value: [0,1]
    },
    j4: {
        value : undefined
    },
    j5: {
        type: 'geo',
        value : undefined
    },
    j6: {
        value : undefined,
        metadata :{
            a:3,
            b:false
        }
    }, */

})
console.log(attribute)
