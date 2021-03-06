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
        .when('/', {
            templateUrl: 'partials/homepage.html'
        })
        .when('/:state', {
            templateUrl: 'partials/mountain-list.html'
        })
        .when('/:state/:id', {
            templateUrl: 'partials/mountain-detail.html',
            controller: 'MountainDetailController'   
        })
        .otherwise({
            redirectTo: '/'
        });
    
}]);



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

cmr.controller('MountainListController', 
    ['$scope', '$location', '$rootScope', '$routeParams', 'Mountains', 
    function($scope, $location, $rootScope, $routeParams, Mountains) {

    $scope.focusLocation = "";
    $scope.filterProps = {};
    $scope.filterProp = '-lat';
    $scope.filterType = 'lat';    
    $scope.filterLocation = {};
    $scope.filterReverse = true;
    $scope.region = Mountains.getRegionIdByRegionUrl($routeParams.state);
    $scope.regionName = Mountains.getRegionNameByUrl($routeParams.state);

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

    $scope.mountainDetail = function(name, region) {
        $location.path('/' + Mountains.getRegionUrlById(region) + '/' + name);
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



cmr.controller('NavigationController', ['$scope', '$location', function($scope, $location) {
	
	$scope.isMobileMenuOpen = false;

	$scope.isActive = function(route) {
		return ($location.path().indexOf(route) >= 0);
	}

	$scope.openMenu = function() {
		$scope.isMobileMenuOpen = !$scope.isMobileMenuOpen;
	}

	$scope.closeMobileMenu = function() {
		$scope.isMobileMenuOpen = false;	
	}

}]);
cmr.factory('MountainMapMarkers', ['Mountains', '$http', function(Mountains, $http) {

	//default + region specific map center points + zoom levels
	var mapConstants = {
		LAT: 44.087029720084644,
		LON: -120.78863799999999,
		ZOOM: 5,
    	'or': {
			LAT: 44.06414336303867,
			LON: -121.88916015625,
			ZOOM: 7
    	},
    	'wa': {
			LAT: 47.38369696135246,
			LON: -121.1640625,
			ZOOM: 7
    	},
    	'ca': {
			LAT: 39.793490785895294,
			LON: -121.39048385620117,
			ZOOM: 7
    	},
    	'bc': {
			LAT: 49.66450788807946,
			LON: -121.44601631164551,
			ZOOM: 8
    	}
	}

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
					url: mountain.urlid,
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
		constants: mapConstants,
		get: get,
		getRegionById: getRegionById
	}
}]);
cmr.factory('Mountains', ['$http', function($http) {

	var regions = {
		'ca': {
			'name': 'California',
		},
		'or': {
			'name': 'Oregon',
		},
		'wa': {
			'name': 'Washington',
		},		
		'bc': {
			'name': 'British Columbia'
		}
	};

	/**
	 * 
	 */
	function getUrlVersionOfName(name) {
		name = name.toLowerCase();
		name = name.replace(/ /g, '+');
		return name;
	}

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
	 * 
	 */
	function getMountainUrlByName(name) {
		return getUrlVersionOfName(name);
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
		return getUrlVersionOfName(regions[id.toLowerCase()].name);
	}

	/**
	 * given a region id, return the associated region name
	 */
	function getRegionNameById(id) {
		return regions[id.toLowerCase()].name;
	}

	/**
	 * given the url representation of a region, return the formal printable name of the region
	 */
	function getRegionNameByUrl(url) {
		var name = '';
		var words = url.split('+');
		for (var i=0; i < words.length; i++) {
			name += words[i].charAt(0).toUpperCase() + words[i].slice(1) + ' ';
		}
		return name;
	}

	/**
	 *
	 */
	function getRegionIdByRegionUrl(url) {
		for (var key in regions) {
			if (getUrlVersionOfName(regions[key].name) === url) {
				return key;
			}
		}
	}

    return {
    	get: get,
    	getMountainById: getMountainById,
    	getMountainUrlByName: getMountainUrlByName,
    	getRegionById: getRegionById,
    	getRegionUrlById: getRegionUrlById,
    	getRegionNameById: getRegionNameById,
    	getRegionIdByRegionUrl: getRegionIdByRegionUrl,
    	getRegionNameByUrl: getRegionNameByUrl
    }

}]);	
cmr.directive('cmrBreadcrumb', function() {

    return {
        restrict: 'E',
        scope: {
            breadcrumb: '=data'
        },
        templateUrl: 'partials/directives/cmrBreadcrumb.html'
    } 
});
cmr.directive('cmrPhoto', function() {

    return {
        restrict: 'A',
        scope: {
            photo: '=photo'
        },
        replace: 'true',
        link: function(scope, element, attrs) {

            //scope.PATH = 'https://s3-us-west-2.amazonaws.com/cascademountainrange/';

            //default values are empty
            scope.src = null;
            scope.caption = null;
            scope.url = null;

            //photo atttribute comes in async so not populated when directive loads, but updated later
            scope.$watch('photo', function(newVal) {
                if (newVal) {                     
                    scope.src = newVal.photo;
                    scope.caption = newVal.source;
                    scope.url = newVal.url;
                }
            }, true);
        },
        templateUrl: 'partials/directives/cmrPhoto.html'
    } 
});


