angular.module('services', [])
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