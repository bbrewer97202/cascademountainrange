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



cmr.controller('MountainDetailController', ['$scope', '$routeParams', 'Mountain', function($scope, $routeParams, Mountain) {

    //TODO error handling on ID
    Mountain.get({ id: $routeParams.id }, function(data) {
        $scope.mountain = data;
    });

    $scope.stateFormat = function() {
        switch ($scope.mountain.state) {
            case 'CA':
                return 'California';
                break;
            case 'OR':
                return 'Oregon';
                break;
            case 'WA':
                return 'Washington';
                break;
            default:
                return ''
        }
    }

}]);

cmr.controller('MountainListController', ['$scope', 'Mountain', function($scope, Mountain) {

    Mountain.query(function(data) {
        $scope.mountains = data;
    });

}]);

cmr.factory('Mountain', function($resource) {
    return $resource('/api/mountains/:id');
});
