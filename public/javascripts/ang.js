var app = angular.module("myApp",[]);
app.controller("myCtrl",function($scope){
    $scope.formModel = {};
    $scope.onSubmit = function(){
    	console.log("I'm submitted!");
        console.log($scope.formModel);
};
});