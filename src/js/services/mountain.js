cmr.factory('Mountain', function($resource) {
    return $resource('/api/mountains/:id');
});
