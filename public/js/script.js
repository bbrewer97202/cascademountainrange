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
    $routeProvider
        .when('/mountains', {
            templateUrl: 'partials/homepage.html'
        })
        .when('/mountains/:state', {
            templateUrl: 'partials/region.html'
        })
        .when('/mountains/:state/:id', {
            templateUrl: 'partials/mountain-detail.html',
            controller: 'MountainDetailController'   
        })
        .otherwise({
            redirectTo: '/mountains'
        });
    
}]);



cmr.controller('MountainDetailController', ['$scope', '$routeParams', 'Mountains', function($scope, $routeParams, Mountains) {

    $scope.mountain = {
        photos: []
    }

    //TODO: error handling on ID
    Mountains.getMountainById($routeParams.id).then(function(data) {

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

cmr.controller('MountainListController', 
    ['$scope', '$location', '$rootScope', '$routeParams', 'Mountains', 
    function($scope, $location, $rootScope, $routeParams, Mountains) {

    $scope.focusLocation = "";
    $scope.filterProps = {};
    $scope.filterProp = '-lat';
    $scope.filterType = 'lat';    
    $scope.filterLocation = {};
    $scope.filterReverse = true;
    $scope.region = Mountains.getRegionIdByRegionUrl($routeParams.state); //'all';

    console.log("$scope.region", $scope.region);

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

    $scope.mountainDetail = function(id, region) {
        $location.path('/mountains/' + Mountains.getRegionUrlById(region) + '/' + id);
    }

    $scope.regionChange = function() {
        var id = ($scope.region === 'all') ? '' : $scope.region;
        $scope.filterLocation = { state: id }
        $rootScope.$broadcast('regionChange', id);
    }

    $scope.setFilter = function(id) {
        if (id === $scope.filterType) {
            if ($scope.filterProp.indexOf('-') < 0) {
                $scope.filterProp = '-' + id;
                $scope.filterReverse = true;
            } else {
                $scope.filterProp = id;
                $scope.filterReverse = false;
            }
        } else {
            $scope.filterProp = id;
            $scope.filterType = id;
            $scope.filterReverse = false;
        }
    }

    Mountains.get(function(data) {
        $scope.mountains = data;

        //debug
        $scope.regionChange();        
    });

}]);

cmr.controller('MountainListMapController', 
    ['$scope', '$location', '$routeParams', 'Mountains', 'MountainMapMarkers', 'uiGmapGoogleMapApi', 
    function($scope, $location, $routeParams, Mountains, MountainMapMarkers, GoogleMapApi) {

    //TODO: move to service
    // var DEFAULT_LAT = 45.14353713591516;
    // var DEFAULT_LON = -121.955078125;
    // var DEFAULT_ZOOM = 6;

    var DEFAULT_LAT = 44.087029720084644;
    var DEFAULT_LON = -120.78863799999999;
    var DEFAULT_ZOOM = 5;

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

        console.log("regionChange", id);

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
        $location.path('/mountains/' + Mountains.getRegionUrlById(model.region) + '/' + model.id);
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
					region: mountain.state,
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
		}, function(error) {
			throw error.status + " : " + error.data;
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

	/**
	 * get list of mountain markers for map with the matching region id
	 * @return {object} return an object with a "data" key
	 */
	function getRegionById(id) {
		return Mountains.getRegionById(id, function(response) {
			return {
				data: createMarkerData(response)
			}
		}, function(error) {
			throw error.status + " : " + error.data;
		});		
	}

	/*
	public methods
	 */
	return {
		get: get,
		getRegionById: getRegionById	
	}
}]);
cmr.factory('Mountains', ['$http', function($http) {

	var regions = {
		'ca': {
			'name': 'California',
			'url': 'california'
		},
		'or': {
			'name': 'Oregon',
			'url': 'oregon'
		},
		'wa': {
			'name': 'Washington',
			'url': 'washington'
		},
		'bc': {
			'name': 'British Columbia',
			'url': 'british+columbia'
		}
	};

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
				return response.data;
			})
	}

	/**
	 * return region data for the passed id
	 */
	function getRegionById(id, callback) {
		return $http.get('/api/region/' + id)
			.then(function(response) {
				return response.data;
			}).then(callback);
	}

	/**
	 * given a region id, return the associated region url (name) 
	 */
	function getRegionUrlById(id) {
		return regions[id.toLowerCase()].url;
	}

	/**
	 * given a region id, return the associated region name
	 */
	function getRegionNameById(id) {
		return regions[id.toLowerCase()].name;
	}

	/**
	 *
	 */
	function getRegionIdByRegionUrl(url) {
		for (var key in regions) {
			if (regions[key].url === url) {
				return key;
			}
		}
	}

    return {
    	get: get,
    	getMountainById: getMountainById,
    	getRegionById: getRegionById,
    	getRegionUrlById: getRegionUrlById,
    	getRegionNameById: getRegionNameById,
    	getRegionIdByRegionUrl: getRegionIdByRegionUrl
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


