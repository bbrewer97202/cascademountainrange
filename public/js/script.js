var cmr = angular.module('cmr', [
    'ngResource', 
    'ngRoute',
    'google-maps'
]);

cmr.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/mountains', {
                templateUrl: 'partials/mountain-list.html',
                controller: 'MountainListController'
            }).
            when('/mountains/:id', {
                templateUrl: 'partials/mountain-detail.html',
                controller: 'MountainDetailController'                
            }).otherwise({
                redirectTo: '/mountains'
            });
    }    
]);



cmr.controller('MountainDetailController', ['$scope', '$routeParams', 'Mountain', function($scope, $routeParams, Mountain) {

    $scope.mountain = {
        photos: []
    }

    //TODO error handling on ID
    Mountain.get({ id: $routeParams.id }, function(data) {
        $scope.mountain = data;
        $scope.map = {
            center: {
                latitude: $scope.mountain.lat,
                longitude: $scope.mountain.lon
            },
            zoom: 11,
            options: {
                mapTypeId: google.maps.MapTypeId.TERRAIN 
            }
        }
        
        // console.log("second: ", $scope.mountain.photos[0].caption);

    });

    //default map
    //TODO: do not render map (with default data), wait to render until real data has arrived
    $scope.map = {
        center: {
            latitude: 45,
            longitude: -73
        },
        zoom: 11
    };

    //TODO: handle Canada
    //TODO: make service or filter
    $scope.stateFormat = function() {

        if ($scope.mountain) {
            switch ($scope.mountain.state) {
                case 'CA':
                    return 'California';
                    break;
                case 'OR':
                    return 'Oregon';
                    break;
                case 'WA':
                    return 'Washington';
                    break;
                default:
                    return ''
            }
        } else {
            return '';
        }
    }

}]);

cmr.controller('MountainListController', ['$scope', 'Mountain', function($scope, Mountain) {

    $scope.filterProps = {};
    $scope.filterLocation = {};

    Mountain.query(function(data) {
        $scope.mountains = data;
    });

}]);

cmr.controller('MountainListMapController', ['$scope', '$location', 'Mountain', function($scope, $location, Mountain) {

    $scope.markers = [];
    $scope.markerCoords = [];
    $scope.markerOptions = [];
    $scope.nameTitleMap = {};

    $scope.map = {
        center: {
            latitude: 45.14353713591516,
            longitude: -121.955078125
        },
        zoom: 6,
        options: {
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            streetViewControl: false
        },
        events: {
            dragend: function() {
                console.log("drag end", $scope.map);
                window.ben = $scope.map;
            }
        }    
    };

    $scope.markerEvents = {
        click: markerClick,       
        // mouseover: markerMouseOver,
        // mouseout: markerMouseOut
    };
    function markerClick(marker, e) {
        
        //get the mountain title, map that to internal ID, and redirect page
        var id = $scope.nameTitleMap[marker.getTitle()];
        $location.path('/mountains/' + id);
        $scope.$apply();

    }
    // function markerMouseOver(marker, e) {
    //     console.log("on marker over");
    // }
    // function markerMouseOut(marker, e) {
    //     console.log("on marker out");
    // }

    Mountain.query(function(data) {

        $scope.mountains = data;

        //create a list of marker coords + options for the mountain list map
        var markersList = [];

        for (var n in $scope.mountains) {
            if ($scope.mountains[n].hasOwnProperty('lat')) {

                markersList.push({
                    coords: {
                        latitude: $scope.mountains[n].lat,
                        longitude: $scope.mountains[n].lon
                    },
                    options: {
                        title: $scope.mountains[n].name,
                        icon: {
                            url: '/images/map-marker-icon.png'
                        }
                    }
                }); 

                //update dictionary of titles to mountain ids              
                $scope.nameTitleMap[$scope.mountains[n].name] = $scope.mountains[n]._id;
            }
        }

        //save list of markers
        $scope.markers = markersList;
    });
}]);

cmr.factory('Mountain', function($resource) {
    return $resource('/api/mountains/:id');
});

cmr.directive('cmrPhoto', function() {

    return {
        restrict: 'A',
        scope: {
            photo: '=photo'
        },
        replace: 'true',
        link: function(scope, element, attrs) {

            scope.PATH = 'https://s3-us-west-2.amazonaws.com/cascademountainrange/';

            //default values are empty
            scope.image = null;
            scope.caption = null;
            scope.credit = null;

            //photo atttribute comes in async so not populated when directive loads, but updated later
            scope.$watch('photo', function(newVal) {
                if (newVal) {                     
                    scope.image = scope.PATH + newVal.photo;
                    scope.caption = newVal.caption;
                    scope.credit = newVal.credit;
                }
            }, true);
        },
        templateUrl: 'partials/directives/cmrPhoto.html'
    } 
});


