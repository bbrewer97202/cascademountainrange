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