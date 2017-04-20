angular.module('app.controllers', [])
 
.controller('homeCtrl', function($scope) {
})


.controller('mapCtrl', function($scope, $state, uiGmapGoogleMapApi, uiGmapIsReady, $rootScope, $timeout, $ionicLoading, Clinic, $ionicPopup) {
	console.log("map is loading");
	$scope.ready = false;
	$scope.clinic_markers = {ready: false};
	$ionicLoading.show({template: '<img src = "img/syringe.gif">' , noBackdrop: false });

// $scope.cluster = {
// 	typeOptions: {
// 		zoomOnClick: true,
// 		minimumClusterSize: 1
// 	},
// 	typeEvents: {
// 		click: function(cluster, clusterModels) {

//    			if (clusterModels.length == 1) {
//        			var popup_scope = $scope.$new(true);
//        			popup_scope.tickets = clusterModels;
//        			popup_scope.popup = $ionicPopup.show({
//            			templateUrl: "templates/response.popup.html",
//            			scope: popup_scope,
//            			buttons: [
//                			{text: "Cancel",
//                 			type: "button-stable"}
//           				 ]

//        			});
//    			} else {}
// 		}
// 	}
// };

navigator.geolocation.getCurrentPosition(function($position){
// success!
console.log($position.coords);
setup_map(parseFloat($position.coords.latitude), parseFloat($position.coords.longitude));
}, function($error){
	setup_map({latitude: 0, longitude: 0});
// error!
});

function placeToMarker(searchbox, id) {

	var place = searchbox.getPlaces();
	if (!place || place == 'undefined' || place.length == 0) {
		return;
	}

	var marker = {
		id: id,
		place_id: place[0].place_id,
		name: place[0].name,
		address: place[0].formatted_address,
		latitude: place[0].geometry.location.lat(),
		longitude: place[0].geometry.location.lng(),
		latlng: place[0].geometry.location.lat() + ',' + place[0].geometry.location.lng()
	};
// push your markers into the $scope.map.markers array
if (!$scope.map.markers) {
	$scope.map.markers = [];
}
}

var setup_map = function($latitude, $longitude){
	console.log($latitude);
	console.log($longitude);
	uiGmapGoogleMapApi.then(function(maps){
		$scope.map = {};
		$scope.map.center = {latitude: parseFloat($latitude),
			longitude: parseFloat($longitude)};
			$scope.map.zoom = 14;
			$scope.map.searchbox = { 
				template:'searchbox.tpl.html', 
				events:{
					places_changed: function (searchbox) {
						var place = searchbox.getPlaces();
						if (!place || place == 'undefined' || place.length == 0) {
							console.log('no place data :(');
							return;
						}

						$scope.map = {
							"center": {
								"latitude": place[0].geometry.location.lat(),
								"longitude": place[0].geometry.location.lng()
							},
							"zoom": 18
						};

						$scope.place = [{
							id: 'place',
							place_id: place[0].place_id,
							name: place[0].name,
							address: place[0].formatted_address,
							coords: {latitude: place[0].geometry.location.lat(),
								longitude: place[0].geometry.location.lng()},
								latlng: place[0].geometry.location.lat() + ',' + place[0].geometry.location.lng()
							}];
						}
					}
				}
				maps.visualRefresh = true;
			});

	$scope.place = [{
		'id': 'place',
		'coords': {
			'latitude': parseFloat($latitude),
			'longitude': parseFloat($longitude)
		},
		options: {
			draggable: true
		},
		events: {
			dragend: function (marker, eventName, args) {

				$scope.marker.options = {
					draggable: true,
					labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
					labelAnchor: "100 0",
					labelClass: "marker-labels"
				};
			},
			places_changed: function (searchbox) {
				placeToMarker(searchbox, id);
			}
		}
	}];

	$scope.me = [{'id':'me',
	'coords': {'latitude': parseFloat($latitude),
	'longitude': parseFloat($longitude)
},
'icon': "img/mylocation.png",
'options': {
	'icon': {
//'scaledSize': new google.maps.Size(34, 44)
}
}
}];
$ionicLoading.hide();
find_nearby_clinics($latitude, $longitude);
$scope.ready = true;
};

$scope.clinic_events = 
{	
	click: function(item){

		$ionicPopup.alert({
			title: item.model.Name,
			buttons: [ {text: 'Back'},
			{
				text: 'More Info',
				type: 'button-positive',
				onTap: function(e) {
					$state.go('clinicServices', {clinic_id: item.model.id});
				}
			}
			]
		});



		console.log(item.model);
	}
};



var find_nearby_clinics = function($latitude, $longitude){
	var $my_location = {lat: $latitude, lng: $longitude};
	Clinic.find({
		"where": {
			"near": $my_location
		}
	})
	.$promise
	.then(function success($response){
// recompile latitude, longitude from lat, lng

for (var i = 0; i < $response.length; i++){
	$response[i].long_geolocation = {
		latitude: $response[i].Location.lat,
		longitude: $response[i].Location.lng
	}
//$scope.response[i].icon = "img/marker.png";
//			    console.log("Long geolocations inputted: " + $scope.response[i]);
}
$scope.clinics = $response;
//console.log($scope.clinics);
//$scope.clinic_markers.ready = true;
}, function error(response){
	alert(response);
	console.log(response);
});
}
})
   
.controller('clinicInfoCtrl', function($scope) {

})

.controller('clinicServicesCtrl', function($scope, $stateParams, Clinic) {
	    var clinic_id = $stateParams.clinic_id;
	    Clinic.find({filter: {where: {id: clinic_id}, include: "offers"}})
		.$promise
		.then(function success(data){
			$scope.clinic = data[0];
		}, function error(data){
			console.log("Error: " + data);
		});
})

.controller("response_popup_controller", function($scope, $state) {
    $scope.go = function(ticket) {
        $scope.popup.close();
        $state.go("response_display", {
            ticket_id: ticket.id
        });
    }
})

.controller("response_display", function($scope, $stateParams, $state, Clinic) {
    Clinic.findById({
        id: $stateParams.ticket_id
    })
    .$promise
    .then(function(find_success) {
        $scope.response = find_success;
    }, function error(response) {

    });

});