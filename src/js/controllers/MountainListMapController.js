cmr.controller('MountainListMapController', 
    ['$scope', '$location', 'MountainMapMarkers', 'uiGmapGoogleMapApi', 
    function($scope, $location, MountainMapMarkers, GoogleMapApi) {

    //TODO: move to service
    // var DEFAULT_LAT = 45.14353713591516;
    // var DEFAULT_LON = -121.955078125;
    // var DEFAULT_ZOOM = 6;

    var DEFAULT_LAT = 44.087029720084644;
    var DEFAULT_LON = -120.78863799999999;
    var DEFAULT_ZOOM = 5;

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

        //debug
        // console.log("markers init", $scope.markers);

        //map init
        GoogleMapApi.then(function(maps) {

            $scope.googleVersion = maps.version;
            maps.visualRefresh = true;

            //debug
            $scope.geocoder = new google.maps.Geocoder();

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
                    scrollwheel: false,
                    zoomControl: true,
                    zoomControlOptions: {
                       style: google.maps.ZoomControlStyle.SMALL
                    }                    
                },
                events: {                
                    dragend: function() {
                        //TODO: this is only for debugging
                        console.log("drag end", $scope.map);
                    }
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

    $scope.$on('regionChange', function(e, id) {

        //TODO: clean up and move to service

        var lat = DEFAULT_LAT;
        var lon = DEFAULT_LON;
        var zoom = DEFAULT_ZOOM;

        switch (id) {
            case 'or':
                lat = 44.06414336303867;
                lon = -121.88916015625;
                zoom = 7;
                break;
            case 'wa':
                lat = 47.38369696135246;
                lon = -121.1640625;
                zoom = 7;
                break; 
            case 'ca':
                lat = 39.793490785895294;
                lon = -121.39048385620117;
                zoom = 7;
                break; 
            case 'bc':
                lat = 49.66450788807946;
                lon = -121.44601631164551;
                zoom = 8;
                break;                 
            default: 
        }

        $scope.map.center = {
            latitude: lat,
            longitude: lon
        };
        $scope.map.zoom = zoom;
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


