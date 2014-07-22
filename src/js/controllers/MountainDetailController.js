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
