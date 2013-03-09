var GlobalModel = function() {
    function init() {
        return {
            setClientSelected: function(client) {
                instantiated.clientSelected = client;
            },
            setSupplierSelected: function(supplier) {
                instantiated.supplierSelected = supplier;
            },
            getClientSelected: function() {
                return instantiated.clientSelected;
            },
            getSupplierSelected: function() {
                return instantiated.supplierSelected;
            }
        };
    }
    var instantiated;
    return {
        getInstance: function() {
            instantiated || (instantiated = init());
            return instantiated;
        }
    };
}();