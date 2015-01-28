cmr.controller('MountainListController', 
    ['$scope', '$location', '$rootScope', '$routeParams', 'Mountains', 
    function($scope, $location, $rootScope, $routeParams, Mountains) {

    $scope.focusLocation = "";
    $scope.filterProps = {};
    $scope.filterProp = '-lat';
    $scope.filterType = 'lat';    
    $scope.filterLocation = {};
    $scope.filterReverse = true;
    $scope.region = Mountains.getRegionIdByRegionUrl($routeParams.state); //'all';

    console.log("$scope.region", $scope.region);

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

    $scope.mountainDetail = function(id, region) {
        $location.path('/mountains/' + Mountains.getRegionUrlById(region) + '/' + id);
    }

    $scope.regionChange = function() {
        var id = ($scope.region === 'all') ? '' : $scope.region;
        $scope.filterLocation = { state: id }
        $rootScope.$broadcast('regionChange', id);
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

        //debug
        $scope.regionChange();        
    });

}]);
