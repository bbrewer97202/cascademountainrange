cmr.controller('MountainListController', ['$scope', '$rootScope', 'Mountains', function($scope, $rootScope, Mountains) {

    $scope.focusLocation = "";
    $scope.filterProps = {};
    $scope.filterProp = '-lat';
    $scope.filterType = 'lat';    
    $scope.filterLocation = {};
    $scope.filterReverse = true;

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

    $scope.geoBoundaryChange = function(id) {
        $scope.filterLocation = { state: id }
        $rootScope.$broadcast('geoTargetChange', id);
    }

    $scope.setFilter = function(id) {
        if (id === $scope.filterType) {
            if ($scope.filterProp.indexOf('-') < 0) {
                $scope.filterProp = '-' + id;
                $scope.filterReverse = true;
            } else {
                $scope.filterProp = id;
                $scope.filterReverse = false;
            }
        } else {
            $scope.filterProp = id;
            $scope.filterType = id;
            $scope.filterReverse = false;
        }
    }

    Mountains.get(function(data) {
        $scope.mountains = data;
    });

}]);
