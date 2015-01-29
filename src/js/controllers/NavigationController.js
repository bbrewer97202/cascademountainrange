cmr.controller('NavigationController', ['$scope', '$location', function($scope, $location) {
	
	$scope.isActive = function(route) {
		return ($location.path().indexOf(route) >= 0);
	}

}]);