var cmr = angular.module('cmr', ['ngResource']);



cmr.controller('Something', ['$scope', 'Mountain', function($scope, Mountain) {

    Mountain.query(function(data) {
        $scope.mountains = data;
    });

}]);

cmr.factory('Mountain', function($resource) {
    return $resource('/api/mountains/:id');
});
