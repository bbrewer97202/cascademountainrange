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

cmr.controller('MountainListController', ['$scope', '$rootScope', 'Mountain', function($scope, $rootScope, Mountain) {

    $scope.focusLocation = "";
    $scope.filterProps = {};
    $scope.filterLocation = {};

    $scope.mountainFocus = function(name) {    
        if (name !== $scope.focusLocation) {            
            $rootScope.$broadcast('mountainListFocus', name);
            $scope.focusLocation = name;
        }
    }

    $scope.mountainBlur = function() {
        $rootScope.$broadcast('mountainListBlur');
        $scope.focusLocation = "";
    }

    Mountain.query(function(data) {
        $scope.mountains = data;
    });

}]);

cmr.controller('MountainListMapController', ['$scope', '$location', 'Mountain', function($scope, $location, Mountain) {

    //TODO: move to controller?
    var DEFAULT_LAT = 45.14353713591516;
    var DEFAULT_LON = -121.955078125;
    var DEFAULT_ZOOM = 6;

    $scope.markers = [];
    $scope.markerCoords = [];
    $scope.markerOptions = [];
    $scope.nameTitleMap = {};

    $scope.map = {
        center: {
            latitude: DEFAULT_LAT,
            longitude: DEFAULT_LON
        },
        zoom: DEFAULT_ZOOM,
        options: {
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            streetViewControl: false,
            disableDefaultUI: true,
            scrollwheel: false
        },
        events: {
            dragend: function() {
                console.log("drag end", $scope.map);
                window.ben = $scope.map;
            }
        },
        label: {
            title: null,
            x: 0,
            y: 0
        }
    };

    $scope.markerEvents = {
        click: markerClick,
        mouseover: markerMouseOver,
        mouseout: markerMouseOut
    };

    //watch for mountainlist focus events
    $scope.$on('mountainListFocus', function(e, name) {

        //set map center to coords for specified mountain
        $scope.map.center = {
            latitude: $scope.nameTitleMap[name].lat,
            longitude: $scope.nameTitleMap[name].lon
        }
        $scope.map.zoom = 8;
    });

    $scope.$on('mountainListBlur', function(e, name) {

        //set map center to coords to default view
        $scope.map.center = {
            latitude: DEFAULT_LAT,
            longitude: DEFAULT_LON
        }
        $scope.map.zoom = DEFAULT_ZOOM;
    });

    function markerClick(marker, e) {

        //get the mountain title, map that to internal ID, and redirect page
        var id = $scope.nameTitleMap[marker.getTitle()]._id;
        $location.path('/mountains/' + id);
        $scope.$apply();

    }

    function markerMouseOver(marker, e, f) {
        $scope.map.label.title = $scope.nameTitleMap[marker.getTitle()].name;
        $scope.$apply();
    }

    function markerMouseOut(marker, e) {
        $scope.map.label.title = null;
        $scope.$apply();
    }

   //TODO:
   //from: http://www.angularjshub.com/examples/eventhandlers/mouseevents/
    // Accepts a MouseEvent as input and returns the x and y
    // coordinates relative to the target element.
    var getCrossBrowserElementCoords = function (mouseEvent)
    {
      var result = {
        x: 0,
        y: 0
      };

      if (!mouseEvent)
      {
        mouseEvent = window.event;
      }

      if (mouseEvent.pageX || mouseEvent.pageY)
      {
        result.x = mouseEvent.pageX;
        result.y = mouseEvent.pageY;
      }
      else if (mouseEvent.clientX || mouseEvent.clientY)
      {
        result.x = mouseEvent.clientX + document.body.scrollLeft +
          document.documentElement.scrollLeft;
        result.y = mouseEvent.clientY + document.body.scrollTop +
          document.documentElement.scrollTop;
      }

      if (mouseEvent.target)
      {
        var offEl = mouseEvent.target;
        var offX = 0;
        var offY = 0;

        if (typeof(offEl.offsetParent) != "undefined")
        {
          while (offEl)
          {
            offX += offEl.offsetLeft;
            offY += offEl.offsetTop;

            offEl = offEl.offsetParent;
          }
        }
        else
        {
          offX = offEl.x;
          offY = offEl.y;
        }

        result.x -= offX;
        result.y -= offY;
      }

      return result;
    };

    function mapMouseMove(e) {

        // var mouseX = 0, mouseY = 0;
        //
        // if (e.offsetX === null) {
        //     mouseX = e.originalEvent.layerX;
        //     mouseY = e.originalEvent.layerY;
        // } else {
        //     mouseX = e.offsetX;
        //     mouseY = e.offsetY;
        // }
        //
        // console.log("mapMouseMove", mouseX, mouseY);
        var coords = getCrossBrowserElementCoords(e)
        console.log(coords.x, coords.y);
    }

    //TODO: structure
    $scope.mapMouseMove = mapMouseMove;

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

                //update dictionary of titles to mountains
                $scope.nameTitleMap[$scope.mountains[n].name] = $scope.mountains[n];
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


