cmr.controller('MountainListController', ['$scope', '$rootScope', 'Mountain', function($scope, $rootScope, Mountain) {

    $scope.focusLocation = "";
    $scope.filterProps = {};
    $scope.filterLocation = {};

    $scope.mountainFocus = function(name) {    
        if (name !== $scope.focusLocation) {            
            $rootScope.$broadcast('mountainListFocus', name);
            $scope.focusLocation = name;
        }
    }

    $scope.mountainBlur = function() {
        $rootScope.$broadcast('mountainListBlur');
        $scope.focusLocation = "";
    }

    Mountain.query(function(data) {
        $scope.mountains = data;
    });

}]);
