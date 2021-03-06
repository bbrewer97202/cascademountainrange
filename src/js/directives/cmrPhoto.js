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


