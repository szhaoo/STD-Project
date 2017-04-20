angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

  .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'homeCtrl'
  })

  .state('map', {
    url: '/map',
    templateUrl: 'templates/map.html',
    controller: 'mapCtrl'
  })

  .state('clinicInfo', {
    url: '/page3',
    templateUrl: 'templates/clinicInfo.html',
    controller: 'clinicInfoCtrl'
  })

  .state('clinicServices', { 
    url: '/clinicServices/:clinic_id', 
    templateUrl: 'templates/clinicServices.html',
    controller: 'clinicServicesCtrl'
  })

  .state('response_display', {
    url:'/details/:ticket_id',
    templateUrl: 'templates/response_details.html',
    controller: 'response_display'
  })

$urlRouterProvider.otherwise('/home')

  

});