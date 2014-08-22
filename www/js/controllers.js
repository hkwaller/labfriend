angular.module('starter.controllers', [])

.controller('LoanCtrl', function($scope, $location, FirebaseService) {
    $scope.loans = FirebaseService.loans();
    
    $scope.return = function(e) {
        $location.path("/tab/return/" + e.$id);
      }
    $scope.data = {'showDelete':true};
})

.controller('EquipCtrl', function($scope, $location, FirebaseService) {
  $scope.equipment = FirebaseService.equipment();
    
  $scope.startLoan = function(e) {
    $location.path("/tab/loan/" + e.$id);
  }
  
  $scope.gotoAdd = function() {
    $location.path("/tab/add/");
  }
  
})

.controller('DetailCtrl', function($scope, $stateParams, $location, FirebaseService) {
    $scope.equipment = FirebaseService.equipment();
    $scope.loans = FirebaseService.loans();
    
    if ($scope.equipment.$getRecord($stateParams.id) !== null) {
         $scope.e = $scope.equipment.$getRecord($stateParams.id);
         $scope.name = $scope.e.make + " " + $scope.e.model;
        $scope.loan = false;
    } else {
         $scope.e = $scope.loans.$getRecord($stateParams.id);
        $scope.name = $scope.e.device;
        $scope.loan = true;
    }
    
    console.log($scope.e);
    
    $scope.availability = function(product) {
        if (product.available) return "Ledig";
        else return "Utlånt";
    };
    
    $scope.startLoan = function() {
        console.log("test");
        $location.path("/tab/loan/" + $scope.e.$id);
      }
})

.controller('StartLoanCtrl', function($scope, $stateParams, $location, FirebaseService) {
    $scope.loans = FirebaseService.loans();
    $scope.equipment = FirebaseService.equipment();
    
    $scope.e = $scope.equipment.$getRecord($stateParams.id);
    
    $scope.loan = {'device':$scope.e.make + " " + $scope.e.model, 'days':7};

    $scope.startLoan = function(loan) {
        $scope.e.available = false;
        loan.date = new Date();
        loan.id = $scope.e.$id;
        $scope.loans.$add(loan);
        $scope.equipment.$save($scope.equipment.indexOf($scope.e));
        $location.path('/utstyr/');
    };

})

.controller('AddCtrl', function($scope, $location, FirebaseService) {
      $scope.equipment = FirebaseService.equipment();

    $scope.return = function(e) {
        $location.path("/tab/return/" + e.$id);
      }
    
    $scope.add = function(product) {
        product.available = true;
        $scope.equipment.$add(product);
        $location.path("/utstyr/");
    }
})
.controller('ReturnCtrl', function($scope, $stateParams, $location, FirebaseService) {
    $scope.equipment = FirebaseService.equipment();
    $scope.loans = FirebaseService.loans();

    $scope.loan = $scope.loans.$getRecord($stateParams.id);
    $scope.e = $scope.equipment.$getRecord($scope.loan.id);
    
    $scope.return = function() {
        $scope.e.available = true;
        $scope.loans.$remove($scope.loan);
        $scope.equipment.$save($scope.equipment.indexOf($scope.e));
        $location.path("/tab/loans/");
    }
    
});