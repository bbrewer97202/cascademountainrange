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
        .when('/', {
            templateUrl: 'partials/homepage.html'
        })
        .when('/:state', {
            templateUrl: 'partials/mountain-list.html'
        })
        .when('/:state/:id', {
            templateUrl: 'partials/mountain-detail.html',
            controller: 'MountainDetailController'   
        })
        .otherwise({
            redirectTo: '/'
        });
    
}]);


