cmr.controller('MountainListMapController', 
    ['$scope', '$location', '$routeParams', 'Mountains', 'MountainMapMarkers', 'uiGmapGoogleMapApi', 
    function($scope, $location, $routeParams, Mountains, MountainMapMarkers, GoogleMapApi) {

    $scope.regionId = Mountains.getRegionIdByRegionUrl($routeParams.state);
    $scope.markerEvents = {
        click: markerClick,
        mouseover: markerMouseOver,
        mouseout: markerMouseOut        
    };

    MountainMapMarkers.getRegionById($scope.regionId).then(function(data) {

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

            $scope.map = {
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

            regionUpdate($scope.regionId);

            //TODO: this is only for debugging
            // $scope.map.events = {                
            //     dragend: function() {
            //         console.log("drag end", $scope.map);
            //     }
            // };
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
        $location.path('/' + Mountains.getRegionUrlById(model.region) + '/' + model.url);
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

    /**
     * update the map to center and zoom on the region associated with the passed id
     */
    function regionUpdate(id) {

        //center map at coords associated with passed region id or fallback to defaults
        $scope.map.center = {
            latitude: MountainMapMarkers.constants[id].LAT || MountainMapMarkers.constants.LAT,
            longitude: MountainMapMarkers.constants[id].LON || MountainMapMarkers.constants.LON
        };
        $scope.map.zoom = MountainMapMarkers.constants[id].ZOOM || MountainMapMarkers.constants.ZOOM;

        //debug
        // console.log("regionUpdate", id, $scope.map);        
    }
}]);


