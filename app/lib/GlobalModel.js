// This is a singleton class used to hold the current state (item selected etc)
var GlobalModel = (function() {
    var instantiated;
    function init() {
        // all singleton code goes here
        return {
            setClientSelected : function(client) {
                instantiated.clientSelected = client;
            },
            setSupplierSelected : function(supplier) {
                instantiated.supplierSelected = supplier;
            },
            getClientSelected : function() {
                return instantiated.clientSelected;
            },
            getSupplierSelected : function() {
                return instantiated.supplierSelected;
            }
        }
    }

    return {
        getInstance : function() {
            if (!instantiated) {
                instantiated = init();
            }
            return instantiated;
        }
    }
})()

// var GlobalModel = function() {
// var instance = {};
// //do something with instance
//
// GlobalModel.setClientSelected = function(client) {
// instance.clientSelected = client;
// }
//
// GlobalModel.setSupplierSelected = function(supplier) {
// instance.supplierSelected = supplier;
// }
//
// GlobalModel.getClientSelected = function() {
// return instance.clientSelected;
// }
//
// GlobalModel.getSupplierSelected = function() {
// return instance.supplierSelected;
// }
//
// //redefine "GlobalModel"
// GlobalModel = function() {
// return instance;
// }
// return instance;
// };