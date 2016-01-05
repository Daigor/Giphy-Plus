
angular.module('app', ['ngAudio'])
.controller('animalControl', function($scope, animalGiphy, ngAudio, audiomicro){
  $scope.display= '';
  $scope.imageFilePath = '';
  $scope.audiofile = '';
  $scope.saved = [];
  $scope.audio = ngAudio.load('http://www.freesound.org/data/previews/178/178878_1648170-lq.mp3');
  var animal = false;
  var verb = false;
  $scope.giphySave = function(){
    var data = {};
    var description = $scope.display;
    data.description = description;
    data.giphy = $scope.imageFilePath;
    data.sound = $scope.audiofile;
    animalGiphy.save(data).then(function(data){
      animalGiphy.update().then(function(data){
          $scope.saved = data;
      })
    });
  }
  $scope.nyancat = function(){
    $scope.audio.stop();
    var nyancat = 'http://i.giphy.com/LfbLBInuSRynK.gif';
    $scope.display = "NYAN CAT";
    $scope.imageFilePath = nyancat;
    $scope.audiofile = 'nyancat.mp3';
    $scope.audio = ngAudio.load('nyancat.mp3');
    $scope.audio.play();
  }
  $scope.setGiphy = function(idx){
    $scope.audio.stop();
    var obj = $scope.saved[idx];
    $scope.display = obj.description;
    $scope.audiofile = obj.sound;
    $scope.imageFilePath = obj.giphy;
    $scope.audio = ngAudio.load(obj.sound);
    $scope.audio.play();
  }
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
  $scope.soundbyte = function(){
    $scope.audio.stop();
    if($scope.display){
      audiomicro.getAudio($scope.display.split(' ')[0]).then(function(data){
        var audioUrl = data.data.previews['preview-lq-mp3'];
        $scope.audiofile = audioUrl;
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
  
})
.factory('animalGiphy', function($http){
  var animals = ['dog','horse','cat','tiger','unicorn','bear','panda', 'bird', 'fish'];
  var animalAction = ['jump', 'fly', 'swim', 'run', 'sleep', 'laugh'];
  var params = {};
  params.api_key = 'dc6zaTOxFJmzC';
  params.q = '';
  params.limit = 100;

  var update = function(){
    return $http.get('/api/giphy').then(function(res){
      return res.data;
    })
  }
  var get = function(){
    var randomAnimal = animals[Math.floor(Math.random()*animals.length)];
    params.q = "funny+" + randomAnimal;
    return $http.get('http://api.giphy.com/v1/gifs/search', {params: params}).then(function(res){
      res.data.data.animal = randomAnimal;
      return res.data.data;
    })
  };
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
  };
  var save = function(data){
    
    return $http.post('/api/giphy', data).then(function(res){
      return res.data;
    })
  }

  return {
    get: get,
    verb: verb,
    save: save,
    update, update
  }
})
.factory('audiomicro', function($http){
  var sounds = {
    dog: 'bark',
    horse : 'neigh',
    cat : 'meow',
    tiger : 'roar',
    unicorn : '',
    bear : 'roar',
    panda : '',
    bird : 'chirp',
    fish : ''
  }
  var params = {};
  params.token = '188c0dfcceee1438b1fd439ce89cbd5039a6f3b2';
  // params.headers = headers;
  var getAudio = function(animal){

    //'http://www.freesound.org/apiv2/search/text/?query=piano' res.data.results is an array
    //get id from each array and then do another query
    //'http://www.freesound.org/apiv2/sounds/id'
    return $http.get('http://www.freesound.org/apiv2/search/text/?query=' + animal + "+" + sounds[animal.toLowerCase()], {params:params}).then(function(res){
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