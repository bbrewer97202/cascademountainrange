cmr.controller('MountainListMapController', ['$scope', '$location', 'Mountain', function($scope, $location, Mountain) {

    $scope.markers = [];
    $scope.markerCoords = [];
    $scope.markerOptions = [];
    $scope.nameTitleMap = {};

    $scope.map = {
        center: {
            latitude: 45.14353713591516,
            longitude: -121.955078125
        },
        zoom: 6,
        options: {
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            streetViewControl: false
        },
        events: {
            dragend: function() {
                console.log("drag end", $scope.map);
                window.ben = $scope.map;
            }
        }    
    };

    $scope.markerEvents = {
        click: markerClick,       
        // mouseover: markerMouseOver,
        // mouseout: markerMouseOut
    };
    function markerClick(marker, e) {
        
        //get the mountain title, map that to internal ID, and redirect page
        var id = $scope.nameTitleMap[marker.getTitle()];
        $location.path('/mountains/' + id);
        $scope.$apply();

    }
    // function markerMouseOver(marker, e) {
    //     console.log("on marker over");
    // }
    // function markerMouseOut(marker, e) {
    //     console.log("on marker out");
    // }

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

                //update dictionary of titles to mountain ids              
                $scope.nameTitleMap[$scope.mountains[n].name] = $scope.mountains[n]._id;
            }
        }

        //save list of markers
        $scope.markers = markersList;
    });
}]);
