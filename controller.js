var app = angular.module('ikea', []);
app.controller('productCtrl', function($scope, $http) {
    
    $scope.data = "";
    
    $http(
      {
        method: "GET",
        url: 'http://localhost:8080/io?get',
        headers : {
          'Content-Type' : 'application/json; charset=UTF-8'
        }
      } ).then(function mySuccess(response) {
      $scope.data = response.data;
      $scope.Methods = Object.keys($scope.data.methodsPrice);
      $scope.Types = Object.keys($scope.data.hardProductPrice);
    }, function myError(err) {
      console.log(err)
      console.log($scope.data)
    });    
    
    $scope.getOrderId = function() {
        return ("000000" + $scope.data.orderId).slice(-6);
    }
   
  
    $scope.date = new Date();
    
    //Regular Products 
    $scope.regularProducts = [ ];    
    
    $scope.addRegularItem = function() {
        var newItem = { 
            part: "", 
            size: "",
            number: 0,
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
    
    $scope.updateRegularProductCost = function (el) {
        console.log(el)
        var id = el.$index;
        var sum = 0;
        var pd = $scope.regularProducts[id];

        var selectedValues = el.p.method
        for (var value of selectedValues) {   
            if (value in $scope.data.methodsPrice) {
                sum += $scope.data.methodsPrice[value] * pd.number;
            }
        }

        pd.cost = sum;
    }
    
    //Hard Products
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
    
    $scope.updateHardProductCost = function (el) {
        console.log(el)
        var id = el.$index;
        var sum = 0;
        var pd = $scope.hardProducts[id];

        var selectedValues = el.p.type
            if (selectedValues in $scope.data.hardProductPrice) {
                if (pd.width*pd.height <= 1) {
                   sum += $scope.data.hardProductPrice[selectedValues] * 1;
                } else {
                   sum += $scope.data.hardProductPrice[selectedValues] * pd.width*pd.height;
                }
                
            }
        pd.cost = sum;
    }

    //rail products 
    $scope.railProducts = [ ];
    $scope.addRailItem = function() {
        var newItem = {
            type: "",
            singleLength: 0,
            doubleLength: 0,
            cost: 0,
        };
        $scope.railProducts.push(newItem);
    }

    $scope.addRailItem();

    $scope.removeRailItem = function(id) {
        $scope.errortext = "";
        $scope.railProducts.splice(id, 1);
    }

    $scope.updateRailProductCost = function (id) {
        var pd = $scope.railProducts[id];
        pd.cost = pd.singleLength * 50 + pd.doubleLength * 80;
    }
    $scope.installation = 0;
    // total cost
    $scope.getTotal = function () {
        var ret = 0;
        for ( i in $scope.regularProducts ) {
            ret += $scope.regularProducts[i].cost;
        }
        for ( i in $scope.hardProducts ) {
            ret += $scope.hardProducts[i].cost;
        }        
        for ( i in $scope.railProducts ) {
            ret += $scope.railProducts[i].cost;
        }        
        ret += $scope.installation;
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
