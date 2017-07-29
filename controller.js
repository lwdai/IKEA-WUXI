var app = angular.module('ikea', []);
app.controller('productCtrl', function($scope, $http) {
    
    $scope.data = "";
    
    $http.get("http://localhost:8080/io?get").then(function(response) {
        $scope.data = response.data;
        
        $scope.Methods = Object.keys($scope.data.methodsPrice);
    });
    
    $scope.getOrderId = function() {
        return ("000000" + $scope.data.orderId).slice(-6);
    }
   
  
    $scope.date = new Date();
    
    $scope.regularProducts = [ ];    
    
    $scope.addRegularItem = function() {
        var newItem = { 
            part: "", 
            size: "",
            area: 0,
            method: "",
            cost: 0,
            no: 0,
            picture: "" 
        };
        $scope.regularProducts.push(newItem);
    }
    
    $scope.addRegularItem();
    
    $scope.removeRegularItem = function (id) {
        $scope.errortext = "";    
        $scope.regularProducts.splice(id, 1);
    }
    
    $scope.updateRegularProductCost = function (id) {
        var pd = $scope.regularProducts[id];
        if (pd.method in $scope.data.methodsPrice) {
            pd.cost = $scope.data.methodsPrice[pd.method] * pd.area;
        }
    }
    
    
    $scope.hardProducts = [ ];
    $scope.addHardItem = function() {
        var newItem = { 
            part: "", 
            type: "",
            no: 0,
            width: 0,
            height: 0,
            square: 0,
            cost: 0, 
        };
        $scope.hardProducts.push(newItem);
    }
    
    $scope.addHardItem();
    
    $scope.removeHardItem = function (id) {
        $scope.errortext = "";    
        $scope.hardProducts.splice(id, 1);
    }
    
    $scope.updateHardProductCost = function (id) {
        var pd = $scope.hardProducts[id];
        pd.cost = Math.ceil(pd.width*pd.height) * $scope.data.hardProductPrice;
    }
    
    // total cost
    $scope.getTotal = function () {
        var ret = 0;
        for ( i in $scope.regularProducts ) {
            ret += $scope.regularProducts[i].cost;
        }
        for ( i in $scope.hardProducts ) {
            ret += $scope.hardProducts[i].cost;
        }        
        
        return ret;
    }
    
    $scope.printPage = function() {

        // update data/orderId before printing
        $scope.data.orderId += 1;
        $http.get("http://localhost:8080/io?write=" + encodeURIComponent(JSON.stringify($scope.data)));
        
        document.title = $scope.name + '-' + $scope.phone + '-' + $scope.date.toDateString();
        window.print();               
    }
     
});
