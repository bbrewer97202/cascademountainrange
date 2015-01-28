var cmr = angular.module('cmr', [
    'ngResource', 
    'ngRoute',
    'uiGmapgoogle-maps'
]);

//TODO: break into different modules

cmr.config(['uiGmapGoogleMapApiProvider', '$routeProvider', function(GoogleMapApi, $routeProvider) {

    //maps
    GoogleMapApi.configure({
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });

    //routes
    $routeProvider
        .when('/mountains', {
            templateUrl: 'partials/homepage.html'
        })
        .when('/mountains/:state', {
            templateUrl: 'partials/region.html'
        })
        .when('/mountains/:state/:id', {
            templateUrl: 'partials/mountain-detail.html',
            controller: 'MountainDetailController'   
        })
        .otherwise({
            redirectTo: '/mountains'
        });
    
}]);


