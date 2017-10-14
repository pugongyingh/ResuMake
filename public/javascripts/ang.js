var app = angular.module("myApp",[]);
app.controller("myCtrl",function($scope,$http,$rootScope){
    $scope.formModel = {};
    $scope.isLoggedIn = false;
    $scope.onSubmit = function(){
    	console.log("I'm submitted!");
        console.log($scope.formModel);
	};
	$scope.isLoggedIn = function(){
        	$http.get('/checklogin').success(function(data){
        		console.log(data);
        		$rootScope.loggedIn = data;
        	}).error(function(data){
        		console.log('error: '+data);
        });
    };
});