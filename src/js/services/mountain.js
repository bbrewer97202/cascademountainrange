cmr.factory('Mountain', ['$resource', function($resource) {
    return $resource('/api/mountains/:id');
}]);
