var cmr = angular.module('cmr', [
    'ngResource', 
    'ngRoute',
    'uiGmapgoogle-maps'
]);

//TODO: break into different modules

cmr.config(['uiGmapGoogleMapApiProvider', '$routeProvider', function(GoogleMapApi, $routeProvider) {

    //maps
    GoogleMapApi.configure({
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });

    //routes
    $routeProvider.
        when('/mountains', {
            templateUrl: 'partials/mountain-list.html',
            controller: 'MountainListController'
        }).
        when('/mountains/:id', {
            templateUrl: 'partials/mountain-detail.html',
            controller: 'MountainDetailController'                
        }).otherwise({
            redirectTo: '/mountains'
        });
    
}]);



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

cmr.controller('MountainListController', ['$scope', '$rootScope', 'Mountains', function($scope, $rootScope, Mountains) {

    $scope.focusLocation = "";
    $scope.filterProps = {};
    $scope.filterLocation = {};

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

    Mountains.get(function(data) {
        $scope.mountains = data;
    });

}]);

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



cmr.factory('MountainMapMarkers', ['Mountains', '$http', function(Mountains, $http) {

	/**
	 * given response from api, return marker list data for map consumption
	 * @param  {object} data results from API call
	 * @return {array} formatted marker data
	 */
	function createMarkerData(data) {

		var markerData = [];
		var count = 0;

		for (var mtn in data) {
			var mountain = data[mtn];
			if ((mountain.hasOwnProperty('lat')) && (mountain.hasOwnProperty('lon'))) {
				markerData.push({
					id: mountain.id,
					latitude: mountain.lat,
					longitude: mountain.lon,
					title: mountain.name,
					show: false,
					icon: '/images/map-marker-icon.png',
					options: {
						boxClass:"mountain-marker-window",
					}					
				});
			}
			count++;
		}

		return markerData;
	}

	/**
	 * get list of mountain markers for map
	 * @return {object} return an object with a "data" key
	 */
	function get() {
		return Mountains.get(function(response) {
			return {
				data: createMarkerData(response)
			}
		});		
	}

	// function get() {

	// 	return $http.get('/api/mountains/')
	// 		.then(function(response) {
	// 			return {
	// 				data: createMarkerData(response.data)
	// 			}
	// 		}, function(error) {
	// 			throw error.status + " : " + error.data;
	// 		});
	// }

	/*
	public methods
	 */
	return {
		get: get	
	}
}]);
cmr.factory('Mountains', ['$http', function($http) {

	/**
	 * return all mountains
	 */
	function get(callback) {
		return $http.get('/api/mountains/', { cache: true })
			.then(function(response) {
				return response.data;
			}).then(callback);
	}

	/**
	 * return data about a particular mountain associated with the passed id
	 */
	function getMountainById(id) {
		return $http.get('/api/mountains/' + id)
			.then(function(response) {
				console.log("Response:", response);
				return response.data;
			})
	}

    return {
    	get: get,
    	getMountainById: getMountainById
    }

}]);	
cmr.directive('cmrPhoto', function() {

    return {
        restrict: 'A',
        scope: {
            photo: '=photo'
        },
        replace: 'true',
        link: function(scope, element, attrs) {

            scope.PATH = 'https://s3-us-west-2.amazonaws.com/cascademountainrange/';

            //default values are empty
            scope.image = null;
            scope.caption = null;
            scope.credit = null;

            //photo atttribute comes in async so not populated when directive loads, but updated later
            scope.$watch('photo', function(newVal) {
                if (newVal) {                     
                    scope.image = scope.PATH + newVal.photo;
                    scope.caption = newVal.caption;
                    scope.credit = newVal.credit;
                }
            }, true);
        },
        templateUrl: 'partials/directives/cmrPhoto.html'
    } 
});


