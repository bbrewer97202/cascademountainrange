cmr.controller('MountainListController', ['$scope', '$rootScope', 'Mountains', function($scope, $rootScope, Mountains) {

    $scope.focusLocation = "";
    $scope.filterProps = {};
    $scope.filterLocation = {};

    $scope.mountainFocus = function(id) {    
        if (id !== $scope.focusLocation) {            
            $rootScope.$broadcast('mountainListFocus', id);
            $scope.focusLocation = id;
        }
    }

    $scope.mountainBlur = function() {
        $rootScope.$broadcast('mountainListBlur');
        $scope.focusLocation = "";
    }

    Mountains.get(function(data) {
        $scope.mountains = data;
    });

}]);
