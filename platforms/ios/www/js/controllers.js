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

.controller('DetailCtrl', function($scope, $stateParams, $location, $ionicModal, $ionicViewService, FirebaseService) {
    $scope.equipment = FirebaseService.equipment();
    $scope.loans = FirebaseService.loans();
    
    if ($scope.equipment.$getRecord($stateParams.id) !== null) {
         $scope.e = $scope.equipment.$getRecord($stateParams.id);
        $scope.e.previousLoans.reverse();

         $scope.name = $scope.e.make + " " + $scope.e.model;
        $scope.loan = false;
    } else {
         $scope.e = $scope.loans.$getRecord($stateParams.id);
        $scope.name = $scope.e.device;
        $scope.loan = true;
    }
    
    $scope.delete = function() {
            
    }
    
    $ionicModal.fromTemplateUrl('templates/deleteModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.delete = function() {
            $scope.equipment.$remove($scope.e);
            $ionicViewService.clearHistory();
            $location.path("/loans");
            $scope.closeModal();
        }
        
      });
      $scope.openModal = function() {
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });

      $scope.$on('modal.removed', function() {

      });
    
    $scope.check = function(e) {
        if (e.name === "nothing") return false;
        else return true;
    }
    
    $scope.availability = function(product) {
        if (product.available) return "Ledig";
        else return "Utlånt";
    };
    
    $scope.startLoan = function() {
        console.log("test");
        $location.path("/tab/loan/" + $scope.e.$id);
      }
})

.controller('LoanDetailCtrl', function($scope, $stateParams, $location, $ionicViewService, FirebaseService) {
    $scope.loans = FirebaseService.loans();
    $scope.equipment = FirebaseService.equipment();
    
    $scope.e = $scope.loans.$getRecord($stateParams.id);
    $scope.eq = $scope.equipment.$getRecord($scope.e.id);

    
    $scope.availability = function(product) {
        if (product.available) return "Ledig";
        else return "Utlånt";
    };
    
     $scope.return = function() {
        $scope.eq.available = true;
        $scope.loans.$remove($scope.e);
        $scope.equipment.$save($scope.eq);
        $ionicViewService.clearHistory();
        $location.path("/loans/");
    }
})


.controller('StartLoanCtrl', function($scope, $stateParams, $location, FirebaseService) {
    $scope.equipment = FirebaseService.equipment();
    $scope.loans = FirebaseService.loans();
    
    $scope.e = $scope.equipment.$getRecord($stateParams.id);
    
    $scope.loan = {'device':$scope.e.make + " " + $scope.e.model, 'days':7};
    
    $scope.accs = [];
    
    $scope.addAcc = function(a) {
        $scope.accs.push(a);
    }
   
    
    $scope.startLoan = function(loan) {
        $scope.e.available = false;
        loan.loandate = new Date();

        loan.id = $scope.e.$id;
        loan.accs = $scope.accs;
        $scope.e.previousLoans.push({'name':loan.loanee, 'phone':loan.phonenumber});
        $scope.loans.$add(loan);
        var temp = angular.copy($scope.e.previousLoans);
        $scope.e.previousLoans = temp;
        
        $scope.equipment.$save($scope.e);
        $location.path('/utstyr/');
    };

})

.controller('AddCtrl', function($scope, $location, FirebaseService) {
      $scope.equipment = FirebaseService.equipment();
    $scope.return = function(e) {
        $location.path("/tab/return/" + e.$id);
      }
    
    
    $scope.add = function(product) {
        product.previousLoans = [{'name':'nothing', 'phone':'nope'}];
        product.available = true;
        console.log(product);
        $scope.equipment.$add(product);
        $location.path("/utstyr/");
    }
    
    $scope.showAccs = false;
})
.controller('ReturnCtrl', function($scope, $stateParams, $location, $ionicViewService, FirebaseService) {
    $scope.equipment = FirebaseService.equipment();
    $scope.loans = FirebaseService.loans();

    $scope.loan = $scope.loans.$getRecord($stateParams.id);
    
    if ($stateParams.id === null) {
        $location.path('/loans');
    } else {
        $scope.e = $scope.equipment.$getRecord($scope.loan.id);
    }
    
    
    $scope.return = function() {
        $scope.e.available = true;
        $scope.loans.$remove($scope.loan);
        $scope.equipment.$save($scope.equipment.indexOf($scope.e));
        $ionicViewService.clearHistory();
        $location.path("/loans");
    }
    
});