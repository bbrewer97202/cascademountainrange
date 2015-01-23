cmr.controller('MountainListMapController', 
    ['$scope', '$location', 'MountainMapMarkers', 'uiGmapGoogleMapApi', 
    function($scope, $location, MountainMapMarkers, GoogleMapApi) {

    //TODO: move to service
    var DEFAULT_LAT = 45.14353713591516;
    var DEFAULT_LON = -121.955078125;
    var DEFAULT_ZOOM = 6;

    $scope.markerEvents = {
        click: markerClick,
        mouseover: markerMouseOver,
        mouseout: markerMouseOut        
    };

    MountainMapMarkers.get().then(function(data) {

        $scope.markers = data.data;  
        $scope.markersById = {};

        //create a quick lookup table of markers by CMR id
        for (var i=0; i < data.data.length; i++) {
            $scope.markersById[data.data[i].id] = i;
        }

        console.log("markers init", $scope.markers);

        //map init
        GoogleMapApi.then(function(maps) {

            $scope.googleVersion = maps.version;
            maps.visualRefresh = true;

            $scope.map = {
                center: {
                    latitude: DEFAULT_LAT,
                    longitude: DEFAULT_LON
                },
                zoom: DEFAULT_ZOOM,
                options: {
                    mapTypeId: google.maps.MapTypeId.TERRAIN,
                    streetViewControl: false,
                    disableDefaultUI: true,
                    scrollwheel: false
                }
            };
        });
    });    

    //watch for mountainlist focus events
    $scope.$on('mountainListFocus', function(e, id) {

        //unfocus any existing focused marker
        if ($scope.markerFocusedById !== id) {
            markerUnfocus($scope.markerFocusedById);
        }

        //set map center to coords for specified mountain
        $scope.markers[$scope.markersById[id]].show = true;
        $scope.markerFocusedById = id;
    });

    $scope.$on('mountainListBlur', function(e) {
        markerUnfocus($scope.markerFocusedById);
    });

    /**
     * handle click of a marker
     */
    function markerClick(gMarker, eventName, model) {
        $location.path('/mountains/' + model.id);
        $scope.$apply();        
    }

    /**
     * handle mouseover of a marker
     */
    function markerMouseOver(gMarker, eventName, model) {
        model.show = true;
        $scope.$apply();
    }

    /**
     * handle mouseout event on a marker
     */
    function markerMouseOut(gMarker, eventName, model) {
        model.show = false;
        $scope.$apply();
    }

    /**
     * turn off a window/label of a marker for the passed id
     */
    function markerUnfocus(id) {
        if (typeof id !== 'undefined') {
            $scope.markers[$scope.markersById[id]].show = false;
            $scope.markerFocusedById = undefined;
        }
    }

}]);



// cmr.controller('MountainListMapController', ['$scope', '$location', 'Mountain', 'uiGmapGoogleMapApi', function($scope, $location, Mountain, GoogleMapApi) {

//     //TODO: move to service
//     var DEFAULT_LAT = 45.14353713591516;
//     var DEFAULT_LON = -121.955078125;
//     var DEFAULT_ZOOM = 6;

//     $scope.markers = [];
//     $scope.markerCoords = [];
//     $scope.markerOptions = [];
//     $scope.nameTitleMap = {};

//     $scope.map = {
//         center: {
//             latitude: DEFAULT_LAT,
//             longitude: DEFAULT_LON
//         },
//         zoom: DEFAULT_ZOOM,
//         options: {
//             mapTypeId: google.maps.MapTypeId.TERRAIN,
//             streetViewControl: false,
//             disableDefaultUI: true,
//             scrollwheel: false
//         },
//         events: {
//             dragend: function() {
//                 console.log("drag end", $scope.map);
//                 window.ben = $scope.map;
//             }
//         },
//         label: {
//             title: null,
//             x: 0,
//             y: 0
//         }
//     };

//     $scope.markerEvents = {
//         click: markerClick,
//         mouseover: markerMouseOver,
//         mouseout: markerMouseOut
//     };

//     //watch for mountainlist focus events
//     $scope.$on('mountainListFocus', function(e, name) {

//         //set map center to coords for specified mountain
//         $scope.map.center = {
//             latitude: $scope.nameTitleMap[name].lat,
//             longitude: $scope.nameTitleMap[name].lon
//         }
//         $scope.map.zoom = 8;
//     });

//     $scope.$on('mountainListBlur', function(e, name) {

//         //set map center to coords to default view
//         $scope.map.center = {
//             latitude: DEFAULT_LAT,
//             longitude: DEFAULT_LON
//         }
//         $scope.map.zoom = DEFAULT_ZOOM;
//     });

//     function markerClick(marker, e) {

//         //get the mountain title, map that to internal ID, and redirect page
//         var id = $scope.nameTitleMap[marker.getTitle()]._id;
//         $location.path('/mountains/' + id);
//         $scope.$apply();

//     }

//     function markerMouseOver(marker, e, f) {
//         $scope.map.label.title = $scope.nameTitleMap[marker.getTitle()].name;
//         $scope.$apply();
//     }

//     function markerMouseOut(marker, e) {
//         $scope.map.label.title = null;
//         $scope.$apply();
//     }


