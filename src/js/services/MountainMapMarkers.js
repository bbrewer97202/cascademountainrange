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

	/*
	public methods
	 */
	return {
		get: get	
	}
}]);