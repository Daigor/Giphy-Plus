angular.module('auth', ['services'])
  .controller('login', function($scope, Auth, $location){
    //$scope.user = object with password and username properties from form when submitted

    $scope.signin = function(){
      var user = $scope.user;
      $scope.user = {};
      Auth.login(user).then(function(data){
        console.log(data);
        $location.path('/')
      }, function(err){
        alert('incorrect username or password')
      });
    }
    $scope.signup = function(){
      var user = $scope.user;
      $scope.user = {};
      Auth.signup(user).then(function(data){
       
        $location.path('/')
      }, function(err){
        alert('user exists')
      });
    }
  })
