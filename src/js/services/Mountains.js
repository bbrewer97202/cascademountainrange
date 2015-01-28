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