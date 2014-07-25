cmr.controller('MountainListMapController', ['$scope', '$location', 'Mountain', function($scope, $location, Mountain) {

    //TODO: move to controller?
    var DEFAULT_LAT = 45.14353713591516;
    var DEFAULT_LON = -121.955078125;
    var DEFAULT_ZOOM = 6;

    $scope.markers = [];
    $scope.markerCoords = [];
    $scope.markerOptions = [];
    $scope.nameTitleMap = {};

    $scope.map = {
        center: {
            latitude: DEFAULT_LAT,
            longitude: DEFAULT_LON
        },
        zoom: DEFAULT_ZOOM,
        options: {
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            streetViewControl: false,
            disableDefaultUI: true
        },
        events: {
            dragend: function() {
                console.log("drag end", $scope.map);
                window.ben = $scope.map;
            }
        },
        label: null 
    };

    $scope.markerEvents = {
        click: markerClick,       
        mouseover: markerMouseOver,
        mouseout: markerMouseOut
    };

    //watch for mountainlist focus events
    $scope.$on('mountainListFocus', function(e, name) {

        //set map center to coords for specified mountain
        $scope.map.center = {
            latitude: $scope.nameTitleMap[name].lat,
            longitude: $scope.nameTitleMap[name].lon
        }
        $scope.map.zoom = 8;
    });

    $scope.$on('mountainListBlur', function(e, name) {

        //set map center to coords to default view
        $scope.map.center = {
            latitude: DEFAULT_LAT,
            longitude: DEFAULT_LON
        }
        $scope.map.zoom = DEFAULT_ZOOM;
    });    

    function markerClick(marker, e) {
        
        //get the mountain title, map that to internal ID, and redirect page
        var id = $scope.nameTitleMap[marker.getTitle()]._id;
        $location.path('/mountains/' + id);
        $scope.$apply();

    }

    function markerMouseOver(marker, e) {
        $scope.map.label = $scope.nameTitleMap[marker.getTitle()].name;
        $scope.$apply();
    }

    function markerMouseOut(marker, e) {
        $scope.map.label = null;
        $scope.$apply();
    }

    Mountain.query(function(data) {

        $scope.mountains = data;

        //create a list of marker coords + options for the mountain list map
        var markersList = [];

        for (var n in $scope.mountains) {
            if ($scope.mountains[n].hasOwnProperty('lat')) {

                markersList.push({
                    coords: {
                        latitude: $scope.mountains[n].lat,
                        longitude: $scope.mountains[n].lon
                    },
                    options: {
                        title: $scope.mountains[n].name,
                        icon: {
                            url: '/images/map-marker-icon.png'
                        }
                    }
                }); 

                //update dictionary of titles to mountains              
                $scope.nameTitleMap[$scope.mountains[n].name] = $scope.mountains[n];
            }
        }

        //save list of markers
        $scope.markers = markersList;
    });
}]);
