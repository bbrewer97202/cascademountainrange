cmr.controller('NavigationController', ['$scope', '$location', function($scope, $location) {
	
	$scope.isMobileMenuOpen = false;

	$scope.isActive = function(route) {
		return ($location.path().indexOf(route) >= 0);
	}

	$scope.openMenu = function() {
		console.log("openMenu");
		$scope.isMobileMenuOpen = !$scope.isMobileMenuOpen;
	}

}]);