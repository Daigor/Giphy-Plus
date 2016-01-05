
angular.module('app', ['ngAudio'])
.controller('animalControl', function($scope, animalGiphy, ngAudio, audiomicro){
  $scope.display= ''
  $scope.imageFilePath = ''
  $scope.audio = ngAudio.load('http://www.freesound.org/data/previews/178/178878_1648170-lq.mp3');
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
  $scope.test = function(){
    $scope.audio.stop();
    if($scope.display){
      audiomicro.getAudio($scope.display.split(' ')[0]).then(function(data){
        var audioUrl = data.data.previews['preview-lq-mp3'];
        $scope.audio = ngAudio.load(audioUrl);
        $scope.audio.play();
      });
    }
    
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
.factory('audiomicro', function($http){
  var sounds = {
    dog: 'bark',
    horse : '',
    cat : '',
    tiger : '',
    unicorn : '',
    bear : '',
    panda : '',
    bird : '',
    fish : ''
  }
  var params = {};
  params.token = '188c0dfcceee1438b1fd439ce89cbd5039a6f3b2';
  // params.headers = headers;
  var getAudio = function(animal){

    //'http://www.freesound.org/apiv2/search/text/?query=piano' res.data.results is an array
    //get id from each array and then do another query
    //'http://www.freesound.org/apiv2/sounds/id'
    return $http.get('http://www.freesound.org/apiv2/search/text/?query=' + animal, {params:params}).then(function(res){
      var array = res.data.results;
      var randomId = array[Math.floor(Math.random()*array.length)].id
      // var randomId = array[0].id;
      return $http.get('http://www.freesound.org/apiv2/sounds/' + randomId, {params:params}).then(function(res){
        return res;
      })
    })
  }
  return {
    getAudio: getAudio
  }
})