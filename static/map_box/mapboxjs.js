var mapElem = document.getElementById('map');
var latitude = mapElem.dataset.latitude;
var longitude = mapElem.dataset.longitude;

console.log(latitude)
console.log(longitude)

mapboxgl.accessToken = 'pk.eyJ1IjoibmlsYXktd2Vsb2dpY2FsIiwiYSI6ImNsZjZjMzRreDE1eG8zeW50YWplOHBvYTYifQ.Wk6TflXVfKBFSDBlxzpZHg'

//  Making map
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-streets-v12',

    // style: 'mapbox://styles/nilay-welogical/clfgazmj6004y01qp1pjwegrl',
    // style: 'mapbox://styles/nilay-welogical/clfl370y2000601t6x1jh0fmw',
    // style: 'mapbox://styles/nilay-welogical/clfgccr8n000a01mru7lobpx0',
    // style: 'mapbox://styles/nilay-welogical/clft7vwol004q01p66j4p7xlq',

    // style: 'mapbox://styles/mapbox/satellite-v9',
    // style: 'mapbox://styles/mapbox/dark-v11',
    // style: 'mapbox://styles/mapbox/outdoors-v12',

    // center: [-110, 45],
    center: [77.587384, 12.917639],
    // center: [77.57527924, 12.97674656],
    // center: [-122.4194, 37.7749],

    zoom: 18,
    pitch: 50
});

// Map on load
map.on('load', function () {

  directions.setOrigin([77.587384, 12.917639]);
  directions.setDestination([longitude, latitude]);

  map.addLayer({
      id: '3d-building',
      source: 'composite',
      'source-layer': 'building',
      filter: ['==', 'extrude', 'true'],
      type: 'fill-extrusion',
      minzoom: 17,
      paint: {
          // 'fill-extrusion-color': '#aaa',
          'fill-extrusion-color': 'lightblue',

          'fill-extrusion-height': [
              'interpolate', ['linear'], ['zoom'],
              15, 0,
              15.05, ['get', 'height']
          ],
          'fill-extrusion-base': [
              'interpolate', ['linear'], ['zoom'],
              15, 0,
              15.05, ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.6
      }
  });

});


// Direction code starts

// Define the live location marker
const liveLocationMarker = new mapboxgl.Marker({
  color: "blue",
}).setLngLat([77.587384, 12.917639]) // Set initial location

// Add the marker to the map
liveLocationMarker.addTo(map);

// Update the live location marker's position as the user moves
function updateLiveLocationMarker(lngLat) {
  liveLocationMarker.setLngLat(lngLat);
}

// Original code
function getDirections() {

  // Direction origin and destination lat,long
  directions.setOrigin([77.587384, 12.917639]);
  directions.setDestination([longitude, latitude]);

  // When the route is calculated, rotate the camera towards the destination
  directions.on('route', function(event) {
    if (event.route && event.route[0] && event.route[0].legs && event.route[0].legs[0]) {
      const start = event.route[0].legs[0].steps[0].maneuver.location;
      const end = event.route[0].legs[0].steps[event.route[0].legs[0].steps.length - 1].maneuver.location;
      const bearing = turf.bearing(
        turf.point([start[0], start[1]]),
        turf.point([end[0], end[1]])
      );
      map.flyTo({
        center: start,
        zoom: 21,
        bearing: bearing,
        pitch: 90,
        speed: 10,
        curve: 1
      });

      let currentStep = 0;
      const steps = event.route[0].legs[0].steps;

      const moveAlongPath = function() {
        const step = steps[currentStep];
        const end = step.maneuver.location;
        const distance = turf.distance(turf.point(start), turf.point(end));
        const duration = distance / (1 / 10000);
        map.easeTo({
          center: end,
          duration: duration,
          zoom: 30,
          pitch: 70,
          bearing: step.maneuver.bearing_after,
          easing: function(t) {
            return t;
          }
        });

        updateLiveLocationMarker(end); // Update the live location marker's position

        currentStep++;
        if (currentStep < steps.length) {
          setTimeout(moveAlongPath, duration);
        } else {
          // If the current step is the last step, wait for a few seconds and then redirect to the next page
          setTimeout(function() {
            // window.location.href = "https://lh3.googleusercontent.com/yPVzBgXmvBwc66iU1wzJkDqjFJZuqRiCHb9Ol2N6cKDQkGoMa5Wh9fC4_C3hnr9IlpNxwgWnADk=m18?cpn=Q7DSXTpzKYOi4rNA";
            window.location.href = "https://planner5d.com/v?key=bd9f1769fc8188bdf2140cb40d4107ee&viewMode=3d";
          }, 20000);
        }
      };

      moveAlongPath();

    }
  });

  // Change the map style to the desired style
  // map.setStyle('mapbox://styles/nilay-welogical/clfgazmj6004y01qp1pjwegrl');
  // map.setStyle('mapbox://styles/nilay-welogical/clfgccr8n000a01mru7lobpx0');
}
document.getElementById('directions-btn').addEventListener('click', getDirections);
// Original code end


// Adding the map controls

// adding search control
// Load custom data to supplement the search results.
const customData = {
    'features': [
        {
            'type': 'Feature',
            'properties': {
                'title': 'Lincoln Park is special'
            },
            'geometry': {
                'coordinates': [-87.637596, 41.940403],
                'type': 'Point'
            }
        },
        {
            'type': 'Feature',
            'properties': {
                'title': 'Burnham Park is special'
            },
            'geometry': {
                'coordinates': [-87.603735, 41.829985],
                'type': 'Point'
            }
        },
        {
            'type': 'Feature',
            'properties': {
                'title': 'Millennium Park is special'
            },
            'geometry': {
                'coordinates': [-87.622554, 41.882534],
                'type': 'Point'
            }
        }
    ],
    'type': 'FeatureCollection'
};

function forwardGeocoder(query) {
    const matchingFeatures = [];
    for (const feature of customData.features) {
        // Handle queries with different capitalization
        // than the source data by calling toLowerCase().
        if (
            feature.properties.title
                .toLowerCase()
                .includes(query.toLowerCase())
        ) {
            // Add a tree emoji as a prefix for custom
            // data results using carmen geojson format:
            // https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
            feature['place_name'] = `🌲 ${feature.properties.title}`;
            feature['center'] = feature.geometry.coordinates;
            feature['place_type'] = ['park'];
            matchingFeatures.push(feature);
        }
    }
    return matchingFeatures;
}

// Add the control to the map.
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        localGeocoder: forwardGeocoder,
        zoom: 14,
        placeholder: 'Enter loaction to search',
        mapboxgl: mapboxgl
    })
);
//End of adding search feature



// Full screen control
map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

// Navigation Control
// map.addControl(new mapboxgl.NavigationControl(), 'top-right');

// 3d view navigation
map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

// Live Location control
map.addControl(new mapboxgl.GeolocateControl({
  positionOptions: {
      enableHighAccuracy: true
  },
  trackUserLocation: true,
  showUserHeading: true
}), 'top-right');

// Switch between layerList
const layerList = document.getElementById('menu');
const inputs = layerList.getElementsByTagName('input');
for (const input of inputs) {
    input.onclick = (layer) => {
        const layerId = layer.target.id;
        map.setStyle('mapbox://styles/mapbox/' + layerId);
       
    }; 
}

// Initialize Mapbox directions plugin
const directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    unit: 'metric',
    profile: 'mapbox/driving',
    alternatives: false,
    interactive: false,
    congestion: true,
    // controls: {inputs: false}
});
map.addControl(directions, 'top-left');

directions.setOrigin([77.587384, 12.917639]);
directions.setDestination([longitude, latitude]);

//Js code ends here
// // =======================================================================



// const geocoder = new MapboxGeocoder({
//     accessToken: mapboxgl.accessToken,
//     types: 'poi',

//     placeholder: 'Search for places...',
//     icon: 'search',

//     // see https://docs.mapbox.com/api/search/#geocoding-response-object for information about the schema of each response feature
//     render: function (item) {
//         // extract the item's maki icon or use a default
//         const maki = item.properties.maki || 'marker';
//         return `<div class='geocoder-dropdown-item'>
//                 <img class='geocoder-dropdown-icon' src='https://unpkg.com/@mapbox/maki@6.1.0/icons/${maki}-15.svg'>
//                 <span class='geocoder-dropdown-text'>
//                 ${item.text}
//                 </span>
//             </div>`;
//     },
//     mapboxgl: mapboxgl
// });
// map.addControl(geocoder);





// var mapElem = document.getElementById('map');
// var latitude = mapElem.dataset.latitude;
// var longitude = mapElem.dataset.longitude;

// console.log(latitude)
// console.log(longitude)

// mapboxgl.accessToken = 'pk.eyJ1IjoibmlsYXktd2Vsb2dpY2FsIiwiYSI6ImNsZjZjMzRreDE1eG8zeW50YWplOHBvYTYifQ.Wk6TflXVfKBFSDBlxzpZHg'

// //  Making map
// var map = new mapboxgl.Map({
//     container: 'map',
//     // style: 'mapbox://styles/mapbox/satellite-streets-v12',

//     // style: 'mapbox://styles/nilay-welogical/clfgazmj6004y01qp1pjwegrl',
//     // style: 'mapbox://styles/nilay-welogical/clfl370y2000601t6x1jh0fmw',

//     // style: 'mapbox://styles/nilay-welogical/clfgccr8n000a01mru7lobpx0',

//     style: 'mapbox://styles/nilay-welogical/clft7vwol004q01p66j4p7xlq',

//     // style: 'mapbox://styles/mapbox/satellite-v9',
//     // style: 'mapbox://styles/mapbox/dark-v11',
   
//           // 'fill-extrusion-color': '#aaa',
//           'fill-extrusion-color': 'lightblue',
//           // 'fill-extrusion-color': 'blue',
//           // 'fill-extrusion-color': 'yellow',

//           'fill-extrusion-height': [
//               'interpolate', ['linear'], ['zoom'],
//               15, 0,
//               15.05, ['get', 'height']
//           ],
//           'fill-extrusion-base': [
//               'interpolate', ['linear'], ['zoom'],
//               15, 0,
//               15.05, ['get', 'min_height']
//           ],
//           'fill-extrusion-opacity': 0.6
//       }


// // Direction code starts

// // Define the live location marker
// const liveLocationMarker = new mapboxgl.Marker({
//   color: "blue",
// }).setLngLat([77.587384, 12.917639]) // Set initial location

// // Add the marker to the map
// liveLocationMarker.addTo(map);

// // Update the live location marker's position as the user moves
// function updateLiveLocationMarker(lngLat) {
//   liveLocationMarker.setLngLat(lngLat);
// }

// // Original code
// function getDirections() {

//   // Direction origin and destination lat,long
//   directions.setOrigin([77.587384, 12.917639]);
//   directions.setDestination([longitude, latitude]);

//   // When the route is calculated, rotate the camera towards the destination
//   directions.on('route', function(event) {
//     if (event.route && event.route[0] && event.route[0].legs && event.route[0].legs[0]) {
//       const start = event.route[0].legs[0].steps[0].maneuver.location;
//       const end = event.route[0].legs[0].steps[event.route[0].legs[0].steps.length - 1].maneuver.location;
//       const bearing = turf.bearing(
//         turf.point([start[0], start[1]]),
//         turf.point([end[0], end[1]])
//       );
//       map.flyTo({
//         center: start,
//         zoom: 21,
//         bearing: bearing,
//         pitch: 90,
//         speed: 10,
//         curve: 1
//       });

//       let currentStep = 0;
//       const steps = event.route[0].legs[0].steps;

//       const moveAlongPath = function() {
//         const step = steps[currentStep];
//         const end = step.maneuver.location;
//         const distance = turf.distance(turf.point(start), turf.point(end));
//         const duration = distance / (1 / 10000);
//         map.easeTo({
//           center: end,
//           duration: duration,
//           zoom: 30,
//           pitch: 70,
//           bearing: step.maneuver.bearing_after,
//           easing: function(t) {
//             return t;
//           }
//         });

//         updateLiveLocationMarker(end); // Update the live location marker's position

//         currentStep++;
//         if (currentStep < steps.length) {
//           setTimeout(moveAlongPath, duration);
//         } else {
//           // If the current step is the last step, wait for a few seconds and then redirect to the next page
//           setTimeout(function() {
//             // window.location.href = "https://lh3.googleusercontent.com/yPVzBgXmvBwc66iU1wzJkDqjFJZuqRiCHb9Ol2N6cKDQkGoMa5Wh9fC4_C3hnr9IlpNxwgWnADk=m18?cpn=Q7DSXTpzKYOi4rNA";
//             window.location.href = "https://planner5d.com/v?key=bd9f1769fc8188bdf2140cb40d4107ee&viewMode=3d";
//           }, 20000);
//         }
//       };

//       moveAlongPath();

//     }
//   });

//   // Change the map style to the desired style
//   // map.setStyle('mapbox://styles/nilay-welogical/clfgazmj6004y01qp1pjwegrl');
//   // map.setStyle('mapbox://styles/nilay-welogical/clfgccr8n000a01mru7lobpx0');
// }
// document.getElementById('directions-btn').addEventListener('click', getDirections);
// // Original code end

// // Adding the map controls
// // Full screen control
// map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

// // Navigation Control
// // map.addControl(new mapboxgl.NavigationControl(), 'top-right');

// // 3d view navigation
// map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

// // Live Location control
// map.addControl(new mapboxgl.GeolocateControl({
//   positionOptions: {
//       enableHighAccuracy: true
//   },
//   trackUserLocation: true,
//   showUserHeading: true
// }), 'top-right');

// // Switch between layerList
// const layerList = document.getElementById('menu');
// const inputs = layerList.getElementsByTagName('input');
// for (const input of inputs) {
//     input.onclick = (layer) => {
//         const layerId = layer.target.id;
//         map.setStyle('mapbox://styles/mapbox/' + layerId);
       
//     }; 
// }

// // Initialize Mapbox directions plugin
// const directions = new MapboxDirections({
//     accessToken: mapboxgl.accessToken,
//     unit: 'metric',
//     profile: 'mapbox/driving',
//     alternatives: false,
//     interactive: false,
//     congestion: true,
//     // controls: {inputs: false}
// });
// map.addControl(directions, 'top-left');

// directions.setOrigin([77.587384, 12.917639]);
// directions.setDestination([longitude, latitude]);

// // Js code ends here


// =======================================================================














































// car code

// // Define the car marker and its image
// const carMarker = new mapboxgl.Marker({
//   element: document.createElement('div'),
//   anchor: 'center',
//   rotate: 0,
//   draggable: false,
//   offset: [0, 0]
// }).setLngLat([77.587384, 12.917639])
//   .addTo(map);
// carMarker.getElement().innerHTML = '<img src="static/map_box/images/car_icon.png" style="height:50px;width:25px;">';

// function getDirections() {
//   // Direction origin and destination lat,long
//   directions.setOrigin([77.587384, 12.917639]);
//   directions.setDestination([longitude, latitude]);

//   // When the route is calculated, rotate the camera towards the destination
//   directions.on('route', function(event) {
//     if (event.route && event.route[0] && event.route[0].legs && event.route[0].legs[0]) {
//       const start = event.route[0].legs[0].steps[0].maneuver.location;
//       const end = event.route[0].legs[0].steps[event.route[0].legs[0].steps.length - 1].maneuver.location;
//       const bearing = turf.bearing(
//         turf.point([start[0], start[1]]),
//         turf.point([end[0], end[1]])
//       );
//       map.flyTo({
//         center: start,
//         zoom: 15,
//         bearing: bearing,
//         pitch: 50,
//         speed: 1.2,
//         curve: 1
//       });

//       let currentStep = 0;
//       const steps = event.route[0].legs[0].steps;

//       const moveAlongPath = function() {
//         const step = steps[currentStep];
//         const end = step.maneuver.location;
//         const distance = turf.distance(turf.point(start), turf.point(end));
//         const duration = distance / (1 / 10000);
//         map.easeTo({
//           center: end,
//           duration: duration,
//           zoom: 15,
//           pitch: 50,
//           bearing: step.maneuver.bearing_after,
//           easing: function(t) {
//             return t;
//           }
//         });

//         // Update the car marker's position and rotation
//         const lngLat = { lng: end[0], lat: end[1] };
//         carMarker.setLngLat(lngLat);
//         carMarker.setRotation(step.maneuver.bearing_after);

//         currentStep++;
//         if (currentStep < steps.length) {
//           setTimeout(moveAlongPath, duration);
//         } else {
//         // If the current step is the last step, wait for a few seconds and then redirect to the next page
//           setTimeout(function() {
//             window.location.href = "https://lh3.googleusercontent.com/yPVzBgXmvBwc66iU1wzJkDqjFJZuqRiCHb9Ol2N6cKDQkGoMa5Wh9fC4_C3hnr9IlpNxwgWnADk=m18?cpn=Q7DSXTpzKYOi4rNA";
//           }, 5000);
//         }
//       };
//       moveAlongPath();
//     }

//   });

//   // Change the map style to the desired style
//   // map.setStyle('mapbox
// }

// document.getElementById('directions-btn').addEventListener('click', getDirections);














// Original direction code backup

// // Direction code starts

// // Define the live location marker
// const liveLocationMarker = new mapboxgl.Marker({
//   color: "blue",
// }).setLngLat([77.587384, 12.917639]) // Set initial location

// // Add the marker to the map
// liveLocationMarker.addTo(map);

// // Update the live location marker's position as the user moves
// function updateLiveLocationMarker(lngLat) {
//   liveLocationMarker.setLngLat(lngLat);
// }

// // Original code

// function getDirections() {

//   // Direction origin and destination lat,long
//   directions.setOrigin([77.587384, 12.917639]);
//   directions.setDestination([longitude, latitude]);

//   // When the route is calculated, rotate the camera towards the destination
//   directions.on('route', function(event) {
//     if (event.route && event.route[0] && event.route[0].legs && event.route[0].legs[0]) {
//       const start = event.route[0].legs[0].steps[0].maneuver.location;
//       const end = event.route[0].legs[0].steps[event.route[0].legs[0].steps.length - 1].maneuver.location;
//       const bearing = turf.bearing(
//         turf.point([start[0], start[1]]),
//         turf.point([end[0], end[1]])
//       );
//       map.flyTo({
//         center: start,
//         zoom: 25,
//         bearing: bearing,
//         pitch: 50,
//         speed: 10,
//         curve: 1
//       });

//       let currentStep = 0;
//       const steps = event.route[0].legs[0].steps;

//       const moveAlongPath = function() {
//         const step = steps[currentStep];
//         const end = step.maneuver.location;
//         const distance = turf.distance(turf.point(start), turf.point(end));
//         const duration = distance / (1 / 10000);
//         map.easeTo({
//           center: end,
//           duration: duration,
//           zoom: 21,
//           pitch: 50,
//           bearing: step.maneuver.bearing_after,
//           easing: function(t) {
//             return t;
//           }
//         });

//         updateLiveLocationMarker(end); // Update the live location marker's position

//         currentStep++;
//         if (currentStep < steps.length) {
//           setTimeout(moveAlongPath, duration);
//         } else {
//           // If the current step is the last step, wait for a few seconds and then redirect to the next page
//           setTimeout(function() {
//             window.location.href = "https://lh3.googleusercontent.com/yPVzBgXmvBwc66iU1wzJkDqjFJZuqRiCHb9Ol2N6cKDQkGoMa5Wh9fC4_C3hnr9IlpNxwgWnADk=m18?cpn=Q7DSXTpzKYOi4rNA";
//           }, 5000);
//         }
//       };

//       moveAlongPath();

//     }
//   });

//   // Change the map style to the desired style
//   // map.setStyle('mapbox://styles/nilay-welogical/clfgazmj6004y01qp1pjwegrl');
//   // map.setStyle('mapbox://styles/nilay-welogical/clfgccr8n000a01mru7lobpx0');
// }

// document.getElementById('directions-btn').addEventListener('click', getDirections);


// Original code backup ends






// code 2

// function getDirections() {

//   // Direction origin and destination lat,long
//   directions.setOrigin([77.587384, 12.917639]);
//   directions.setDestination([longitude, latitude]);

//   // When the route is calculated, rotate the camera towards the destination
//   directions.on('route', function(event) {
//     if (event.route && event.route[0] && event.route[0].legs && event.route[0].legs[0]) {
//       const start = event.route[0].legs[0].steps[0].maneuver.location;
//       const end = event.route[0].legs[0].steps[event.route[0].legs[0].steps.length - 1].maneuver.location;
//       const bearing = turf.bearing(
//         turf.point([start[0], start[1]]),
//         turf.point([end[0], end[1]])
//       );
//       map.flyTo({
//         center: start,
//         zoom: 17,
//         bearing: bearing,
//         pitch: 0,
//         speed: 10,
//         curve: 1
//       });

//       let currentStep = 0;
//       const steps = event.route[0].legs[0].steps;

//       const moveAlongPath = function() {
//         const step = steps[currentStep];
//         const end = step.maneuver.location;
//         const distance = turf.distance(turf.point(start), turf.point(end));
//         const duration = distance / (1 / 1000);
//         map.easeTo({
//           center: end,
//           duration: duration,
//           zoom: 20,
//           pitch: 50,
//           bearing: step.maneuver.bearing_after,
//           easing: function(t) {
//             return t;
//           }
//         });

//         updateLiveLocationMarker(end); // Update the live location marker's position

//         currentStep++;
//         if (currentStep < steps.length) {
//           setTimeout(moveAlongPath, duration);
//         } else {
//           // If the current step is the last step, wait for a few seconds and then redirect to the next page
//           setTimeout(function() {
//             window.location.href = "https://lh3.googleusercontent.com/yPVzBgXmvBwc66iU1wzJkDqjFJZuqRiCHb9Ol2N6cKDQkGoMa5Wh9fC4_C3hnr9IlpNxwgWnADk=m18?cpn=Q7DSXTpzKYOi4rNA";
//           }, 5000);
//         }
//       };

//       moveAlongPath();


//     }
//   });

//   // Change the map style to the desired style
//   // map.setStyle('mapbox://styles/nilay-welogical/clfgazmj6004y01qp1pjwegrl');
//   // map.setStyle('mapbox://styles/nilay-welogical/clfgccr8n000a01mru7lobpx0');
// }

// // Add event listener to the button
// document.getElementById('directions-btn').addEventListener('click', getDirections);




// car code 

// Direction code starts

// // Define the live location marker
// const liveLocationMarker = new mapboxgl.Marker({
//   color: "blue",
//   element: document.createElement("div"),
// }).setLngLat([77.587384, 12.917639]); // Set initial location

// // Set the marker's icon to a car
// liveLocationMarker.getElement().innerHTML = '<i class="fa fa-car" style="font-size:20px;color:red;"></i>';

// // Add the marker to the map
// liveLocationMarker.addTo(map);

// // Update the live location marker's position as the user moves
// function updateLiveLocationMarker(lngLat) {
//   liveLocationMarker.setLngLat(lngLat);
// }

// // // Define the function to get directions
// function getDirections() {
//   // Direction origin and destination lat,long
//   directions.setOrigin([77.587384, 12.917639]);
//   directions.setDestination([longitude, latitude]);

//   // When the route is calculated, rotate the camera towards the destination
//   directions.on('route', function(event) {
//     if (event.route && event.route[0] && event.route[0].legs && event.route[0].legs[0]) {
//       const start = event.route[0].legs[0].steps[0].maneuver.location;
//       const end = event.route[0].legs[0].steps[event.route[0].legs[0].steps.length - 1].maneuver.location;
//       const bearing = turf.bearing(
//         turf.point([start[0], start[1]]),
//         turf.point([end[0], end[1]])
//       );
//       map.flyTo({
//         center: start,
//         zoom: 25,
//         bearing: bearing,
//         pitch: 50,
//         speed: 10,
//         curve: 1
//       });

//       let currentStep = 0;
//       const steps = event.route[0].legs[0].steps;
//       const moveAlongPath = function() {
//         const step = steps[currentStep];
//         const end = step.maneuver.location;
//         const distance = turf.distance(turf.point(start), turf.point(end));
//         const duration = distance / (0.5 / 10000);
//         map.easeTo({
//           center: end,
//           duration: duration,
//           zoom: 21,
//           pitch: 50,
//           bearing: step.maneuver.bearing_after,
//           easing: function(t) {
//             return t;
//           }
//         });

//         updateLiveLocationMarker(end); // Update the live location marker's position

//         currentStep++;
//         if (currentStep < steps.length) {
//           setTimeout(moveAlongPath, duration);
//         } else {
//           // If the current step is the last step, wait for a few seconds and then redirect to the next page
//           setTimeout(function() {
//             window.location.href = "https://lh3.googleusercontent.com";
//           }, 5000);
//         }
//       };

//       moveAlongPath();

//     }
//   });
// }

// // Add event listener to the button
// document.getElementById('directions-btn').addEventListener('click', getDirections);

// // car coded ends



// Direction code starts (Backup)

// Define the live location marker
// const liveLocationMarker = new mapboxgl.Marker({
//   color: "blue",
// }).setLngLat([77.587384, 12.917639]) // Set initial location

// // Add the marker to the map
// liveLocationMarker.addTo(map);

// // Update the live location marker's position as the user moves
// function updateLiveLocationMarker(lngLat) {
//   liveLocationMarker.setLngLat(lngLat);
// }


// // Define the function to get directions
// function getDirections() {
//   // Direction origin and destination lat,long
//   directions.setOrigin([77.587384, 12.917639]);
//   directions.setDestination([longitude, latitude]);

//   // When the route is calculated, rotate the camera towards the destination
//   directions.on('route', function(event) {
//     if (event.route && event.route[0] && event.route[0].legs && event.route[0].legs[0]) {
//       const start = event.route[0].legs[0].steps[0].maneuver.location;
//       const end = event.route[0].legs[0].steps[event.route[0].legs[0].steps.length - 1].maneuver.location;
//       const bearing = turf.bearing(
//         turf.point([start[0], start[1]]),
//         turf.point([end[0], end[1]])
//       );
//       map.flyTo({
//         center: start,
//         zoom: 25,
//         bearing: bearing,
//         pitch: 50,
//         speed: 10,
//         curve: 1
//       });

//       let currentStep = 0;
//       const steps = event.route[0].legs[0].steps;
//       const moveAlongPath = function() {
//         const step = steps[currentStep];
//         const end = step.maneuver.location;
//         const distance = turf.distance(turf.point(start), turf.point(end));
//         const duration = distance / (0.5 / 10000);
//         map.easeTo({
//           center: end,
//           duration: duration,
//           zoom: 21,
//           pitch: 50,
//           bearing: step.maneuver.bearing_after,
//           easing: function(t) {
//             return t;
//           }
//         });

//         updateLiveLocationMarker(end); // Update the live location marker's position

//         currentStep++;
//         if (currentStep < steps.length) {
//           setTimeout(moveAlongPath, duration);
//         } else {
//           // If the current step is the last step, wait for a few seconds and then redirect to the next page
//           setTimeout(function() {
//             window.location.href = "https://lh3.googleusercontent.com";
//           }, 5000);
//         }
//       };

//       moveAlongPath();

//     }
//   });
// }

// // Add event listener to the button
// document.getElementById('directions-btn').addEventListener('click', getDirections);

// // Direction code ends


// // // Define the function to get directions
// function getDirections() {
//   // Direction origin and destination lat,long
//   directions.setOrigin([77.587384, 12.917639]);
//   directions.setDestination([longitude, latitude]);

//   // When the route is calculated, rotate the camera towards the destination
//   directions.on('route', function(event) {
//     if (event.route && event.route[0] && event.route[0].legs && event.route[0].legs[0]) {
//       const start = event.route[0].legs[0].steps[0].maneuver.location;
//       const end = event.route[0].legs[0].steps[event.route[0].legs[0].steps.length - 1].maneuver.location;
//       const bearing = turf.bearing(
//         turf.point([start[0], start[1]]),
//         turf.point([end[0], end[1]])
//       );
//       map.flyTo({
//         center: start,
//         zoom: 25,
//         bearing: bearing,
//         pitch: 50,
//         speed: 10,
//         curve: 1
//       });

//       let currentStep = 0;
//       const steps = event.route[0].legs[0].steps;
//       const moveAlongPath = function() {
//         const step = steps[currentStep];
//         const end = step.maneuver.location;
//         const distance = turf.distance(turf.point(start), turf.point(end));
//         const duration = distance / (1 / 10000);
//         map.easeTo({
//           center: end,
//           duration: duration,
//           zoom: 21,
//           pitch: 50,
//           bearing: step.maneuver.bearing_after,
//           easing: function(t) {
//             return t;
//           }
//         });

//         updateLiveLocationMarker(end); // Update the live location marker's position

//         currentStep++;
//         if (currentStep < steps.length) {
//           setTimeout(moveAlongPath, duration);
//         } else {
//           //If the current step is the last step, wait for a few seconds and then redirect to the next page
//           setTimeout(function() {
//             window.location.href = "https://lh3.googleusercontent.com/yPVzBgXmvBwc66iU1wzJkDqjFJZuqRiCHb9Ol2N6cKDQkGoMa5Wh9fC4_C3hnr9IlpNxwgWnADk=m18?cpn=Q7DSXTpzKYOi4rNA";
//           }, 8000);
//         }
//       };

//       moveAlongPath();

//     }
//   });
// }

// function getDirections() {
//   // Direction origin and destination lat,long
//   directions.setOrigin([77.587384, 12.917639]);
//   directions.setDestination([longitude, latitude]);

//   // When the route is calculated, rotate the camera towards the destination
//   directions.on('route', function(event) {
//     if (event.route && event.route[0] && event.route[0].legs && event.route[0].legs[0]) {
//       const start = event.route[0].legs[0].steps[0].maneuver.location;
//       const end = event.route[0].legs[0].steps[event.route[0].legs[0].steps.length - 1].maneuver.location;
//       const bearing = turf.bearing(
//         turf.point([start[0], start[1]]),
//         turf.point([end[0], end[1]])
//       );
//       map.flyTo({
//         center: start,
//         zoom: 25,
//         bearing: bearing,
//         pitch: 50,
//         speed: 10,
//         curve: 1
//       });

//       let currentStep = 0;
//       const steps = event.route[0].legs[0].steps;
//       const moveAlongPath = function(callback) {
//         const step = steps[currentStep];
//         const end = step.maneuver.location;
//         const distance = turf.distance(turf.point(start), turf.point(end));
//         const duration = distance / (0.9 / 10000);
//         map.easeTo({
//           center: end,
//           duration: duration,
//           zoom: 21,
//           pitch: 50,
//           bearing: step.maneuver.bearing_after,
//           easing: function(t) {
//             return t;
//           },
//           // Execute the callback once the camera reaches the destination
//           complete: callback
//         });

//         updateLiveLocationMarker(end); // Update the live location marker's position

//         currentStep++;
//         if (currentStep < steps.length) {
//           setTimeout(function() {
//             moveAlongPath(callback);
//           }, duration);
//         } else {
//           // If the current step is the last step, wait for a few seconds and then redirect to the next page
//           setTimeout(function() {
//             window.location.href = "https://lh3.googleusercontent.com/yPVzBgXmvBwc66iU1wzJkDqjFJZuqRiCHb9Ol2N6cKDQkGoMa5Wh9fC4_C3hnr9IlpNxwgWnADk=m18?cpn=Q7DSXTpzKYOi4rNA";
//           }, 5000);
//         }
//       };

//       moveAlongPath();

//     }
//   });
// }


// // Direction codes starts

// // Define the live location marker
// const liveLocationMarker = new mapboxgl.Marker({

//   element: createMarkerElement("static/map_box/3d_models/2016+Mercedes-Benz+-+AMG+GT.skp")
// }).setLngLat([77.587384, 12.917639]); // Set initial location

// // Add the marker to the map
// liveLocationMarker.addTo(map);

// // Update the live location marker's position as the user moves
// function updateLiveLocationMarker(lngLat) {
//   liveLocationMarker.setLngLat(lngLat);
// }

// // Create the marker element with a 3D model
// function createMarkerElement(src) {
//   const el = document.createElement("div");
//   el.innerHTML = `<img src="${src}" style="width: 50px; height: 50px;">`;
//   return el;
// }

// // Define the function to get directions
// function getDirections() {
//   // Direction origin and destination lat,long
//   directions.setOrigin([77.587384, 12.917639]);
//   directions.setDestination([longitude, latitude]);

//   // When the route is calculated, rotate the camera towards the destination
//   directions.on('route', function(event) {
//     if (event.route && event.route[0] && event.route[0].legs && event.route[0].legs[0]) {
//       const start = event.route[0].legs[0].steps[0].maneuver.location;
//       const end = event.route[0].legs[0].steps[event.route[0].legs[0].steps.length - 1].maneuver.location;
//       const bearing = turf.bearing(
//         turf.point([start[0], start[1]]),
//         turf.point([end[0], end[1]])
//       );
//       map.flyTo({
//         center: start,
//         zoom: 25,
//         bearing: bearing,
//         pitch: 50,
//         speed: 10,
//         curve: 1
//       });

//       let currentStep = 0;
//       const steps = event.route[0].legs[0].steps;
//       const moveAlongPath = function() {
//         const step = steps[currentStep];
//         const end = step.maneuver.location;
//         const distance = turf.distance(turf.point(start), turf.point(end));
//         const duration = distance / (0.5 / 10000);
//         map.easeTo({
//           center: end,
//           duration: duration,
//           zoom: 21,
//           pitch: 50,
//           bearing: step.maneuver.bearing_after,
//           easing: function(t) {
//             return t;
//           }
//         });

//         updateLiveLocationMarker(end); // Update the live location marker's position

//         currentStep++;
//         if (currentStep < steps.length) {
//           setTimeout(moveAlongPath, duration);
//         } else {
//           // If the current step is the last step, wait for a few seconds and then redirect to the next page
//           setTimeout(function() {
//             window.location.href = "https://lh3.googleusercontent.com";
//           }, 5000);
//         }
//       };

//       moveAlongPath();

//     }
//   });
// }

// // Add event listener to the button
// document.getElementById('directions-btn').addEventListener('click', getDirections);

// // Direction codes ends






// // Switch between layerList
// const layerList = document.getElementById('menu');
// const inputs = layerList.getElementsByTagName('input');

// for (const input of inputs) {
//     input.onclick = (layer) => {
//         const layerId = layer.target.id;
//         map.setStyle('mapbox://styles/mapbox/' + layerId);
       
//     }; 
// }

// // Initialize Mapbox directions plugin
// const directions = new MapboxDirections({
//     accessToken: mapboxgl.accessToken,
//     unit: 'metric',
//     profile: 'mapbox/driving',
//     alternatives: false,
//     interactive: false,
//     congestion: true
// });
// map.addControl(directions, 'top-left');

// directions.setOrigin([77.587384, 12.917639]);
// directions.setDestination([longitude, latitude]);

// Js code ends here










// // Define the car marker
// const carMarker = new mapboxgl.Marker({
//   element: document.createElement("img"),
//   anchor: "bottom",
//   rotate: 0,
// })
// .setLngLat([77.587384, 12.917639])
// .addTo(map);

// // Set the car icon image
// carMarker._element.src = "static/map_box/images/Untitled.glb";
// carMarker._element.style.width = "50px";
// carMarker._element.style.height = "50px";

// // Update the car marker's position and rotation
// function updateCarMarker(lngLat, bearing) {
//   carMarker.setLngLat(lngLat);
//   carMarker.setRotation(bearing);
// }

// // Define the function to get directions
// function getDirections() {

//   // Direction origin and destination lat,long
//   directions.setOrigin([77.587384, 12.917639]);
//   directions.setDestination([longitude, latitude]);

//   // When the route is calculated, rotate the camera towards the destination
//   directions.on('route', function(event) {
//     if (event.route && event.route[0] && event.route[0].legs && event.route[0].legs[0]) {
//       const start = event.route[0].legs[0].steps[0].maneuver.location;
//       const end = event.route[0].legs[0].steps[event.route[0].legs[0].steps.length - 1].maneuver.location;
//       const bearing = turf.bearing(
//         turf.point([start[0], start[1]]),
//         turf.point([end[0], end[1]])
//       );
//       map.flyTo({
//         center: start,
//         zoom: 25,
//         bearing: bearing,
//         pitch: 50,
//         speed: 10,
//         curve: 1
//       });

//       let currentStep = 0;
//       const steps = event.route[0].legs[0].steps;
//       const moveAlongPath = function() {
//         const step = steps[currentStep];
//         const end = step.maneuver.location;
//         const distance = turf.distance(turf.point(start), turf.point(end));
//         const duration = distance / (0.5 / 10000);
//         map.easeTo({
//           center: end,
//           duration: duration,
//           zoom: 21,
//           pitch: 50,
//           bearing: step.maneuver.bearing_after,
//           easing: function(t) {
//             return t;
//           }
//         });

//         updateCarMarker(end, step.maneuver.bearing_after); // Update the car marker's position and rotation

//         currentStep++;
//         if (currentStep < steps.length) {
//           setTimeout(moveAlongPath, duration);
//         } else {
//           // If the current step is the last step, wait for a few seconds and then redirect to the next page
//           setTimeout(function() {
//             window.location.href = "https://lh3.googleusercontent.com/yPVzBgXmvBwc66iU1wzJkDqjFJZuqRiCHb9Ol2N6cKDQkGoMa5Wh9fC4_C3hnr9IlpNxwgWnADk=m18?cpn=Q7DSXTpzKYOi4rNA";
//           }, 5000);
//         }
//       };

//        moveAlongPath();

//     }
//   });
// }

// // Add event listener to the button
// document.getElementById('directions-btn').addEventListener('click', getDirections);





// // Define the live location marker
// const liveLocationMarker = new mapboxgl.Marker({
//   color: "blue",
// }).setLngLat([77.587384, 12.917639]); // Set initial location

// // Add the marker to the map
// liveLocationMarker.addTo(map);

// // Update the live location marker's position as the user moves
// function updateLiveLocationMarker(lngLat) {
//   liveLocationMarker.setLngLat(lngLat);
// }


// // Define the function to get directions
// function getDirections() {

//   // Direction origin and destination lat,long
//   directions.setOrigin([77.587384, 12.917639]);
//   directions.setDestination([longitude, latitude]);

//   // When the route is calculated, rotate the camera towards the destination
//   directions.on('route', function(event) {
//     if (event.route && event.route[0] && event.route[0].legs && event.route[0].legs[0]) {
//       const start = event.route[0].legs[0].steps[0].maneuver.location;
//       const end = event.route[0].legs[0].steps[event.route[0].legs[0].steps.length - 1].maneuver.location;
//       const bearing = turf.bearing(
//         turf.point([start[0], start[1]]),
//         turf.point([end[0], end[1]])
//       );
//       map.flyTo({
//         center: start,
//         zoom: 25,
//         bearing: bearing,
//         pitch: 50,
//         speed: 10,
//         curve: 1
//       });

//       let currentStep = 0;
//       const steps = event.route[0].legs[0].steps;
//       const moveAlongPath = function() {
//         const step = steps[currentStep];
//         const end = step.maneuver.location;
//         const distance = turf.distance(turf.point(start), turf.point(end));
//         const duration = distance / (0.5 / 10000);
//         map.easeTo({
//           center: end,
//           duration: duration,
//           zoom: 21,
//           pitch: 50,
//           bearing: step.maneuver.bearing_after,
//           easing: function(t) {
//             return t;
//           }
//         });

//         updateLiveLocationMarker(end); // Update the live location marker's position

//         // currentStep++;
//         // if (currentStep < steps.length) {
//         //   setTimeout(moveAlongPath, duration);
//         // }

//         // if (currentStep === steps.length - 1) {
//         //   setTimeout(function() {moveAlongPath,
//         //     // window.location.href = "https://lh3.googleusercontent.com";
//         //     window.location.href = "https://lh3.googleusercontent.com/yPVzBgXmvBwc66iU1wzJkDqjFJZuqRiCHb9Ol2N6cKDQkGoMa5Wh9fC4_C3hnr9IlpNxwgWnADk=m18?cpn=Q7DSXTpzKYOi4rNA";
                    
//         //     }, duration);
//         //   }
//         // };

//         currentStep++;
//         if (currentStep < steps.length) {
//           setTimeout(moveAlongPath, duration);
//         } else {
//           // If the current step is the last step, wait for a few seconds and then redirect to the next page
//           setTimeout(function() {
//             window.location.href = "https://lh3.googleusercontent.com/yPVzBgXmvBwc66iU1wzJkDqjFJZuqRiCHb9Ol2N6cKDQkGoMa5Wh9fC4_C3hnr9IlpNxwgWnADk=m18?cpn=Q7DSXTpzKYOi4rNA";
//           }, 5000);
//         }
//       };

//       moveAlongPath();

//     }
//   });


//   // Change the map style to the desired style
//   // map.setStyle('mapbox://styles/nilay-welogical/clfgazmj6004y01qp1pjwegrl');
//   // map.setStyle('mapbox://styles/nilay-welogical/clfgccr8n000a01mru7lobpx0');
// }

// // Add event listener to the button
// document.getElementById('directions-btn').addEventListener('click', getDirections);

// // Direction code ends






// Old Js code

// var mapElem = document.getElementById('map');
// var latitude = mapElem.dataset.latitude;
// var longitude = mapElem.dataset.longitude;

// console.log(latitude)
// console.log(longitude)

// mapboxgl.accessToken = 'pk.eyJ1IjoibmlsYXktd2Vsb2dpY2FsIiwiYSI6ImNsZjZjMzRreDE1eG8zeW50YWplOHBvYTYifQ.Wk6TflXVfKBFSDBlxzpZHg'

// //  Making map
// var map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mapbox/satellite-streets-v12',
//     // style: 'mapbox://styles/mapbox/satellite-v9',
//     // style: 'mapbox://styles/mapbox/dark-v11',
//     // style: 'mapbox://styles/mapbox/outdoors-v12',

//     // center: [-110, 45],
//     // center: [77.587384, 12.917639],
//     center: [77.57527924, 12.97674656],

//     // center: [-122.4194, 37.7749],

//     zoom: 20,
//     pitch: 50
// });


// // Switch between layerList
// const layerList = document.getElementById('menu');
// const inputs = layerList.getElementsByTagName('input');

// for (const input of inputs) {
//     input.onclick = (layer) => {
//         const layerId = layer.target.id;
//         map.setStyle('mapbox://styles/mapbox/' + layerId);
//     }; 
// }

// // Create a 3D building layer for the map
// map.on('load', function() {

//     map.addLayer({
//       'id': '3d-buildings',
//       'source': 'composite',
//       'source-layer': 'building',
//       'filter': ['==', 'extrude', 'true'],
//       'type': 'fill-extrusion',
//       'minzoom': 20,
//       'paint': {
//         // 'fill-extrusion-color': 'violet',
//         'fill-extrusion-color': '#aaa',

//         'fill-extrusion-height': [
//           'interpolate', ['linear'], ['zoom'],
//           15, 0,
//           15.05, ['get', 'height']
//         ],
//         'fill-extrusion-base': [
//           'interpolate', ['linear'], ['zoom'],
//           15, 0,
//           15.05, ['get', 'min_height']
//         ],
//         'fill-extrusion-opacity': 0.6
//       }
//     });

//     // Define the live location marker
//     const liveLocationMarker = new mapboxgl.Marker({
//       color: "blue",
//     }).setLngLat([77.587384, 12.917639]) // Set initial location

//     // Add the marker to the map
//     liveLocationMarker.addTo(map);

//     // Update the live location marker's position as the user moves
//     function updateLiveLocationMarker(lngLat) {
//       liveLocationMarker.setLngLat(lngLat);
//     }
    
//     // Direction code
//     directions.setOrigin([77.587384, 12.917639]);
//     directions.setDestination([longitude, latitude]);

//     // When the route is calculated, rotate the camera towards the destination
//     directions.on('route', function(event) {
//         if (event.route && event.route[0] && event.route[0].legs && event.route[0].legs[0]) {
//             const start = event.route[0].legs[0].steps[0].maneuver.location;
//             const end = event.route[0].legs[0].steps[event.route[0].legs[0].steps.length - 1].maneuver.location;
//             const bearing = turf.bearing(
//               turf.point([start[0], start[1]]),
//               turf.point([end[0], end[1]])
//             );
//             map.flyTo({
//               center: start,
//               // zoom: 16,
//               zoom: 25,
//               // bearing: step.maneuver.bearing_after,
//               bearing: bearing,
//               pitch:50,
//               // speed: 0.9,
//               speed: 10,
//               curve: 1
//             });

//             let currentStep = 0;
//             const steps = event.route[0].legs[0].steps;
//             const moveAlongPath = function() {
//                 const step = steps[currentStep];
//                 const end = step.maneuver.location;
//                 const distance = turf.distance(turf.point(start), turf.point(end));
//                 const duration = distance / (1 / 10000);
//                 map.easeTo({
//                   center: end,
//                   duration: duration,
//                   zoom: 21,
//                   pitch: 50,
//                   bearing: step.maneuver.bearing_after,
//                   easing: function(t) {
//                     return t;
//                   }
//                 });


//                 updateLiveLocationMarker(end); // Update the live location marker's position
                
//                 currentStep++;
//                 if (currentStep < steps.length) {
//                     setTimeout(moveAlongPath, duration);
//                 }

//                 if (currentStep === steps.length - 1) {
//                   setTimeout(function() {
//                     // window.location.href = "https://www.google.com/maps/place/NIMHANS+Hospital/@12.9387894,77.5941391,3a,75y,90t/data=!3m8!1e5!3m6!1sAF1QipMD7506ve4q3IBIUl1AdUeEfH9xxmxu8eZg0xQd!2e10!3e10!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipMD7506ve4q3IBIUl1AdUeEfH9xxmxu8eZg0xQd%3Dw224-h398-k-no!7i1080!8i1920!4m6!3m5!1s0x3bae15bb339dc6cb:0x37c5427803dec2ce!8m2!3d12.9387894!4d77.5941391!16s%2Fg%2F11h069zq1nL";
//                     window.location.href = "https://lh3.googleusercontent.com/yPVzBgXmvBwc66iU1wzJkDqjFJZuqRiCHb9Ol2N6cKDQkGoMa5Wh9fC4_C3hnr9IlpNxwgWnADk=m18?cpn=Q7DSXTpzKYOi4rNA";
                    
//                   }, duration);
//                 }
//             };

//             moveAlongPath();
//         }
//     });
// })

// // Full screen control
// map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

// // Navigation Control
// // map.addControl(new mapboxgl.NavigationControl(), 'top-right');

// // 3d view navigation
// map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

// // Live Location control
// map.addControl(new mapboxgl.GeolocateControl({
//   positionOptions: {
//       enableHighAccuracy: true
//   },
//   trackUserLocation: true,
//   showUserHeading: true
// }), 'top-right');

// // Initialize Mapbox directions plugin
// const directions = new MapboxDirections({
//     accessToken: mapboxgl.accessToken,
//     unit: 'metric',
//     profile: 'mapbox/driving',
//     alternatives: false,
//     interactive: false,
//     congestion: true
// });
// map.addControl(directions, 'top-left');




// var mapElem = document.getElementById('map');
// var latitude = mapElem.dataset.latitude;
// var longitude = mapElem.dataset.longitude;

// console.log(latitude)
// console.log(longitude)

// mapboxgl.accessToken = 'pk.eyJ1IjoibmlsYXktd2Vsb2dpY2FsIiwiYSI6ImNsZjZjMzRreDE1eG8zeW50YWplOHBvYTYifQ.Wk6TflXVfKBFSDBlxzpZHg'

// //  Making map
// var map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mapbox/satellite-streets-v12',
//     // style: 'mapbox://styles/mapbox/satellite-v9',
//     // style: 'mapbox://styles/mapbox/dark-v11',
//     // style: 'mapbox://styles/mapbox/outdoors-v12',

//     // center: [-110, 45],
//     // center: [77.587384, 12.917639],
//     center: [77.57527924, 12.97674656],

//     // center: [-122.4194, 37.7749],

//     zoom: 20,
//     pitch: 50
// });


// // Switch between layerList
// const layerList = document.getElementById('menu');
// const inputs = layerList.getElementsByTagName('input');

// for (const input of inputs) {
//     input.onclick = (layer) => {
//         const layerId = layer.target.id;
//         map.setStyle('mapbox://styles/mapbox/' + layerId);
//     }; 
// }

// // Create a 3D building layer for the map
// map.on('load', function() {

//     map.addLayer({
//       'id': '3d-buildings',
//       'source': 'composite',
//       'source-layer': 'building',
//       'filter': ['==', 'extrude', 'true'],
//       'type': 'fill-extrusion',
//       'minzoom': 20,
//       'paint': {
//         // 'fill-extrusion-color': 'violet',
//         'fill-extrusion-color': '#aaa',

//         'fill-extrusion-height': [
//           'interpolate', ['linear'], ['zoom'],
//           15, 0,
//           15.05, ['get', 'height']
//         ],
//         'fill-extrusion-base': [
//           'interpolate', ['linear'], ['zoom'],
//           15, 0,
//           15.05, ['get', 'min_height']
//         ],
//         'fill-extrusion-opacity': 0.6
//       }
//     });

//     // Define the live location marker
//     const liveLocationMarker = new mapboxgl.Marker({
//       color: "blue",
//     }).setLngLat([77.587384, 12.917639]) // Set initial location

//     // Add the marker to the map
//     liveLocationMarker.addTo(map);

//     // Update the live location marker's position as the user moves
//     function updateLiveLocationMarker(lngLat) {
//       liveLocationMarker.setLngLat(lngLat);
//     }
    
//     // Direction code
//     directions.setOrigin([77.587384, 12.917639]);
//     directions.setDestination([longitude, latitude]);

//     // When the route is calculated, rotate the camera towards the destination
//     directions.on('route', function(event) {
//         if (event.route && event.route[0] && event.route[0].legs && event.route[0].legs[0]) {
//             const start = event.route[0].legs[0].steps[0].maneuver.location;
//             const end = event.route[0].legs[0].steps[event.route[0].legs[0].steps.length - 1].maneuver.location;
//             const bearing = turf.bearing(
//               turf.point([start[0], start[1]]),
//               turf.point([end[0], end[1]])
//             );
//             map.flyTo({
//               center: start,
//               // zoom: 16,
//               zoom: 25,
//               // bearing: step.maneuver.bearing_after,
//               bearing: bearing,
//               pitch:50,
//               // speed: 0.9,
//               speed: 10,
//               curve: 1
//             });

//             let currentStep = 0;
//             const steps = event.route[0].legs[0].steps;
//             const moveAlongPath = function() {
//                 const step = steps[currentStep];
//                 const end = step.maneuver.location;
//                 const distance = turf.distance(turf.point(start), turf.point(end));
//                 const duration = distance / (1 / 10000);
//                 map.easeTo({
//                   center: end,
//                   duration: duration,
//                   zoom: 21,
//                   pitch: 50,
//                   bearing: step.maneuver.bearing_after,
//                   easing: function(t) {
//                     return t;
//                   }
//                 });


//                 updateLiveLocationMarker(end); // Update the live location marker's position
                
//                 currentStep++;
//                 if (currentStep < steps.length) {
//                     setTimeout(moveAlongPath, duration);
//                 }

//                 if (currentStep === steps.length - 1) {
//                   setTimeout(function() {
//                     // window.location.href = "https://www.google.com/maps/place/NIMHANS+Hospital/@12.9387894,77.5941391,3a,75y,90t/data=!3m8!1e5!3m6!1sAF1QipMD7506ve4q3IBIUl1AdUeEfH9xxmxu8eZg0xQd!2e10!3e10!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipMD7506ve4q3IBIUl1AdUeEfH9xxmxu8eZg0xQd%3Dw224-h398-k-no!7i1080!8i1920!4m6!3m5!1s0x3bae15bb339dc6cb:0x37c5427803dec2ce!8m2!3d12.9387894!4d77.5941391!16s%2Fg%2F11h069zq1nL";
//                     window.location.href = "https://lh3.googleusercontent.com/yPVzBgXmvBwc66iU1wzJkDqjFJZuqRiCHb9Ol2N6cKDQkGoMa5Wh9fC4_C3hnr9IlpNxwgWnADk=m18?cpn=Q7DSXTpzKYOi4rNA";
                    
//                   }, duration);
//                 }
//             };

//             moveAlongPath();
//         }
//     });
// })

// // Full screen control
// map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

// // Navigation Control
// // map.addControl(new mapboxgl.NavigationControl(), 'top-right');

// // 3d view navigation
// map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

// // Live Location control
// map.addControl(new mapboxgl.GeolocateControl({
//   positionOptions: {
//       enableHighAccuracy: true
//   },
//   trackUserLocation: true,
//   showUserHeading: true
// }), 'top-right');

// // Initialize Mapbox directions plugin
// const directions = new MapboxDirections({
//     accessToken: mapboxgl.accessToken,
//     unit: 'metric',
//     profile: 'mapbox/driving',
//     alternatives: false,
//     interactive: false,
//     congestion: true
// });
// map.addControl(directions, 'top-left');




// old code

// var mapElem = document.getElementById('map');
// var latitude = mapElem.dataset.latitude;
// var longitude = mapElem.dataset.longitude;

// console.log(latitude)
// console.log(longitude)

// mapboxgl.accessToken = 'pk.eyJ1IjoibmlsYXktd2Vsb2dpY2FsIiwiYSI6ImNsZjZjMzRreDE1eG8zeW50YWplOHBvYTYifQ.Wk6TflXVfKBFSDBlxzpZHg'

// //  Making map
// var map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mapbox/satellite-streets-v12',
//     // style: 'mapbox://styles/mapbox/satellite-v9',
//     // style: 'mapbox://styles/mapbox/dark-v11',
//     // style: 'mapbox://styles/mapbox/outdoors-v12',

//     // center: [-110, 45],
//     // center: [77.587384, 12.917639],
//     center: [77.57527924, 12.97674656],

//     // center: [-122.4194, 37.7749],

//     zoom: 20,
//     pitch: 50
// });


// // Switch between layerList
// const layerList = document.getElementById('menu');
// const inputs = layerList.getElementsByTagName('input');

// for (const input of inputs) {
//     input.onclick = (layer) => {
//         const layerId = layer.target.id;
//         map.setStyle('mapbox://styles/mapbox/' + layerId);
//     }; 
// }

// // Create a 3D building layer for the map
// map.on('load', function() {

//     map.addLayer({
//       'id': '3d-buildings',
//       'source': 'composite',
//       'source-layer': 'building',
//       'filter': ['==', 'extrude', 'true'],
//       'type': 'fill-extrusion',
//       'minzoom': 20,
//       'paint': {
//         // 'fill-extrusion-color': 'violet',
//         'fill-extrusion-color': '#aaa',

//         'fill-extrusion-height': [
//           'interpolate', ['linear'], ['zoom'],
//           15, 0,
//           15.05, ['get', 'height']
//         ],
//         'fill-extrusion-base': [
//           'interpolate', ['linear'], ['zoom'],
//           15, 0,
//           15.05, ['get', 'min_height']
//         ],
//         'fill-extrusion-opacity': 0.6
//       }
//     });

//     // Define the live location marker
//     const liveLocationMarker = new mapboxgl.Marker({
//       color: "blue",
//     }).setLngLat([77.587384, 12.917639]) // Set initial location

//     // Add the marker to the map
//     liveLocationMarker.addTo(map);

//     // Update the live location marker's position as the user moves
//     function updateLiveLocationMarker(lngLat) {
//       liveLocationMarker.setLngLat(lngLat);
//     }
    
//     // Direction code
//     directions.setOrigin([77.587384, 12.917639]);
//     directions.setDestination([longitude, latitude]);

//     // When the route is calculated, rotate the camera towards the destination
//     directions.on('route', function(event) {
//         if (event.route && event.route[0] && event.route[0].legs && event.route[0].legs[0]) {
//             const start = event.route[0].legs[0].steps[0].maneuver.location;
//             const end = event.route[0].legs[0].steps[event.route[0].legs[0].steps.length - 1].maneuver.location;
//             const bearing = turf.bearing(
//               turf.point([start[0], start[1]]),
//               turf.point([end[0], end[1]])
//             );
//             map.flyTo({
//               center: start,
//               // zoom: 16,
//               zoom: 25,
//               // bearing: step.maneuver.bearing_after,
//               bearing: bearing,
//               pitch:50,
//               // speed: 0.9,
//               speed: 10,
//               curve: 1
//             });

//             let currentStep = 0;
//             const steps = event.route[0].legs[0].steps;
//             const moveAlongPath = function() {
//                 const step = steps[currentStep];
//                 const end = step.maneuver.location;
//                 const distance = turf.distance(turf.point(start), turf.point(end));
//                 const duration = distance / (1 / 10000);
//                 map.easeTo({
//                   center: end,
//                   duration: duration,
//                   zoom: 21,
//                   pitch: 50,
//                   bearing: step.maneuver.bearing_after,
//                   easing: function(t) {
//                     return t;
//                   }
//                 });


//                 updateLiveLocationMarker(end); // Update the live location marker's position
                
//                 currentStep++;
//                 if (currentStep < steps.length) {
//                     setTimeout(moveAlongPath, duration);
//                 }

//                 if (currentStep === steps.length - 1) {
//                   setTimeout(function() {
//                     // window.location.href = "https://www.google.com/maps/place/NIMHANS+Hospital/@12.9387894,77.5941391,3a,75y,90t/data=!3m8!1e5!3m6!1sAF1QipMD7506ve4q3IBIUl1AdUeEfH9xxmxu8eZg0xQd!2e10!3e10!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipMD7506ve4q3IBIUl1AdUeEfH9xxmxu8eZg0xQd%3Dw224-h398-k-no!7i1080!8i1920!4m6!3m5!1s0x3bae15bb339dc6cb:0x37c5427803dec2ce!8m2!3d12.9387894!4d77.5941391!16s%2Fg%2F11h069zq1nL";
//                     window.location.href = "https://lh3.googleusercontent.com/yPVzBgXmvBwc66iU1wzJkDqjFJZuqRiCHb9Ol2N6cKDQkGoMa5Wh9fC4_C3hnr9IlpNxwgWnADk=m18?cpn=Q7DSXTpzKYOi4rNA";
                    
//                   }, duration);
//                 }
//             };

//             moveAlongPath();
//         }
//     });
// })

// // Full screen control
// map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

// // Navigation Control
// // map.addControl(new mapboxgl.NavigationControl(), 'top-right');

// // 3d view navigation
// map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

// // Live Location control
// map.addControl(new mapboxgl.GeolocateControl({
//   positionOptions: {
//       enableHighAccuracy: true
//   },
//   trackUserLocation: true,
//   showUserHeading: true
// }), 'top-right');

// // Initialize Mapbox directions plugin
// const directions = new MapboxDirections({
//     accessToken: mapboxgl.accessToken,
//     unit: 'metric',
//     profile: 'mapbox/driving',
//     alternatives: false,
//     interactive: false,
//     congestion: true
// });
// map.addControl(directions, 'top-left');









    // Old navigation code

    // directions.setOrigin([77.587384, 12.917639]);
    // directions.setDestination([longitude, latitude]);

    // // When the route is calculated, rotate the camera towards the destination
    // directions.on('route', function(event) {
    //     if (event.route && event.route[0] && event.route[0].legs && event.route[0].legs[0]) {
    //         const start = event.route[0].legs[0].steps[0].maneuver.location;
    //         const end = event.route[0].legs[0].steps[event.route[0].legs[0].steps.length - 1].maneuver.location;
    //         const bearing = turf.bearing(
    //           turf.point([start[0], start[1]]),
    //           turf.point([end[0], end[1]])
    //         );
    //         map.flyTo({
    //           center: end,
    //           // zoom: 16,
    //           zoom: 22,
    //           bearing: 0, // Start with a bearing of 0
    //           speed: 0.1,
    //           curve: 1
    //         });

    //         // Gradually change the bearing to the final bearing over a period of time
    //         let currentBearing = 0;
    //         const bearingInterval = setInterval(function() {
    //             currentBearing += 1; // Change the bearing by 1 degree each time
    //             if (currentBearing >= bearing) { // If we have reached the final bearing, stop the interval
    //                 clearInterval(bearingInterval);
    //             }
    //             map.easeTo({
    //                 bearing: currentBearing,
    //                 duration: 10
    //             });
    //         }, 10);
    //     }
    // });












// old map box code


// var mapElem = document.getElementById("map");
// var latitude = mapElem.dataset.latitude;
// var longitude = mapElem.dataset.longitude;

// console.log(latitude)
// console.log(longitude)

// mapboxgl.accessToken = 'pk.eyJ1IjoibmlsYXktd2Vsb2dpY2FsIiwiYSI6ImNsZjZjMzRreDE1eG8zeW50YWplOHBvYTYifQ.Wk6TflXVfKBFSDBlxzpZHg'

// //  Making map
// const map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mapbox/satellite-streets-v12',
// //    style: 'mapbox://styles/mapbox/dark-v11',
//     center: [-110, 45],
//     zoom: 12
// })

// // Switch between layers
// const layerList = document.getElementById('menu');
// const inputs = layerList.getElementsByTagName('input');

// for (const input of inputs) {
//     input.onclick = (layer) => {
//         const layerId = layer.target.id;
//         map.setStyle('mapbox://styles/mapbox/' + layerId);
//     };
// }

// // Add 3D building layer at zoom level 18
// map.on('load', function () {
//     map.addLayer({
//         id: '3d-building',
//         source: 'composite',
//         'source-layer': 'building',
//         filter: ['==', 'extrude', 'true'],
//         type: 'fill-extrusion',
//         minzoom: 18,
//         paint: {
//             'fill-extrusion-color': '#aaa',
//             'fill-extrusion-height': [
//                 'interpolate', ['linear'], ['zoom'],
//                 15, 0,
//                 15.05, ['get', 'height']
//             ],
//             'fill-extrusion-base': [
//                 'interpolate', ['linear'], ['zoom'],
//                 15, 0,
//                 15.05, ['get', 'min_height']
//             ],
//             'fill-extrusion-opacity': .6
//         }
//     });

//     // Add a dark layer for zoom level 18 and above

//     map.addLayer({
//         id: 'dark-layer',
//         type: 'background',
//         paint: {
//             'background-color': 'black'
//         },
//         minzoom: 18
//     }, '3d-building');
// });

// const marker1 = new mapboxgl.Marker()
// .setLngLat([-110, 45])
// .addTo(map);

// const marker2 = new mapboxgl.Marker({
//     color: 'green',
//     rotation: 45
// })
// .setLngLat([-112, 42])
// .addTo(map);

// // Full screen control
// map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

// // Navigation Control
// map.addControl(new mapboxgl.NavigationControl(), 'top-right');

// // Live Location control
// map.addControl(new mapboxgl.GeolocateControl({
//     positionOptions: {
//         enableHighAccuracy: true
//     },
//     trackUserLocation: true,
//     showUserHeading: true
// }), 'top-right');


// // Direction control
// // Add Directions control and set the source and destination coordinates
// const directions = new MapboxDirections({
//     accessToken: mapboxgl.accessToken
// });

// map.addControl(directions, 'top-left');
// directions.setOrigin([77.587384, 12.917639]);
// directions.setDestination([longitude, latitude]);







