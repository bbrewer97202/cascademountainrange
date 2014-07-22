cmr.controller('MountainListController', ['$scope', 'Mountain', function($scope, Mountain) {

    Mountain.query(function(data) {
        $scope.mountains = data;
    });

}]);
