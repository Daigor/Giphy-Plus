
angular.module('app', ['ngAudio'])
.controller('animalAudio', function($scope, ngAudio){
  $scope.audio = ngAudio.load('test.mp3');
})
.controller('animalControl', function($scope, animalGiphy, ngAudio){
  $scope.display= ''
  $scope.imageFilePath = ''
  var animal = false;
  var verb = false;
  $scope.random = function(){
    animalGiphy.get().then(function(data){
      var randomIndex = Math.floor(Math.random()*data.length);
      var randomImage = data[randomIndex].images.original.url;
      $scope.imageFilePath = randomImage;
      $scope.display = data.animal.toUpperCase();
      animal = data.animal;
   
    });
    animal = true;
    verb = false;
  }
  $scope.verb = function(){
    if(animal && !verb){
      animalGiphy.verb($scope.display.toLowerCase()).then(function(data){
        if(data[0] !== undefined){
          var randomIndex = Math.floor(Math.random()*data.length);
          var randomImage = data[randomIndex].images.original.url;
          $scope.imageFilePath = randomImage;
          $scope.display = data.animal.toUpperCase() + " " + data.animalAction.toUpperCase();
        } else {
          alert('Pick a new animal, ' + data.animal + ' cant ' + data.animalAction);
        }
      });
    } else if(!animal && verb){
      alert('The animal can only do so much, stop abusing it')
    } else {
      alert('Pick an animal!');
    }
    verb = true;
    animal = false; 
  }
  $scope.describe = function(){

  }
})

.factory('animalGiphy', function($http){
  var animals = ['dog','horse','cat','tiger','unicorn','bear','panda', 'bird', 'fish'];
  var animalAction = ['jump', 'fly', 'swim', 'run', 'sleep', 'laugh'];
  var params = {};
  params.api_key = 'dc6zaTOxFJmzC';
  params.q = '';
  params.limit = 100;

  var get = function(){
    var randomAnimal = animals[Math.floor(Math.random()*animals.length)];
    params.q = "funny+" + randomAnimal;
    return $http.get('http://api.giphy.com/v1/gifs/search', {params: params}).then(function(res){
      res.data.data.animal = randomAnimal;
      return res.data.data;
    })
  } 
  var verb = function(animal){
  
    var randomVerb = animalAction[Math.floor(Math.random()*animalAction.length)];
   
    params.q = animal + '+' + randomVerb;
    return $http.get('http://api.giphy.com/v1/gifs/search', {params: params}).then(function(res){
      res.data.data.animal = animal;
      res.data.data.animalAction = randomVerb;
      return res.data.data;
    }, function(res){
      return 'failed';
    })
  }
  return {
    get: get,
    verb: verb 
  }
})