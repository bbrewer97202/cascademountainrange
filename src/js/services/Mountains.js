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