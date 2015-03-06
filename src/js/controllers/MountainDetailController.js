cmr.controller('MountainDetailController', 
    ['$scope', '$routeParams', 'Mountains', 'uiGmapGoogleMapApi', 
    function($scope, $routeParams, Mountains, GoogleMapApi) {

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

        //map init
        GoogleMapApi.then(function(maps) {

            $scope.googleVersion = maps.version;
            maps.visualRefresh = true;

            $scope.map = {
                center: {
                    latitude: $scope.mountain.lat,
                    longitude: $scope.mountain.lon
                },
                zoom: 11,                
                options: {
                    mapTypeId: google.maps.MapTypeId.TERRAIN,
                    streetViewControl: false,
                    disableDefaultUI: true,
                    scrollwheel: false,
                    zoomControl: true,
                    zoomControlOptions: {
                       style: google.maps.ZoomControlStyle.SMALL
                    }        
                }
            };
        });
    });
}]);
