cmr.controller('MountainListController', ['$scope', 'Mountain', function($scope, Mountain) {

    $scope.filterProps = {};
    $scope.filterLocation = {};

    Mountain.query(function(data) {
        $scope.mountains = data;
    });

}]);
