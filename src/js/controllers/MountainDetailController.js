cmr.controller('MountainDetailController', ['$scope', '$routeParams', 'Mountains', function($scope, $routeParams, Mountains) {

    $scope.breadcrumb = {
        regionName: '',
        regionUrl: '',
        mountainName: ''
    }
    $scope.mountain = {
        photos: []
    }

    //TODO: error handling on ID
    Mountains.getMountainById($routeParams.id).then(function(data) {

        $scope.mountain = data;
        $scope.region = Mountains.getRegionNameById(data.state);

        $scope.breadcrumb = {
            regionUrl: Mountains.getRegionUrlById(data.state),
            regionName: $scope.region,
            mountainName: data.name
        }

        // $scope.map = {
        //     center: {
        //         latitude: $scope.mountain.lat,
        //         longitude: $scope.mountain.lon
        //     },
        //     zoom: 11,
        //     options: {
        //         mapTypeId: google.maps.MapTypeId.TERRAIN 
        //     }
        // }
    });

    //default map
    //TODO: do not render map (with default data), wait to render until real data has arrived
    $scope.map = {
        center: {
            latitude: 45,
            longitude: -73
        },
        zoom: 11
    };

    //TODO: make service or filter
    //TODO: only used by breadcrumb? move to breadcrumb directive
    // $scope.stateFormat = function() {
    //     if ($scope.mountain.state) {
    //        return Mountains.getRegionNameById($scope.mountain.state); 
    //     } else {
    //         return '';
    //     }
    // }

}]);
