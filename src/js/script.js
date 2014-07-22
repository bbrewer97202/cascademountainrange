var cmr = angular.module('cmr', [
    'ngResource', 
    'ngRoute'
]);

cmr.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/mountains', {
                templateUrl: 'partials/mountain-list.html',
                controller: 'MountainListController'
            }).
            when('/mountains/:id', {
                templateUrl: 'partials/mountain-detail.html',
                controller: 'MountainDetailController'                
            }).otherwise({
                redirectTo: '/mountains'
            });
    }    
]);


