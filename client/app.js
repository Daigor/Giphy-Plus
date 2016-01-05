
angular.module('app', ['ngAudio', 'ui.router', 'services'])
.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/login');
  $stateProvider
    .state('home', {
      url:'/',
      templateUrl: 'home/giphy.html'
    })
    .state('login', {
      url:'/login',
      templateUrl: 'login/login.html'
    })
    .state('signup', {
      url:'/signup',
      templateUrl: 'login/signup.html'
    })
})
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
