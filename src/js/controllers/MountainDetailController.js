cmr.controller('MountainDetailController', ['$scope', '$routeParams', 'Mountains', function($scope, $routeParams, Mountains) {

    $scope.mountain = {
        photos: []
    }

    //TODO: error handling on ID
    Mountains.getMountainById($routeParams.id).then(function(data) {

        console.log("got mountain " + $routeParams.id + ": ", data);

        $scope.mountain = data;
        $scope.map = {
            center: {
                latitude: $scope.mountain.lat,
                longitude: $scope.mountain.lon
            },
            zoom: 11,
            options: {
                mapTypeId: google.maps.MapTypeId.TERRAIN 
            }
        }
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

    //TODO: handle Canada
    //TODO: make service or filter
    $scope.stateFormat = function() {

        if ($scope.mountain) {
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
        } else {
            return '';
        }
    }

}]);
