cmr.directive('cmrBreadcrumb', function() {

    return {
        restrict: 'E',
        scope: {
            breadcrumb: '=data'
        },
        templateUrl: 'partials/directives/cmrBreadcrumb.html'
    } 
});