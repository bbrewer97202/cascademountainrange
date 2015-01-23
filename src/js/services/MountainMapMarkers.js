cmr.factory('MountainMapMarkers', ['Mountain', '$http', '$q', function(Mountain, $http, $q) {

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
					id: "marker" + count,
					latitude: mountain.lat,
					longitude: mountain.lon,
					title: mountain.name,
					show: false,
					icon: '/images/map-marker-icon.png'
				});
			}
			count++;
		}

		return markerData;
	}

	/**
	 * get list of mountain markers for map
	 * TODO: there should only be one call to mountains (Mountain factory), ever
	 * @return {object} return an object with a "data" key
	 */
	function get() {

		return $http.get('/api/mountains/')
			.then(function(response) {
				console.log("response, ", response);
				return {
					data: createMarkerData(response.data)
				}
			}, function(error) {
				throw error.status + " : " + error.data;
			});
	}	

	// function get() {

	// 	var deferred = $q.defer();

	// 	$http.get('/api/mountains/')
	// 		.success(function(data) {
	// 			deferred.resolve({
	// 				data: createMarkerData(data)
	// 			});
	// 		})
	// 		.error(function(msg, code) {
	// 			deferred.reject(msg);
	// 		});

	// 	return deferred.promise;
	// }

	/*
	public methods
	 */
	return {
		get: get	
	}
}]);