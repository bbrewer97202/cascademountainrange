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